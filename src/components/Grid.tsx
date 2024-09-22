import React, { useRef, useEffect } from "react";

import hero from "../../pubilc/hero.png";

const TOP_LAYOUT =
  "lrlrlrlrllrlrlrlrllrlrlrlrllrlrlrlrllrlrlrlrllrlrlrlrllrlrlrlrllrlrlrlrlrlrlrllrlrlrlrllrlrlrlrllrllrlrlrlrllrlrlrlrllrlrlrlrllrlrlrlr";
const BOTTOM_LAYOUT =
  "lrllrlrlrlrllrlrlrlrllrlrlrlrllrlrlrlrllrlrlrlrllrlrlrlrllrlrlrlrllrllrlrlrlrllrlrlrlrllrlrlrlrllrlrlrlrlrlrlrlrlrlrllrlrlrlrllrlrlrlr";
const TEXT = [
  "                                                                                                                                      ",
  "   ##       ##           #    ##                ##       ##       ##             ##       ##     #    ##           #    ##       ##   ",
  "  ####     ####         ##   ####              ####     ####     ####           ####     ####   ##   ####         ##   ####     ####  ",
  " ######   #### #   ##  ###  #### #         #  ######   ######   #### #         ######   ######  ##  ######        ##  ######   ###### ",
  "######## ####  ## ######## ####  ##       ## ######## ######## ####  ##       ######## ######## ## ########       ## ######## ########",
  "###  ##  ###   ## ######## ###   ##  #    ## #### ##  ###  ##  ###   ##       ###  ##  ###  ##  ## ###  ##  #     ## ###  ##  ###  ## ",
  "##       ##    ## ######## ##    ## ##    ## ####     ##       ##    ##       ##       ##       ## ##       ##    ## ##       ##      ",
  "##       ##    ## ## ## ## ##   ### ##    ## # ##     ###      ##   ###       ###      ##       ## ###      ###   ## ##       ###     ",
  "##       ##    ## ##    ## ##  #### ##    ##   ##     ####     ##  ####       ####     ##       ## ####     ####  ## ##       ####    ",
  "##       ##    ## ##    ## ## ####  ##    ##   ##      ##      ## ####         ####    ##       ##  ##      ##### ## ##        ##     ",
  "##       ##    ## ##    ## ######   ##    ##   ##              ######           ####   ##       ##          ######## ##               ",
  "##       ##    ## ##    ## ## ##    ##    ##   ##      ##      #######           ####  ##       ##  ##      ## ##### ##        ##     ",
  "##       ##    ## ##    ## ##       ##    ##   ##     ####     ########           #### ##       ## ####     ##  #### ##       ####    ",
  "##     # ##    ## ##    ## ##       ##    ##   ##     ###      ###  ###       #    ### ##     # ## ###      ##   ### ##     # ###     ",
  "##    ## ##    ## ##    ## ##       ##    ##   ##     ##       ##    ##       ##    ## ##    ## ## ##       ##    ## ##    ## ##      ",
  "##   ### ##   ### ##    ## ##       ##    ##   ##     ##   ##  ##    ##       ##   ### ##   ### ## ##   ##  ##     # ##   ### ##   ## ",
  "##  #### ##  #### ##    ## ##       ##    ##   ##     ##  #### ##    ##       ##  #### ##  #### ## ##  #### ##       ##  #### ##  ####",
  " # ####   # ####  ##    #  ##       ###  ###   ##      # ####  ##    #         # ####   # ####  #   # ####  ##        # ####   # #### ",
  "  ####     ####   ##       ##       ########   ##       ####   ##               ####     ####        ####   ##         ####     ####  ",
  "   ##       ##    #        #         ##  ##     #        ##    #                 ##       ##          ##    #           ##       ##   ",
  "                                                                                                                                      ",
  "                                                                                                                                      ",
  " #        #    ##       ##       ##                ##       ##     #    ##           #    ##                            ##       ##   ",
  "##       ##   ####     ####     ####              ####     ####   ##   ####         ##   ####                          ####     ####  ",
  "##       ##  ######   ######   #### #         #  ######   ######  ##  #### #        ##  #### #   #           #        #### #   ###### ",
  "##       ## ######## ######## ####  ##       ## ######## ######## ## ####  ##       ## ####  ## ##          ##       ####  ## ########",
  "## #     ## ###  ##  #### ##  ###   ##  #    ## ###  ##  #### ##  ## ###   ## #     ## ###   ## ##          ##       ###   ## ###  ###",
  "## ##    ## ##       ####     ##    ## ##    ## ##       ####     ## ##    ## ##    ## ##    ## ##          ##       ##    ## ##    ##",
  "## ###   ## ###      # ##     ##   ### ##    ## ##       # ##     ## ##    ## ###   ## ##    ## ##          ##       ##    ## ##   ###",
  "## ####  ## ####       ##     ##  #### ##    ## ##         ##     ## ##    ## ####  ## ##    ## ##          ##       ##    ## ##  ####",
  "## ##### ##  ####      ##     ## ####  ##    ## ##         ##     ## ##    ## ##### ## ##    ## ##          ##       ##    ## ##  ### ",
  "## ########   ####     ##     ######   ##    ## ##         ##     ## ##    ## ######## ##    ## ##          ##       ##    ## ##  ##  ",
  "## ## #####    ####    ##     #######  ##    ## ##         ##     ## ##    ## ## ##### ##   ### ##          ##       ##   ### ##  ### ",
  "## ##  ####     ####   ##     ######## ##    ## ##         ##     ## ##    ## ##  #### ##  #### ##          ##       ##  #### ##  ####",
  "## ##   ### #    ###   ##     ###  ### ##    ## ##     #   ##     ## ##    ## ##   ### ## ##### ##          ##       ## ##### ##   ###",
  "## ##    ## ##    ##   ##     ##    ## ##    ## ##    ##   ##     ## ##    ## ##    ## ######## ##          ##       ######## ##    ##",
  "## ##     # ##   ###   ##     ##    ## ##    ## ##   ###   ##     ## ##   ### ##     # ## ## ## ##   ##     ##   ##  ## ## ## ##   ###",
  "## ##       ##  ####   ##     ##    ## ##    ## ##  ####   ##     ## ##  #### ##       ##    ## ##  ####    ##  #### ##    ## ##  ####",
  "#  ##        # ####    ##     ##    #  ###  ###  # ####    ##     #   # ####  ##       ##    #   # ####      # ####  ##    #   # #### ",
  "   ##         ####     ##     ##       ########   ####     ##          ####   ##       ##         ####        ####   ##         ####  ",
  "   #           ##       #     #         ##  ##     ##       #           ##    #        #           ##          ##    #           ##   ",
  "                                                                                                                                      ",
];
const GRID = TEXT.map((row) =>
  Array.from({ length: row.length }, (_, j) => row.charAt(j) == "#"),
);

