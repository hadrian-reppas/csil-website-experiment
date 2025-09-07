"use client";

import { useRef, useEffect } from "react";

import { createShader, createProgram } from "../util/webgl";

const SCALE = 25;
const X_OFFSET = 1;
const Y_OFFSET = 1;
const MIN_MILLIS_BETWEEN_RENDERS = 20;

type Point = [number, number];

const FUNDAMENTAL_VERTICES: Point[] = [
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

const NEIGHBORS = [
  { du: 1, dv: 0, strip: [0, 2, 4, 5, 8, 13, 16, 17, 20, 23, 26, 28, 29, 32] },
  { du: 0, dv: 1, strip: [34, 35] },
  { du: 1, dv: 1, strip: [32, 34] },
];

const getVertex = (index: number, u: number, v: number): Point => {
  const [x, y] = FUNDAMENTAL_VERTICES[index]!;
  return [
    SCALE * (x + u * UX + v * VX) - X_OFFSET,
    SCALE * (y + u * UY + v * VY) - Y_OFFSET,
  ];
};

const segmentsIntersect = (
  p1: Point,
  p2: Point,
  q1: Point,
  q2: Point,
): boolean => {
  const eps = 1e-9;

  const sub = (p: Point, q: Point): Point => [p[0] - q[0], p[1] - q[1]];
  const cross = (p: Point, q: Point): number => p[0] * q[1] - p[1] * q[0];
  const onSegment = (p: Point, q: Point, r: Point): boolean =>
    Math.min(p[0], r[0]) - eps <= q[0] &&
    q[0] <= Math.max(p[0], r[0]) + eps &&
    Math.min(p[1], r[1]) - eps <= q[1] &&
    q[1] <= Math.max(p[1], r[1]) + eps;

  const p = sub(p2, p1);
  const q = sub(q2, q1);

  const o1 = cross(p, sub(q1, p1));
  const o2 = cross(p, sub(q2, p1));
  const o3 = cross(q, sub(p1, q1));
  const o4 = cross(q, sub(p2, q1));

  if (
    ((o1 > eps && o2 < -eps) || (o1 < -eps && o2 > eps)) &&
    ((o3 > eps && o4 < -eps) || (o3 < -eps && o4 > eps))
  ) {
    return true;
  }

  return (
    (Math.abs(o1) < eps && onSegment(p1, q1, p2)) ||
    (Math.abs(o2) < eps && onSegment(p1, q2, p2)) ||
    (Math.abs(o3) < eps && onSegment(q1, p1, q2)) ||
    (Math.abs(o4) < eps && onSegment(q1, p2, q2))
  );
};

const segmentIntersectsScreen = (
  p: Point,
  q: Point,
  width: number,
  height: number,
): boolean => {
  return (
    (0 <= p[0] && p[0] <= width && 0 <= p[1] && p[1] <= height) ||
    (0 <= q[0] && q[0] <= width && 0 <= q[1] && q[1] <= height) ||
    segmentsIntersect(p, q, [0, 0], [width, 0]) ||
    segmentsIntersect(p, q, [width, 0], [width, height]) ||
    segmentsIntersect(p, q, [width, height], [0, height]) ||
    segmentsIntersect(p, q, [0, height], [0, 0])
  );
};

const stripIntersectsScreen = (
  strip: number[],
  u: number,
  v: number,
  width: number,
  height: number,
): boolean => {
  for (let i = 0; i < strip.length - 1; i++) {
    const p = getVertex(strip[i]!, u, v);
    const q = getVertex(strip[i + 1]!, u, v);
    if (segmentIntersectsScreen(p, q, width, height)) return true;
  }
  return false;
};

const getUvs = (width: number, height: number): [number, number][] => {
  const uvKey = (u: number, v: number) => `${u},${v}`;

  const seen = new Set<string>();
  const stack: [number, number][] = [[0, 0]];

  seen.add(uvKey(0, 0));

  while (stack.length) {
    const [u, v] = stack.pop()!;
    for (const neighbor of NEIGHBORS) {
      const nu = u + neighbor.du;
      const nv = v + neighbor.dv;
      const key = uvKey(nu, nv);

      if (
        !seen.has(key) &&
        stripIntersectsScreen(neighbor.strip, u, v, width, height)
      ) {
        seen.add(key);
        stack.push([nu, nv]);
      }
    }
  }

  return Array.from(
    seen,
    (key) => key.split(",").map(Number) as [number, number],
  );
};

const HeroPentagons: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const vertexBufferRef = useRef<WebGLBuffer | null>(null);
  const edgeBufferRef = useRef<WebGLBuffer | null>(null);
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

    const vertices = [];
    const edges = [];
    for (const uv of getUvs(container.clientWidth, container.clientHeight)) {
      const [u, v] = uv;
      for (const edge of FUNDAMENTAL_EDGES) {
        const offset = vertices.length / 2;
        edges.push(offset + edge[0], offset + edge[1]);
      }
      for (const vertex of FUNDAMENTAL_VERTICES) {
        const x = SCALE * (vertex[0] + u * UX + v * VX) - X_OFFSET;
        const y = SCALE * (vertex[1] + u * UY + v * VY) - Y_OFFSET;
        vertices.push(x / container.clientWidth, y / container.clientHeight);
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
      attribute vec2 aPosition;
      void main() {
        vec2 zeroToOne = aPosition;
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
      <canvas ref={canvasRef} width="0" height="0"></canvas>
    </div>
  );
};

export default HeroPentagons;
