"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image, { type StaticImageData } from "next/image";

import rightArrow from "../../public/right-arrow.svg";

import { createShader, createProgram, createUniform } from "../util/webgl";

const SCALE = 50;
const X_OFFSET = 1;
const Y_OFFSET = 1;
const MIN_MILLIS_BETWEEN_RENDERS = 20;

const FUNDAMENTAL_VERTICES: [number, number][] = [
  [-0.25, 0.933012701892219],
  [0, 0],
  [0.18301270189222, 1.183012701892219],
  [0.43301270189222, -0.25],
  [0.43301270189222, 0.75],
  [0.68301270189222, 1.183012701892219],
  [0.866025403784439, 0],
  [1.116025403784439, -0.433012701892219],
  [1.116025403784439, 0.933012701892219],
  [1.366025403784439, 0],
  [1.616025403784439, 0.433012701892219],
  [1.616025403784439, 0.933012701892219],
  [1.799038105676658, -0.25],
  [2.116025403784438, 0.933012701892219],
  [2.549038105676658, 0.183012701892219],
  [2.799038105676658, -0.25],
  [2.982050807568877, 0.433012701892219],
  [2.982050807568877, 0.933012701892219],
  [3.665063509461096, -0.75],
  [3.665063509461096, -0.25],
  [3.848076211353316, 0.433012701892219],
  [4.098076211353316, 0],
  [4.531088913245536, -0.75],
  [4.848076211353316, 0.433012701892219],
  [5.031088913245535, -0.75],
  [5.031088913245535, -0.25],
  [5.281088913245535, 0.183012701892219],
  [5.531088913245535, -0.75],
  [5.531088913245535, 0.616025403784439],
  [5.781088913245535, 0.183012701892219],
  [5.964101615137754, -1],
  [6.214101615137754, -0.566987298107781],
  [6.214101615137754, 0.433012701892219],
  [6.464101615137754, -1],
  [6.647114317029974, 0.183012701892219],
  [6.897114317029974, -0.75],
];

const UX = -0.683012701892219;
const UY = 1.183012701892219;
const VX = 6.897114317029974;
const VY = -0.75;

const FUNDAMENTAL_EDGES: [number, number][] = [
  [0, 2],
  [2, 4],
  [3, 4],
  [4, 5],
  [5, 8],
  [6, 8],
  [8, 13],
  [9, 10],
  [10, 11],
  [10, 14],
  [13, 16],
  [14, 15],
  [14, 16],
  [16, 17],
  [16, 19],
  [17, 20],
  [19, 21],
  [20, 21],
  [20, 23],
  [21, 25],
  [23, 26],
  [24, 25],
  [25, 28],
  [27, 29],
  [28, 29],
  [29, 32],
  [31, 32],
  [32, 34],
  [34, 35],
];

const Grid: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const vertexBufferRef = useRef<WebGLBuffer | null>(null);
  const edgeBufferRef = useRef<WebGLBuffer | null>(null);
  const uResolutionRef = useRef<WebGLUniformLocation | null>(null);
  const verticesRef = useRef<Float32Array>(new Float32Array());
  const edgesRef = useRef<Uint32Array>(new Uint32Array());
  const requestRef = useRef<number | null>(null);
  const lastRenderRef = useRef<number>(0);

  const setCanvasSize = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const gl = glRef.current;
    const program = programRef.current;
    if (!canvas || !container || !gl || !program) return;

    canvas.style.width = `${container.clientWidth}px`;
    canvas.style.height = `${container.clientHeight}px`;

    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(container.clientWidth * ratio);
    canvas.height = Math.floor(container.clientHeight * ratio);

    if (program && uResolutionRef.current) {
      gl.uniform2f(uResolutionRef.current, canvas.width, canvas.height);
    }

    // TODO: Generate pentagons for real
    const vertices = [];
    const edges = [];
    for (let u = 0; u < 40; u++) {
      for (let v = 0; v < 12; v++) {
        for (const edge of FUNDAMENTAL_EDGES) {
          edges.push(
            vertices.length / 2 + edge[0],
            vertices.length / 2 + edge[1],
          );
        }
        for (const vertex of FUNDAMENTAL_VERTICES) {
          vertices.push(
            SCALE * (vertex[0] + u * UX + v * VX) - X_OFFSET,
            SCALE * (vertex[1] + u * UY + v * VY) - Y_OFFSET,
          );
        }
      }
    }
    verticesRef.current = new Float32Array(vertices);
    edgesRef.current = new Uint32Array(edges);

    render();
  };

  const render = () => {
    const gl = glRef.current;
    const canvas = canvasRef.current;
    const program = programRef.current;
    const vertexBuffer = vertexBufferRef.current;
    const edgeBuffer = edgeBufferRef.current;
    const vertices = verticesRef.current;
    const edges = edgesRef.current;

    if (!gl || !program || !vertexBuffer || !edgeBuffer || !canvas) return;

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, edgeBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, edges, gl.DYNAMIC_DRAW);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawElements(gl.LINES, edges.length, gl.UNSIGNED_INT, 0);
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
      precision mediump float;
      uniform vec2 uResolution;
      attribute vec2 aPosition;
      void main() {
        vec2 zeroToOne = aPosition / uResolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;
        gl_Position = vec4(clipSpace * vec2(1, -1), 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      void main() {
        gl_FragColor = vec4(0.9, 0.9, 0.9, 1.0);
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

    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.error("Error creating vertex buffer");
      return;
    }
    vertexBufferRef.current = vertexBuffer;

    const edgeBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.error("Error creating edge buffer");
      return;
    }
    edgeBufferRef.current = edgeBuffer;

    const positionAttribLocation = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

    setCanvasSize();

    if (!gl.getExtension("OES_element_index_uint")) {
      console.error("OES_element_index_uint required");
      return;
    }

    render();

    return () => {
      if (gl) {
        if (program) gl.deleteProgram(program);
        if (vertexShader) gl.deleteShader(vertexShader);
        if (fragmentShader) gl.deleteShader(fragmentShader);
        if (vertexBuffer) gl.deleteBuffer(vertexBuffer);
        if (edgeBuffer) gl.deleteBuffer(edgeBuffer);
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
