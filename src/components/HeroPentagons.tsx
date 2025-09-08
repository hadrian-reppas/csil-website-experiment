"use client";

import { useRef, useEffect } from "react";

import { createShader, createProgram } from "../util/webgl";

const SCALE = 25;
const X_OFFSET = 1;
const Y_OFFSET = 1;
const MIN_MILLIS_BETWEEN_RENDERS = 20;

type Point = [number, number];

const BASE_VERTICES: Point[] = [
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

const EDGES: [number, number][] = [
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

type Triangle = [number, number, number];
const PENTAGONS: [Triangle, Triangle, Triangle][] = [
  [
    [0, 2, 4],
    [0, 4, 1],
    [1, 4, 3],
  ],
  [
    [3, 4, 6],
    [4, 5, 8],
    [4, 8, 6],
  ],
  [
    [6, 8, 10],
    [6, 10, 7],
    [8, 11, 10],
  ],
  [
    [9, 10, 12],
    [10, 14, 12],
    [12, 14, 15],
  ],
  [
    [10, 11, 13],
    [10, 13, 14],
    [13, 16, 14],
  ],
  [
    [14, 16, 15],
    [15, 16, 19],
    [15, 19, 18],
  ],
  [
    [16, 17, 20],
    [16, 20, 19],
    [19, 20, 21],
  ],
  [
    [19, 21, 22],
    [21, 25, 22],
    [22, 25, 24],
  ],
  [
    [20, 23, 21],
    [21, 23, 25],
    [23, 26, 25],
  ],
  [
    [24, 25, 27],
    [25, 28, 29],
    [25, 29, 27],
  ],
  [
    [27, 29, 31],
    [27, 31, 30],
    [29, 32, 31],
  ],
  [
    [31, 32, 34],
    [31, 34, 35],
    [31, 35, 33],
  ],
];

const NEIGHBORS = [
  { du: 1, dv: 0, strip: [0, 2, 4, 5, 8, 13, 16, 17, 20, 23, 26, 28, 29, 32] },
  { du: 0, dv: 1, strip: [34, 35] },
  { du: 1, dv: 1, strip: [32, 34] },
  {
    du: -1,
    dv: 0,
    strip: [3, 6, 7, 9, 12, 15, 18, 19, 22, 27, 30, 31, 33, 35],
  },
  { du: 0, dv: -1, strip: [0, 1] },
  { du: -1, dv: -1, strip: [1, 3] },
];

const getVertex = (index: number, u: number, v: number): Point => {
  const [x, y] = BASE_VERTICES[index]!;
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

  return Array.from(seen, (k) => k.split(",").map(Number) as [number, number]);
};

const hashString = (s: string): number => {
  let h1 = 0xdeadbeef,
    h2 = 0x41c6ce57;
  for (let i = 0, c; i < s.length; i++) {
    c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

const HeroPentagons: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const triangleProgramRef = useRef<WebGLProgram | null>(null);
  const trianglePositionLocRef = useRef(-1);
  const trianglePhaseLocRef = useRef(-1);
  const edgeProgramRef = useRef<WebGLProgram | null>(null);
  const edgePositionLocRef = useRef(-1);
  const triangleBufferRef = useRef<WebGLBuffer | null>(null);
  const phaseBufferRef = useRef<WebGLBuffer | null>(null);
  const edgeBufferRef = useRef<WebGLBuffer | null>(null);
  const trianglesRef = useRef<Float32Array>(new Float32Array());
  const phasesRef = useRef<Float32Array>(new Float32Array());
  const edgesRef = useRef<Float32Array>(new Float32Array());
  const requestRef = useRef<number | null>(null);
  const lastRenderRef = useRef<number>(0);

  const setCanvasSize = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const gl = glRef.current;
    if (!canvas || !container || !gl) return;

    const width = container.clientWidth,
      height = container.clientHeight;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);

    const uvs = getUvs(width, height);
    const edges = new Float32Array(2 * 2 * EDGES.length * uvs.length);
    const triangles = new Float32Array(
      2 * 3 * 3 * PENTAGONS.length * uvs.length,
    );
    const phases = new Float32Array(PENTAGONS.length * uvs.length);
    let edgeOffset = 0,
      triangleOffset = 0,
      phaseOffset = 0;
    for (const uv of uvs) {
      const [u, v] = uv;
      for (const pentagon of PENTAGONS) {
        for (const triangle of pentagon) {
          const [a, b, c] = triangle;
          const [ax, ay] = getVertex(a, u, v);
          const [bx, by] = getVertex(b, u, v);
          const [cx, cy] = getVertex(c, u, v);
          triangles[triangleOffset++] = ax / width;
          triangles[triangleOffset++] = ay / height;
          triangles[triangleOffset++] = bx / width;
          triangles[triangleOffset++] = by / height;
          triangles[triangleOffset++] = cx / width;
          triangles[triangleOffset++] = cy / height;
        }
        const hash = hashString(`${u},${v},${JSON.stringify(pentagon)}`) % 32;
        const phase = (hash / 32 + performance.now() / 1000) % 1;
        phases[phaseOffset++] = phase;
      }
      for (const edge of EDGES) {
        const [a, b] = edge;
        const [ax, ay] = getVertex(a, u, v);
        const [bx, by] = getVertex(b, u, v);
        edges[edgeOffset++] = ax / width;
        edges[edgeOffset++] = ay / height;
        edges[edgeOffset++] = bx / width;
        edges[edgeOffset++] = by / height;
      }
    }
    trianglesRef.current = triangles;
    phasesRef.current = phases;
    edgesRef.current = edges;

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBufferRef.current);
    gl.bufferData(gl.ARRAY_BUFFER, triangles, gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, edgeBufferRef.current);
    gl.bufferData(gl.ARRAY_BUFFER, edges, gl.DYNAMIC_DRAW);

    render();
  };

  const render = () => {
    const gl = glRef.current;
    const canvas = canvasRef.current;
    const triangleProgram = triangleProgramRef.current;
    const edgeProgram = edgeProgramRef.current;
    const triangleBuffer = triangleBufferRef.current;
    const phaseBuffer = phaseBufferRef.current;
    const edgeBuffer = edgeBufferRef.current;
    const triangles = trianglesRef.current;
    const phases = phasesRef.current;
    const edges = edgesRef.current;
    const trianglePositionLoc = trianglePositionLocRef.current;
    const trianglePhaseLoc = trianglePhaseLocRef.current;
    const edgePositionLoc = edgePositionLocRef.current;

    if (
      !gl ||
      !canvas ||
      !edgeProgram ||
      !triangleProgram ||
      !triangleBuffer ||
      !phaseBuffer ||
      !edgeBuffer
    )
      return;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(triangleProgram);

    const repeatedPhases = new Float32Array(9 * phases.length);
    for (let i = 0; i < repeatedPhases.length; i++) {
      repeatedPhases[i] = phases[Math.floor(i / 9)]!;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, phaseBufferRef.current);
    gl.bufferData(gl.ARRAY_BUFFER, repeatedPhases, gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.enableVertexAttribArray(trianglePositionLoc);
    gl.vertexAttribPointer(trianglePositionLoc, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, phaseBuffer);
    gl.enableVertexAttribArray(trianglePhaseLoc);
    gl.vertexAttribPointer(trianglePhaseLoc, 1, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, triangles.length / 2);

    gl.useProgram(edgeProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, edgeBuffer);
    gl.enableVertexAttribArray(edgePositionLoc);
    gl.vertexAttribPointer(edgePositionLoc, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.LINES, 0, edges.length / 2);
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

    const triangleVertexShaderSource = `
      precision mediump float;
      attribute vec2 aPosition;
      attribute float aPhase;
      varying float vPhase;
      void main() {
        vec2 zeroToTwo = aPosition * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;
        gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);
        vPhase = aPhase;
      }
    `;

    const triangleFragmenShaderSource = `
      precision mediump float;
      varying float vPhase;

      vec3 hsv2rgb(float h, float s, float v){
        float c = v * s;
        float x = c * (1.0 - abs(mod(h * 6.0, 2.0) - 1.0));
        float m = v - c;
        vec3 rgb = (h < 1.0 / 6.0) ? vec3(c, x, 0.0)
                 : (h < 2.0 / 6.0) ? vec3(x, c, 0.0)
                 : (h < 3.0 / 6.0) ? vec3(0.0, c, x)
                 : (h < 4.0 / 6.0) ? vec3(0.0, x, c)
                 : (h < 5.0 / 6.0) ? vec3(x, 0.0, c)
                                   : vec3(c, 0.0, x);
        return rgb + m;
      }

      void main() {
        float t = fract(vPhase);
        vec3 col = hsv2rgb(t, 0.2, 0.95);
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const triangleVertexShader = createShader(
      gl,
      gl.VERTEX_SHADER,
      triangleVertexShaderSource,
    );
    const triangleFragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      triangleFragmenShaderSource,
    );
    if (!triangleVertexShader || !triangleFragmentShader) {
      console.error("Error creating triangle shaders");
      return;
    }

    const triangleProgram = createProgram(
      gl,
      triangleVertexShader,
      triangleFragmentShader,
    );
    if (!triangleProgram) {
      console.error("Error creating triangle program");
      return;
    }
    triangleProgramRef.current = triangleProgram;

    const triangleBuffer = gl.createBuffer();
    const phaseBuffer = gl.createBuffer();
    if (!triangleBuffer || !phaseBuffer) {
      console.error("Error creating triangle buffers");
      return;
    }
    triangleBufferRef.current = triangleBuffer;
    phaseBufferRef.current = phaseBuffer;

    trianglePositionLocRef.current = gl.getAttribLocation(
      triangleProgram,
      "aPosition",
    );
    trianglePhaseLocRef.current = gl.getAttribLocation(
      triangleProgram,
      "aPhase",
    );

    const edgeVertexShaderSource = `
      precision mediump float;
      attribute vec2 aPosition;
      void main() {
        vec2 zeroToOne = aPosition;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;
        gl_Position = vec4(clipSpace * vec2(1, -1), 0.0, 1.0);
      }
    `;

    const edgeFragmentShaderSource = `
      precision mediump float;
      void main() {
        gl_FragColor = vec4(0.9, 0.9, 0.9, 1.0);
      }
    `;

    const edgeVertexShader = createShader(
      gl,
      gl.VERTEX_SHADER,
      edgeVertexShaderSource,
    );
    const edgeFragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      edgeFragmentShaderSource,
    );
    if (!edgeVertexShader || !edgeFragmentShader) {
      console.error("Error creating edge shaders");
      return;
    }

    const edgeProgram = createProgram(gl, edgeVertexShader, edgeFragmentShader);
    if (!edgeProgram) {
      console.error("Error creating edge program");
      return;
    }
    edgeProgramRef.current = edgeProgram;

    const edgeBuffer = gl.createBuffer();
    if (!edgeBuffer) {
      console.error("Error creating edge buffer");
      return;
    }
    edgeBufferRef.current = edgeBuffer;

    edgePositionLocRef.current = gl.getAttribLocation(edgeProgram, "aPosition");

    setCanvasSize();

    return () => {
      if (gl) {
        if (triangleProgram) gl.deleteProgram(triangleProgram);
        if (triangleVertexShader) gl.deleteBuffer(triangleVertexShader);
        if (triangleFragmentShader) gl.deleteBuffer(triangleFragmentShader);
        if (triangleBuffer) gl.deleteBuffer(triangleBuffer);
        if (phaseBuffer) gl.deleteBuffer(phaseBuffer);
        if (edgeProgram) gl.deleteProgram(edgeProgram);
        if (edgeVertexShader) gl.deleteShader(edgeVertexShader);
        if (edgeFragmentShader) gl.deleteShader(edgeFragmentShader);
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
        // TODO: Repleace with real animation
        const phases = phasesRef.current;
        const timeDelta = (performance.now() - lastRenderRef.current) / 5000;
        for (let i = 0; i < phases.length; i++) {
          phases[i] = (phases[i]! + timeDelta) % 1;
        }
        console.log(phases);

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
