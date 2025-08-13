"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image, { type StaticImageData } from "next/image";

import rightArrow from "../../public/right-arrow.svg";

import { createShader, createProgram, createUniform } from "../util/webgl";

const MIN_MILLIS_BETWEEN_RENDERS = 20;

const Grid: React.FC = () => {
  const xOffsetPx = 3;
  const yOffsetPx = 9;
  const sizePx = 13;

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const vertexBufferRef = useRef<WebGLBuffer | null>(null);
  const uResolutionRef = useRef<WebGLUniformLocation | null>(null);
  const uNowRef = useRef<WebGLUniformLocation | null>(null);
  const gridTexRef = useRef<WebGLTexture | null>(null);
  const uGridSizeRef = useRef<WebGLUniformLocation | null>(null);
  const startRef = useRef(performance.now() - 10000);
  const gridRef = useRef(new Float32Array());
  const rowsRef = useRef(-1);
  const colsRef = useRef(-1);
  const requestRef = useRef<number | null>(null);
  const lastRenderRef = useRef<number>(0);

  const triangles = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]);

  const setCanvasSize = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const gl = glRef.current;
    const program = programRef.current;
    if (!canvas || !container || !gl || !program) return;

    const newRows = Math.ceil(container.clientHeight / sizePx) + 1;
    const newCols = Math.ceil(container.clientWidth / sizePx) + 1;
    if (newRows !== rowsRef.current || newCols != colsRef.current) {
      rowsRef.current = newRows;
      colsRef.current = newCols;
      gridRef.current = new Float32Array(newRows * newCols);
      gl.uniform2f(uGridSizeRef.current, colsRef.current, rowsRef.current);

      // TODO: Read old grid
    }

    if (gridTexRef.current) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, gridTexRef.current);
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.LUMINANCE,
        colsRef.current,
        rowsRef.current,
        0,
        gl.LUMINANCE,
        gl.FLOAT,
        gridRef.current,
      );
    }

    canvas.style.width = `${container.clientWidth}px`;
    canvas.style.height = `${container.clientHeight}px`;

    const ratio = window.devicePixelRatio || 1;
    const w = Math.floor(container.clientWidth * ratio);
    const h = Math.floor(container.clientHeight * ratio);

    canvas.width = w;
    canvas.height = h;

    if (program && uResolutionRef.current) {
      gl.uniform2f(uResolutionRef.current, canvas.width, canvas.height);
    }

    render();
  };

  const render = () => {
    const gl = glRef.current;
    const program = programRef.current;
    const vertexBuffer = vertexBufferRef.current;
    const canvas = canvasRef.current;
    const gridTex = gridTexRef.current;

    if (!gl || !program || !vertexBuffer || !canvas || !gridTex) return;

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, gridTex);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texSubImage2D(
      gl.TEXTURE_2D,
      0,
      0,
      0,
      colsRef.current,
      rowsRef.current,
      gl.LUMINANCE,
      gl.FLOAT,
      gridRef.current,
    );

    gl.uniform1f(uNowRef.current, performance.now() - startRef.current);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangles, gl.DYNAMIC_DRAW);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  const handleMouseMove = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.round(event.clientX - rect.left);
    const y = Math.round(event.clientY - rect.top);
    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;
    const row = Math.floor((y - yOffsetPx) / sizePx + 1);
    const col = Math.floor((x - xOffsetPx) / sizePx + 1);
    gridRef.current[row * colsRef.current + col] =
      performance.now() - startRef.current;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }
    glRef.current = gl;

    const vertexShaderSource = `
        attribute vec2 aPosition;
        void main() {
          vec2 zeroToOne = aPosition;
          vec2 zeroToTwo = zeroToOne * 2.0;
          vec2 clipSpace = zeroToTwo - 1.0;
          gl_Position = vec4(clipSpace * vec2(1, -1), 0.0, 1.0);
        }
      `;

    const ratio = window.devicePixelRatio || 1;
    const xOffset = xOffsetPx * ratio;
    const yOffset = yOffsetPx * ratio;
    const size = sizePx * ratio;

    const fragmentShaderSource = `
        precision mediump float;
        precision mediump int;

        uniform vec2 uResolution;
        uniform float uNow;
        uniform vec2 uGridSize;
        uniform sampler2D uGrid;

        float xOffset = ${xOffset.toFixed(1)};
        float yOffset = ${yOffset.toFixed(1)};
        float size = ${size.toFixed(1)};

        float gridColor = 0.90;
        float fillColor = 0.95;
        float fadeDistance = 100.0;

        void main() {
          vec2 p = floor(vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y));
          float mx = mod(p.x, size), my = mod(p.y, size);
          vec4 color;
          if (abs(mx - xOffset) < 0.5 || abs(my - yOffset) < 0.5) {
            color = vec4(gridColor, gridColor, gridColor, 1.0);
          } else {
            float row = floor((p.x - xOffset) / size + 1.0);
            float col = floor((p.y - yOffset) / size + 1.0);
            vec2 uv = vec2(row + 0.5, col + 0.5) / uGridSize;
            float age = uNow - texture2D(uGrid, uv).r;
            float t = clamp(2.0 - age / 1000.0, 0.0, 1.0);
            float c = mix(1.0, fillColor, t);
            color = vec4(c, c, c, 1.0);
          }
          float fade = clamp(gl_FragCoord.y / fadeDistance, 0.0, 1.0);
          gl_FragColor = mix(vec4(1.0), color, fade);
        }
      `;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource,
    );
    if (!vertexShader || !fragmentShader) {
      console.error("Error creating shaders");
      return;
    }

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) {
      console.error("Error creating program");
      return;
    }
    programRef.current = program;
    gl.useProgram(program);

    uResolutionRef.current = createUniform(gl, program, "uResolution");
    uNowRef.current = createUniform(gl, program, "uNow");
    uGridSizeRef.current = createUniform(gl, program, "uGridSize");

    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.error("Error creating buffer");
      return;
    }
    vertexBufferRef.current = vertexBuffer;

    const positionAttribLocation = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

    setCanvasSize();

    if (!gl.getExtension("OES_texture_float")) {
      console.error("OES_texture_float required");
      return;
    }

    const gridTex = gl.createTexture();
    if (!gridTex) {
      console.error("Failed to create texture");
      return;
    }
    gridTexRef.current = gridTex;

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, gridTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.LUMINANCE,
      colsRef.current,
      rowsRef.current,
      0,
      gl.LUMINANCE,
      gl.FLOAT,
      gridRef.current,
    );

    render();

    return () => {
      if (gl) {
        if (program) gl.deleteProgram(program);
        if (vertexShader) gl.deleteShader(vertexShader);
        if (fragmentShader) gl.deleteShader(fragmentShader);
        if (vertexBuffer) gl.deleteBuffer(vertexBuffer);
      }
    };
  });

  useEffect(() => {
    if (containerRef.current !== null) {
      const observer = new ResizeObserver(setCanvasSize);
      observer.observe(containerRef.current);
      const current = containerRef.current;
      return () => observer.unobserve(current);
    }
  });

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  });

  useEffect(() => {
    const animate = () => {
      if (
        performance.now() - lastRenderRef.current >
        MIN_MILLIS_BETWEEN_RENDERS
      ) {
        render();
        lastRenderRef.current = performance.now();
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  });

  return (
    <div className="absolute inset-0 h-full w-full" ref={containerRef}>
      <canvas ref={canvasRef} width="0" height="0">
        Computer Science Instructional Lab
      </canvas>
    </div>
  );
};

const Button: React.FC<{
  label: string;
  href: string;
}> = ({ label, href }) => {
  return (
    <Link
      className="group relative flex h-12 w-72 items-center justify-between border border-black bg-white sm:h-14 sm:w-96"
      href={href}
    >
      <span className="ml-4 text-xl text-nowrap sm:text-[22px]">{label}</span>
      <Image
        className="mr-4 transition-transform duration-300 ease-in-out will-change-transform group-hover:translate-x-1.5 motion-reduce:transition-none sm:mr-6"
        src={(rightArrow as StaticImageData).src}
        width={28}
        height={28}
        alt="right arrow"
      />
      <div className="absolute inset-0 bg-white opacity-0 mix-blend-difference duration-150 hover:opacity-100"></div>
    </Link>
  );
};

const Content: React.FC = () => {
  return (
    <div className="absolute inset-0 flex justify-center">
      <div className="w-full max-w-[1152px]">
        <div className="grid grid-cols-1 px-8 pt-[max(112px,22vh)] pb-16 leading-none whitespace-nowrap">
          <h2 className="text-5xl leading-[0.8] font-normal sm:hidden">
            Hardware and
            <br />
            software for
            <br />
            <i>every</i> need
          </h2>
          <h2 className="hidden text-5xl leading-[0.8] font-normal sm:block">
            Hardware and software
            <br />
            for <i>every</i> need
          </h2>
          <h3 className="mt-2 mb-8 text-2xl sm:mt-3 sm:mb-12 sm:text-3xl">
            Serving UChicago for 40 years
          </h3>
          <div className="grid grid-cols-1 gap-y-2">
            <Button label="Learn More" href="/about" />
            <Button label="Make a Reservation" href="/reservations" />
          </div>
        </div>
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  return (
    <div className="hero-height relative w-full">
      <Grid />
      <Content />
    </div>
  );
};

export default Hero;
