"use client";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useCallback, useEffect, useState } from "react";
import { useMicrophoneAccess } from "./useMicrophoneAccess";
import { base64DecodeOpus, base64EncodeOpus } from "./audioUtil";
import { useAudioProcessor as useAudioProcessor } from "./useAudioProcessor";
import { prettyPrintJson } from "pretty-print-json";
import PositionedAudioVisualizer from "./PositionedAudioVisualizer";
import  {
    DEFAULT_UNMUTE_CONFIG,
    UnmuteConfig,
} from "./UnmuteConfigurator";
import clsx from "clsx";
import { useBackendServerUrl } from "./useBackendServerUrl";
import { ChatMessage, compressChatHistory } from "./chatHistory";
import SlantedButton from "./sbutton";
import { useRecordingCanvas } from "./useRecordingCanvas";


const Unmute = () => {
    const [debugDict, setDebugDict] = useState<object | null>(null);
    const [unmuteConfig, setUnmuteConfig] = useState<UnmuteConfig>(
        DEFAULT_UNMUTE_CONFIG
    );

        const [rawChatHistory, setRawChatHistory] = useState<ChatMessage[]>([]);

      const chatHistory = compressChatHistory(rawChatHistory);

    const { microphoneAccess, askMicrophoneAccess } = useMicrophoneAccess();

    const [shouldConnect, setShouldConnect] = useState(false);
    const backendServerUrl = useBackendServerUrl();
    const [webSocketUrl, setWebSocketUrl] = useState<string | null>(null);




    // Check if the backend server is healthy. If we setHealthStatus to null,
    // a "server is down" screen will be shown.
    useEffect(() => {
        if (!backendServerUrl) return;

        setWebSocketUrl(backendServerUrl.toString() + "/v1/realtime");

        const checkHealth = async () => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000);

                const response = await fetch(`${backendServerUrl}/v1/health`, {
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);
                if (!response.ok) {
                    return;
                }
                const data = await response.json();
                data["connected"] = "yes_request_ok";

                if (data.ok && !data.voice_cloning_up) {
                    console.debug("Voice cloning not available, hiding upload button.");
                }
            } catch {
        
            }
        };

        checkHealth();
    }, [backendServerUrl]);

    const { sendMessage, lastMessage, readyState } = useWebSocket(
        webSocketUrl || null,
        {
            protocols: ["realtime"],
        },
        shouldConnect
    );

    // Send microphone audio to the server (via useAudioProcessor below)
    const onOpusRecorded = useCallback(
        (opus: Uint8Array) => {
            sendMessage(
                JSON.stringify({
                    type: "input_audio_buffer.append",
                    audio: base64EncodeOpus(opus),
                })
            );
        },
        [sendMessage]
    );

    const { setupAudio, shutdownAudio, audioProcessor } =
        useAudioProcessor(onOpusRecorded);
    const {
        canvasRef: recordingCanvasRef,
        downloadRecording,
        recordingAvailable,
    } = useRecordingCanvas({
        size: 1080,
        shouldRecord: shouldConnect,
        audioProcessor: audioProcessor.current,
        chatHistory: chatHistory,
    });
    const onConnectButtonPress = async () => {
        // If we're not connected yet
        if (!shouldConnect) {
            const mediaStream = await askMicrophoneAccess();
            // If we have access to the microphone:
            if (mediaStream) {
                await setupAudio(mediaStream);
                setShouldConnect(true);
            }
        } else {
            setShouldConnect(false);
            shutdownAudio();
        }
    };

    const onDownloadRecordingButtonPress = () => {
        try {
            downloadRecording(false);
        } catch (e) {
            if (e instanceof Error) {
            }
        }
    };

    // If the websocket connection is closed, shut down the audio processing
    useEffect(() => {
        if (readyState === ReadyState.CLOSING || readyState === ReadyState.CLOSED) {
            setShouldConnect(false);
            shutdownAudio();
        }
    }, [readyState, shutdownAudio]);

    // Handle incoming messages from the server
    useEffect(() => {
        if (lastMessage === null) return;

        const data = JSON.parse(lastMessage.data);
        if (data.type === "response.audio.delta") {
            const opus = base64DecodeOpus(data.delta);
            const ap = audioProcessor.current;
            if (!ap) return;

            ap.decoder.postMessage(
                {
                    command: "decode",
                    pages: opus,
                },
                [opus.buffer]
            );
        } else if (data.type === "unmute.additional_outputs") {
            setDebugDict(data.args.debug_dict);
        } else if (data.type === "error") {
            if (data.error.type === "warning") {
                console.warn(`Warning from server: ${data.error.message}`, data);
                // Warnings aren't explicitly shown in the UI
            } else {
                console.error(`Error from server: ${data.error.message}`, data);
            }
        } else if (
            data.type === "conversation.item.input_audio_transcription.delta"
        ) {
            // Transcription of the user speech

        } else if (data.type === "response.text.delta") {
            // Text-to-speech output

        } else {
            const ignoredTypes = [
                "session.updated",
                "response.created",
                "response.text.delta",
                "response.text.done",
                "response.audio.done",
                "conversation.item.input_audio_transcription.delta",
                "input_audio_buffer.speech_stopped",
                "input_audio_buffer.speech_started",
                "unmute.interrupted_by_vad",
                "unmute.response.text.delta.ready",
                "unmute.response.audio.delta.ready",
            ];
            if (!ignoredTypes.includes(data.type)) {
                console.warn("Received unknown message:", data);
            }
        }
    }, [audioProcessor, lastMessage]);

    // When we connect, we send the initial config (voice and instructions) to the server.
    // Also clear the chat history.
    useEffect(() => {
        if (readyState !== ReadyState.OPEN) return;

        const recordingConsent =

        setRawChatHistory([]);
        sendMessage(
            JSON.stringify({
                type: "session.update",
                session: {
                    instructions: unmuteConfig.instructions,
                    voice: unmuteConfig.voice,
                    allow_recording: recordingConsent,
                },
            })
        );
    }, [unmuteConfig, readyState, sendMessage]);

    // Disconnect when the voice or instruction changes.
    // TODO: If it's a voice change, immediately reconnect with the new voice.
    useEffect(() => {
        setShouldConnect(false);
        shutdownAudio();
    }, [shutdownAudio, unmuteConfig.voice, unmuteConfig.instructions]);

    if (!backendServerUrl) {
        return (
            <div className="flex flex-col gap-4 items-center">
                <h1 className="text-xl mb-4">Loading...</h1>
            </div>
        );
    }



    return (
        <div className="w-full">
            {/* The main full-height demo */}
            <div className="relative flex w-full min-h-screen flex-col text-white bg-background items-center">
                {/* z-index on the header to put it in front of the circles */}
                <div
                    className={clsx(
                        "w-full h-auto min-h-75",
                        "flex flex-row-reverse md:flex-row items-center justify-center grow",
                        "-mt-10 md:mt-0 mb-10 md:mb-0 md:-mr-4"
                    )}
                >
                    <PositionedAudioVisualizer
                        chatHistory={chatHistory}
                        role={"assistant"}
                        analyserNode={audioProcessor.current?.outputAnalyser || null}
                        onCircleClick={onConnectButtonPress}
                        isConnected={shouldConnect}
                    />
                    <PositionedAudioVisualizer
                        chatHistory={compressChatHistory(chatHistory)}
                        role={"user"}
                        analyserNode={audioProcessor.current?.inputAnalyser || null}
                        isConnected={shouldConnect}
                    />
                </div>
                <div className="w-full flex flex-col-reverse md:flex-row items-center justify-center px-3 gap-3 my-6">
                    <SlantedButton
                        onClick={onDownloadRecordingButtonPress}
                        kind={recordingAvailable ? "secondary" : "disabled"}
                        extraClasses="w-full max-w-96"
                    >
                        {"download recording"}
                    </SlantedButton>
                    <SlantedButton
                        onClick={onConnectButtonPress}
                        kind={shouldConnect ? "secondary" : "primary"}
                        extraClasses="w-full max-w-96"
                    >
                        {shouldConnect ? "disconnect" : "connect"}
                    </SlantedButton>
                    {/* Maybe we don't need to explicitly show the status */}
                    {/* {renderConnectionStatus(readyState, false)} */}
                    {microphoneAccess === "refused" && (
                        <div className="text-red">
                            {"You'll need to allow microphone access to use the demo. " +
                                "Please check your browser settings."}
                        </div>
                    )}
                </div>
            </div>
            {/* Debug stuff, not counted into the screen height */}
                <div>
                    <div className="text-xs w-full overflow-auto">
                        <pre
                            className="whitespace-pre-wrap break-words"
                            dangerouslySetInnerHTML={{
                                __html: prettyPrintJson.toHtml(debugDict),
                            }}
                        ></pre>
                    </div>
                    <div>Subtitles: press S. Dev mode: press D.</div>
                </div>
            <canvas ref={recordingCanvasRef} className="hidden" />
        </div>
    );
};

export default Unmute;