const MILLIS_BEFORE_FIRST_CLEANUP_PHASE = 1000;
const MILLIS_BETWEEN_CLEANUP_PHASES = 50;
const CLEANUP_DISTRIBUTION = [0.02, 0.06, 0.14, 0.24, 0.36, 0.48, 0.6, 0.72, 0.86, 1.0];
const MIN_MILLIS_BETWEEN_RENDERS = 20;

const getTriangles = (): Float32Array => {
  const vertcies = [];
  for (let i = 0; i < GRID.length; i++) {
    const layout = i < 21 ? TOP_LAYOUT : BOTTOM_LAYOUT;
    for (let j = 0; j < GRID[0]!.length; j++) {
      if (GRID[i]![j]) {
        const facingRight =
          layout.charAt(j) == "r" ? (i % 21) % 2 == 0 : (i % 21) % 2 == 1;
        if (facingRight) {
          vertcies.push(
            j / 134,
            i / 43,
            (j + 1) / 134,
            (i + 1) / 43,
            j / 134,
            (i + 2) / 43,
          );
        } else {
          vertcies.push(
            (j + 1) / 134,
            i / 43,
            (j + 1) / 134,
            (i + 2) / 43,
            j / 134,
            (i + 1) / 43,
          );
        }
      }
    }
  }
  return new Float32Array(vertcies);
};

