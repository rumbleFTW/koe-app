"use client"

import { useState } from "react"
import { Play, Settings, Mic, SlidersHorizontal } from "lucide-react"

import { Button } from "@/lib/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/ui/card"
import { Input } from "@/lib/ui/input"
import { Label } from "@/lib/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/ui/select"
import { Slider } from "@/lib/ui/slider"
import { Separator } from "@/lib/ui/separator"
import Orb from "@/lib/ui/orb"
import Container from "@/lib/component/layout/container"


type LlmConfig = {
    model: string;
    system_prompt: string;
    temperature: number;
    max_tokens?: number;
    [key: string]: unknown;
};

const initialConfig = {
  agent: {
    name: "Samantha",
    first_message: "Hey there! I'm Samantha...",
    stt: {
      provider: "koe",
      language: "en",
    },
    llm: {
      provider: "koe",
      koe: {
        model: "mlx-community/gemma-3-1b-it-4bit",
        system_prompt: "You are Samantha, an AI companion...",
        tools: "{}",
        temperature: 0.1,
        top_k: 0,
        top_p: 0,
        min_p: 0,
        max_tokens: 1024,
      },
      byom: {
        api_key: "OPENAI_COMPATIBLE_API_KEY",
        model: "gpt-4o",
        system_prompt: "You are a helpful AI assistant.",
        tools: "{}",
        temperature: 0.1,
        top_p: 0,
        seed: 1337,
      },
    },
    tts: {
      provider: "koe",
      language: "en",
      voice: "brooke-female-american"
    },
  },
}

// Polished styling classes for a refined look
const formElementClasses = "border-gray-200 focus-visible:ring-ring";
const labelClasses = "text-xs font-medium text-gray-500";
const sectionHeaderClasses = "flex items-center text-sm font-semibold text-gray-500 uppercase tracking-wider";

export default function PlaygroundPage() {
  const [config, setConfig] = useState(initialConfig)
  const [isListening, setIsListening] = useState(false)

  const handleConfigChange = (keys: string[], value: string | number | boolean) => {
    setConfig(prev => {
      const newConfig = JSON.parse(JSON.stringify(prev))
      let current: Record<string, unknown> = newConfig;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] as Record<string, unknown>;
      }
      current[keys[keys.length - 1]] = value
      return newConfig
    })
  }

  const llmProvider = config.agent.llm.provider;
  
  let currentLlmConfig: LlmConfig;
  if (llmProvider === 'koe') {
    currentLlmConfig = config.agent.llm.koe;
  } else {
    currentLlmConfig = config.agent.llm.byom;
  }
  
  return (
    <Container currentPage="Playground">
      <div className="container mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-center order-2 lg:order-1">
          <div className="w-64 h-64 md:w-80 md:h-80 my-8">
            <Orb
              isListening={isListening}
              onToggle={() => setIsListening(!isListening)}
            />
          </div>
          <h1 className="text-2xl font-semibold text-gray-700">Start a conversation</h1>
          <p className="text-gray-500 mt-2">Press Connect to start a new playground session.</p>
          <Button size="lg" className="mt-8 bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg">
            <Play className="mr-2 h-5 w-5" /> Connect
          </Button>
        </div>

        <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="sticky top-8">
                <Card className="w-full bg-white border-gray-200 shadow-none rounded-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg font-semibold">
                            <Settings className="mr-3 h-5 w-5 text-gray-700"/>
                            Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="max-h-[calc(100vh-150px)] overflow-y-auto space-y-8">
                        
                        <div className="space-y-4">
                            <h3 className={sectionHeaderClasses}><Mic className="mr-2 h-4 w-4"/>Voice & Language</h3>
                            <div className="space-y-2">
                                <Label htmlFor="input-lang" className={labelClasses}>Input Speech Language</Label>
                                <Select value={config.agent.stt.language} onValueChange={value => handleConfigChange(['agent', 'stt', 'language'], value)}>
                                    <SelectTrigger className={formElementClasses}><SelectValue placeholder="Select language..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="es">Spanish</SelectItem>
                                        <SelectItem value="fr">French</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="output-lang" className={labelClasses}>Output Speech Language</Label>
                                <Select value={config.agent.tts.language} onValueChange={value => handleConfigChange(['agent', 'tts', 'language'], value)}>
                                    <SelectTrigger className={formElementClasses}><SelectValue placeholder="Select language..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="es">Spanish</SelectItem>
                                        <SelectItem value="fr">French</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="voice" className={labelClasses}>Voice</Label>
                                <Select value={config.agent.tts.voice} onValueChange={value => handleConfigChange(['agent', 'tts', 'voice'], value)}>
                                    <SelectTrigger className={formElementClasses}><SelectValue placeholder="Select voice..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="brooke-female-american">Brooke (Female, American)</SelectItem>
                                        <SelectItem value="john-male-british">John (Male, British)</SelectItem>
                                        <SelectItem value="elise-female-french">Elise (Female, French)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-4">
                            <h3 className={sectionHeaderClasses}><SlidersHorizontal className="mr-2 h-4 w-4"/>Model Parameters</h3>
                            <div className="space-y-2">
                                <Label htmlFor="llm-provider" className={labelClasses}>LLM Provider</Label>
                                <Select value={llmProvider} onValueChange={value => handleConfigChange(['agent', 'llm', 'provider'], value)}>
                                    <SelectTrigger className={formElementClasses}><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="koe">Koe</SelectItem>
                                        <SelectItem value="byom">Bring Your Own Model</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="llm-model" className={labelClasses}>Model</Label>
                                <Input id="llm-model" value={currentLlmConfig.model} onChange={e => handleConfigChange(['agent', 'llm', llmProvider, 'model'], e.target.value)} className={formElementClasses}/>
                            </div>
                            <div className="space-y-2">
                                <Label className={labelClasses}>Temperature: {currentLlmConfig.temperature}</Label>
                                <Slider  defaultValue={[currentLlmConfig.temperature]} max={2} step={0.1} onValueChange={([val]) => handleConfigChange(['agent', 'llm', llmProvider, 'temperature'], val)} />
                            </div>
                            <div className="space-y-2">
                                <Label className={labelClasses}>Max Tokens: {currentLlmConfig.max_tokens ?? 2048}</Label>
                                <Slider  defaultValue={[currentLlmConfig.max_tokens ?? 2048]} max={4096} step={64} onValueChange={([val]) => handleConfigChange(['agent', 'llm', llmProvider, 'max_tokens'], val)} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </Container>
  )
}