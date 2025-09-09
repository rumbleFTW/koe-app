"use client"

import { useEffect, useRef } from "react"
import { Renderer, Program, Mesh, Triangle, Vec3 } from "ogl"
import { Mic, MicOff } from "lucide-react"

interface OrbProps {
  hue?: number
  hoverIntensity?: number
  rotateOnHover?: boolean
  forceHoverState?: boolean
  isListening?: boolean
  isActive?: boolean
  onToggle?: () => void
  className?: string
}

export default function Orb({
  hue = 0, // Keep hue at 0 to use base colors directly
  hoverIntensity = 0.4,
  rotateOnHover = true,
  forceHoverState = false,
  isListening = false,
  isActive = false,
  onToggle,
  className,
}: OrbProps) {
  const ctnDom = useRef<HTMLDivElement>(null)

  const vert = /* glsl */ `
    precision highp float;
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `

  const frag = /* glsl */ `
    precision highp float;
    uniform float iTime;
    uniform vec3 iResolution;
    uniform float hue;
    uniform float hover;
    uniform float rot;
    uniform float hoverIntensity;
    uniform float listening;
    uniform float active;
    varying vec2 vUv;

    vec3 rgb2yiq(vec3 c) {
      float y = dot(c, vec3(0.299, 0.587, 0.114));
      float i = dot(c, vec3(0.596, -0.274, -0.322));
      float q = dot(c, vec3(0.211, -0.523, 0.312));
      return vec3(y, i, q);
    }
    
    vec3 yiq2rgb(vec3 c) {
      float r = c.x + 0.956 * c.y + 0.621 * c.z;
      float g = c.x - 0.272 * c.y - 0.647 * c.z;
      float b = c.x - 1.106 * c.y + 1.703 * c.z;
      return vec3(r, g, b);
    }
    
    vec3 adjustHue(vec3 color, float hueDeg) {
      float hueRad = hueDeg * 3.14159265 / 180.0;
      vec3 yiq = rgb2yiq(color);
      float cosA = cos(hueRad);
      float sinA = sin(hueRad);
      float i = yiq.y * cosA - yiq.z * sinA;
      float q = yiq.y * sinA + yiq.z * cosA;
      yiq.y = i;
      yiq.z = q;
      return yiq2rgb(yiq);
    }
    
    vec3 hash33(vec3 p3) {
      p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
      p3 += dot(p3, p3.yxz + 19.19);
      return -1.0 + 2.0 * fract(vec3(
        p3.x + p3.y,
        p3.x + p3.z,
        p3.y + p3.z
      ) * p3.zyx);
    }
    
    float snoise3(vec3 p) {
      const float K1 = 0.333333333;
      const float K2 = 0.166666667;
      vec3 i = floor(p + (p.x + p.y + p.z) * K1);
      vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
      vec3 e = step(vec3(0.0), d0 - d0.yzx);
      vec3 i1 = e * (1.0 - e.zxy);
      vec3 i2 = 1.0 - e.zxy * (1.0 - e);
      vec3 d1 = d0 - (i1 - K2);
      vec3 d2 = d0 - (i2 - K1);
      vec3 d3 = d0 - 0.5;
      vec4 h = max(0.6 - vec4(
        dot(d0, d0),
        dot(d1, d1),
        dot(d2, d2),
        dot(d3, d3)
      ), 0.0);
      vec4 n = h * h * h * h * vec4(
        dot(d0, hash33(i)),
        dot(d1, hash33(i + i1)),
        dot(d2, hash33(i + i2)),
        dot(d3, hash33(i + 1.0))
      );
      return dot(vec4(31.316), n);
    }
    
    vec4 extractAlpha(vec3 colorIn) {
      float a = max(max(colorIn.r, colorIn.g), colorIn.b);
      return vec4(colorIn.rgb / (a + 1e-5), a);
    }
    
    // Updated Colors to match the provided image
    const vec3 baseColor1 = vec3(0.0, 0.5, 1.0);    // Bright Blue/Cyan (for the right side)
    const vec3 baseColor2 = vec3(0.7, 0.0, 1.0);    // Vibrant Purple/Magenta (for the left side)
    const vec3 baseColor3 = vec3(0.0, 0.1, 0.3);    // Darker Blue (for the subtle bottom glow)
    
    // Smaller, more filled orb
    const float innerRadius = 0.3;
    const float noiseScale = 1.2;
    
    float light1(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * attenuation);
    }
    
    float light2(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * dist * attenuation);
    }
    
    vec4 draw(vec2 uv) {
      vec3 color1 = adjustHue(baseColor1, hue);
      vec3 color2 = adjustHue(baseColor2, hue);
      vec3 color3 = adjustHue(baseColor3, hue);
      
      float ang = atan(uv.y, uv.x);
      float len = length(uv);
      float invLen = len > 0.0 ? 1.0 / len : 0.0;
      
      // Enhanced noise for more filling
      float timeSpeed = listening > 0.5 ? 1.5 : 0.3;
      float n0 = snoise3(vec3(uv * noiseScale, iTime * timeSpeed)) * 0.5 + 0.5;
      float n1 = snoise3(vec3(uv * noiseScale * 2.0, iTime * timeSpeed * 0.7)) * 0.3 + 0.7;
      
      // More filled radius calculation
      float r0 = mix(mix(innerRadius, 0.8, 0.7), mix(innerRadius, 0.9, 0.8), n0 * n1);
      float d0 = distance(uv, (r0 * invLen) * uv);
      
      // Enhanced lighting for more fill
      float v0 = light1(2.0, 8.0, d0);
      v0 *= smoothstep(r0 * 1.2, r0 * 0.8, len);
      
      // Dynamic color mixing based on listening state
      float colorSpeed = listening > 0.5 ? 3.0 : 1.0;
      float cl = cos(ang + iTime * colorSpeed) * 0.5 + 0.5;
      
      // Moving light source
      float a = iTime * (listening > 0.5 ? -2.0 : -0.5);
      vec2 pos = vec2(cos(a), sin(a)) * r0 * 0.8;
      float d = distance(uv, pos);
      float v1 = light2(listening > 0.5 ? 3.0 : 1.0, 3.0, d);
      v1 *= light1(2.0, 30.0, d0);
      
      // Better masking for more fill
      float v2 = smoothstep(0.9, mix(innerRadius, 0.8, n0 * 0.8), len);
      float v3 = smoothstep(innerRadius * 0.5, mix(innerRadius, 0.7, 0.8), len);
      
      // Enhanced color mixing
      vec3 col = mix(color1, color2, cl);
      col = mix(color3, col, v0 * 1.5);
      col = (col + v1) * v2 * v3;
      
      // Boost intensity when listening
      if (listening > 0.5) {
        col *= 1.5 + sin(iTime * 4.0) * 0.3;
      }
      
      col = clamp(col, 0.0, 1.0);
      
      return extractAlpha(col);
    }
    
    vec4 mainImage(vec2 fragCoord) {
      vec2 center = iResolution.xy * 0.5;
      float size = min(iResolution.x, iResolution.y);
      vec2 uv = (fragCoord - center) / size * 2.0;
      
      // Smaller orb scaling
      uv *= 1.8;
      
      float angle = rot;
      float s = sin(angle);
      float c = cos(angle);
      uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
      
      // Enhanced distortion when listening
      float distortionAmount = listening > 0.5 ? hoverIntensity * 0.2 : hoverIntensity * 0.05;
      uv.x += hover * distortionAmount * sin(uv.y * 15.0 + iTime * 2.0);
      uv.y += hover * distortionAmount * sin(uv.x * 15.0 + iTime * 2.0);
      
      return draw(uv);
    }
    
    void main() {
      vec2 fragCoord = vUv * iResolution.xy;
      vec4 col = mainImage(fragCoord);
      gl_FragColor = vec4(col.rgb * col.a, col.a);
    }
  `

  useEffect(() => {
    const container = ctnDom.current
    if (!container) return

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    container.appendChild(gl.canvas)

    const geometry = new Triangle(gl)
    const program = new Program(gl, {
      vertex: vert,
      fragment: frag,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new Vec3(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height),
        },
        hue: { value: hue },
        hover: { value: 0 },
        rot: { value: 0 },
        hoverIntensity: { value: hoverIntensity },
        listening: { value: isListening ? 1.0 : 0.0 },
        active: { value: isActive ? 1.0 : 0.0 },
      },
    })

    const mesh = new Mesh(gl, { geometry, program })

    function resize() {
      if (!container) return
      const dpr = window.devicePixelRatio || 1
      const width = container.clientWidth
      const height = container.clientHeight
      renderer.setSize(width * dpr, height * dpr)
      gl.canvas.style.width = width + "px"
      gl.canvas.style.height = height + "px"
      program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height)
    }

    window.addEventListener("resize", resize)
    resize()

    let targetHover = isListening ? 1 : 0
    let lastTime = 0
    let currentRot = 0
    const rotationSpeed = isListening ? 0.8 : 0.1

    const handleClick = () => {
      if (onToggle) {
        onToggle()
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const width = rect.width
      const height = rect.height
      const size = Math.min(width, height)
      const centerX = width / 2
      const centerY = height / 2
      const uvX = ((x - centerX) / size) * 2.0
      const uvY = ((y - centerY) / size) * 2.0

      if (Math.sqrt(uvX * uvX + uvY * uvY) < 0.6) {
        targetHover = 1
      } else {
        targetHover = isListening ? 1 : 0
      }
    }

    const handleMouseLeave = () => {
      targetHover = isListening ? 1 : 0
    }

    container.addEventListener("click", handleClick)
    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseLeave)

    let rafId: number
    const update = (t: number) => {
      rafId = requestAnimationFrame(update)
      const dt = (t - lastTime) * 0.001
      lastTime = t

      program.uniforms.iTime.value = t * 0.001
      program.uniforms.hue.value = hue
      program.uniforms.hoverIntensity.value = hoverIntensity
      program.uniforms.listening.value = isListening ? 1.0 : 0.0
      program.uniforms.active.value = isActive ? 1.0 : 0.0

      const effectiveHover = forceHoverState || isListening ? 1 : targetHover
      program.uniforms.hover.value += (effectiveHover - program.uniforms.hover.value) * 0.1

      if (rotateOnHover && (effectiveHover > 0.5 || isListening)) {
        currentRot += dt * (isListening ? 1.2 : rotationSpeed)
      }

      program.uniforms.rot.value = currentRot

      renderer.render({ scene: mesh })
    }

    rafId = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resize)
      container.removeEventListener("click", handleClick)
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseLeave)
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas)
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext()
    }
  }, [hue, hoverIntensity, rotateOnHover, forceHoverState, isListening, isActive, onToggle, vert, frag])

  return (
    <div ref={ctnDom} className={`w-full h-full cursor-pointer relative flex items-center justify-center ${className}`}>
      {/* Microphone Icon Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        {isListening ? (
          <Mic className="w-8 h-8  drop-shadow-2xl animate-pulse" />
        ) : (
          <MicOff className="w-8 h-8 " />
        )}
      </div>
    </div>
  )
}