const TriangleRenderer: React.FC<{}> = ({}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const vertexBufferRef = useRef<WebGLBuffer | null>(null);

  const createShader = (
    gl: WebGLRenderingContext,
    type: number,
    source: string,
  ): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) {
      console.error("Error creating shader");
      return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) return shader;

    console.error("Error compiling shader:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  };

  const createProgram = (
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
  ): WebGLProgram | null => {
    const program = gl.createProgram();
    if (!program) {
      console.error("Error creating program");
      return null;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) return program;

    console.error("Program linking failed:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  };

  let canvasActive = typeof window !== "undefined" ? window.innerWidth >= 640 : true;
  const render = () => {
    const gl = glRef.current;
    const program = programRef.current;
    const vertexBuffer = vertexBufferRef.current;
    const canvas = canvasRef.current;

    if (!canvasActive || !gl || !program || !vertexBuffer || !canvas) return;

    const triangles = getTriangles();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangles, gl.DYNAMIC_DRAW);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    const vertexCount = triangles.length / 2;
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setCanvasSize();

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

    const fragmentShaderSource = `
      precision mediump float;
      void main() {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
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
      console.error("Error creating buffer");
      return;
    }
    vertexBufferRef.current = vertexBuffer;

    const positionAttribLocation = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

    render();

    return () => {
      if (gl) {
        if (program) gl.deleteProgram(program);
        if (vertexShader) gl.deleteShader(vertexShader);
        if (fragmentShader) gl.deleteShader(fragmentShader);
        if (vertexBuffer) gl.deleteBuffer(vertexBuffer);
      }
    };
  }, []);

  const setCanvasSize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvasActive = window.innerWidth >= 640;

    const width = 0.97 * window.innerWidth;
    const height = width / 5.27488;
    canvas.style.width = `${Math.round(width)}px`;
    canvas.style.height = `${Math.round(height)}px`;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    render();
  };

  let renderTimeoutId: NodeJS.Timeout | null = null;
  const requestRender = () => {
    if (renderTimeoutId === null) {
      renderTimeoutId = setTimeout(() => {
        renderTimeoutId = null;
        render();
      }, MIN_MILLIS_BETWEEN_RENDERS);
    }
  };

  let cleanupPhases: number[][][] = [];
  let cleanupTimeoutId: NodeJS.Timeout | null = null;
  const doCleanupPhase = () => {
    cleanupPhases
      .pop()!
      .forEach(
        (pos) =>
          (GRID[pos[0]!]![pos[1]!] = TEXT[pos[0]!]!.charAt(pos[1]!) === "#"),
      );
    render();
    if (cleanupPhases.length > 0) {
      cleanupTimeoutId = setTimeout(
        doCleanupPhase,
        MILLIS_BETWEEN_CLEANUP_PHASES,
      );
    }
  };

  const requestCleanupAnimation = () => {
    if (cleanupTimeoutId !== null) {
      clearTimeout(cleanupTimeoutId);
    }

    cleanupPhases = Array.from({length: CLEANUP_DISTRIBUTION.length}, () => []);
    for (let i = 0; i < GRID.length; i++) {
      for (let j = 0; j < GRID[0]!.length; j++) {
        const x = Math.random();
        for (let k = 0; k < CLEANUP_DISTRIBUTION.length; k++) {
            if (x <= CLEANUP_DISTRIBUTION[k]!) {
                cleanupPhases[k]!.push([i, j]);
                break;
            }
        }
      }
    }
    console.log(cleanupPhases.length, cleanupPhases.map(x => x.length));

    cleanupTimeoutId = setTimeout(
      doCleanupPhase,
      MILLIS_BEFORE_FIRST_CLEANUP_PHASE,
    );
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !canvasActive) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const row = Math.min(
      Math.max(Math.floor(y * GRID.length), 0),
      GRID.length - 1,
    );
    const col = Math.min(
      Math.max(Math.floor(x * GRID[0]!.length), 0),
      GRID[0]!.length - 1,
    );

    const firstRow = Math.max(row - 8, 0);
    const lastRow = Math.min(row + 8, GRID.length - 1);
    const firstCol = Math.max(col - 5, 0);
    const lastCol = Math.min(col + 5, GRID[0]!.length - 1);
    for (let i = firstRow; i <= lastRow; i++) {
      for (let j = firstCol; j <= lastCol; j++) {
        const p =
          0.05 -
          Math.sqrt((row - i) * (row - i) + 2 * (col - j) * (col - j)) / 150;
        if (Math.random() < p) {
          GRID[i]![j] = !GRID[i]![j];
        }
      }
    }

    requestRender();
    requestCleanupAnimation();
  };

  useEffect(() => {
    window.addEventListener("resize", setCanvasSize);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  return (
    <div
      className="flex w-full items-center justify-center border-b border-black"
      style={{ aspectRatio: 5 }}
    >
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        className="hidden sm:block"
      >
        Computer Science Instructional Lab
      </canvas>
      <img
        src={hero.src}
        className="sm:hidden"
        alt="Computer Science Instructional Lab"
      />
    </div>
  );
};

export default TriangleRenderer;
