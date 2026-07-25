import React, { useEffect, useRef } from 'react';

const WebGLBackground = ({ 
  opacity = 0.4, 
  className = "absolute inset-0 w-full h-full z-0",
  fragmentShader = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_texCoord;

void main() {
    vec2 uv = v_texCoord;
    vec2 m = u_mouse / u_resolution;
    
    // AURA Editorial Palette (Surface, Aqua Bloom, Deep Slate)
    vec3 color1 = vec3(0.976, 0.976, 0.976); // #f9f9f9
    vec3 color2 = vec3(0.855, 0.965, 0.984); // Aqua highlight
    vec3 color3 = vec3(0.922, 0.922, 0.922); // Cool Gray
    
    // Create soft, undulating liquid motion
    float noise = sin(uv.x * 3.0 + u_time * 0.2) * cos(uv.y * 3.5 + u_time * 0.15) * 0.1;
    
    // Interactive Water Ripple logic
    float distToMouse = distance(uv, m);
    float ripple = sin(distToMouse * 20.0 - u_time * 2.0) * exp(-distToMouse * 4.0) * 0.02;
    
    // Volumetric light blooms
    float d1 = distance(uv, vec2(0.2, 0.8) + 0.15 * vec2(sin(u_time * 0.1), cos(u_time * 0.08)));
    float d2 = distance(uv, vec2(0.8, 0.2) + 0.2 * vec2(cos(u_time * 0.12), sin(u_time * 0.1)));
    
    vec3 finalColor = mix(color1, color2, smoothstep(0.8, 0.0, d1 + noise + ripple));
    finalColor = mix(finalColor, color3, smoothstep(0.7, 0.0, d2 + ripple));
    finalColor = mix(finalColor, color2 * 1.1, smoothstep(0.4, 0.0, distToMouse) * 0.2);
    
    // Subtle premium grain
    float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
    finalColor += (grain - 0.5) * 0.012;
    
    gl_FragColor = vec4(finalColor, 1.0);
}`
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId;
    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const syncSize = () => {
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas);
    }
    syncSize();

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const createShader = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(s));
      }
      return s;
    };

    const prog = gl.createProgram();
    gl.attachShader(prog, createShader(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, createShader(gl.FRAGMENT_SHADER, fragmentShader));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = (t) => {
      if (typeof ResizeObserver === 'undefined') syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (resizeObserver) resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [fragmentShader]);

  return (
    <div className={className} style={{ opacity }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
};

export default WebGLBackground;
