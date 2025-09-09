"use client";

import React, { useRef, useEffect } from "react";

import { createShader, createProgram } from "~/util/webgl";
import { useResize, type Timeout } from "~/util/resize";

const TWO_LINES = [
  "                                                                                                                                      ",
  "   ##                    #                                                       ##                                #             ##   ",
  "  ####      ##          ##    ##                ##                ##            ####      ##          ##          ##    ##      ####  ",
  " ######    ####    ##  ###   ####          #   ####      ##      ####          ######    ####    #   ####         ##   ####    ###### ",
  "########  #### #  ########  #### #        ##  ######    ####    #### #        ########  ######  ##  ######        ##  ######  ########",
  "###  ##  ####  ## ######## ####  ##  #    ## ########  ######  ####  ##       ###  ##  ######## ## ######## #     ## ######## ###  ## ",
  "##       ###   ## ######## ###   ## ##    ## #### ##  ######## ###   ##       ##       ###  ##  ## ###  ##  ##    ## ###  ##  ##      ",
  "##       ##    ## ## ## ## ##    ## ##    ## ####     ###  ##  ##    ##       ###      ##       ## ##       ###   ## ##       ###     ",
  "##       ##    ## ##    ## ##   ### ##    ## # ##     ##       ##   ###       ####     ##       ## ###      ####  ## ##       ####    ",
  "##       ##    ## ##    ## ##  #### ##    ##   ##     ###      ##  ####        ####    ##       ## ####     ##### ## ##        ##     ",
  "##       ##    ## ##    ## ## ####  ##    ##   ##     ####     ## ####          ####   ##       ##  ##      ######## ##               ",
  "##       ##    ## ##    ## ######   ##    ##   ##      ##      ######            ####  ##       ##          ## ##### ##        ##     ",
  "##       ##    ## ##    ## ## ##    ##    ##   ##              #######            #### ##       ##  ##      ##  #### ##       ####    ",
  "##     # ##    ## ##    ## ##       ##    ##   ##      ##      ########       #    ### ##       ## ####     ##   ### ##       ###     ",
  "##    ## ##    ## ##    ## ##       ##    ##   ##     ####     ###  ###       ##    ## ##     # ## ###      ##    ## ##     # ##      ",
  "##   ### ##    ## ##    ## ##       ##    ##   ##     ###      ##    ##       ##   ### ##    ## ## ##       ##     # ##    ## ##   ## ",
  "##  #### ##   ### ##    ## ##       ##    ##   ##     ##       ##    ##       ##  #### ##   ### ## ##   ##  ##       ##   ### ##  ####",
  " # ####  ##  #### ##    #  ##       ###  ###   ##     ##   ##  ##    ##        # ####  ##  #### ## ##  #### ##       ##  ####  # #### ",
  "  ####    # ####  ##       ##       ########   ##     ##  #### ##    #          ####    # ####  ##  # ####  ##        # ####    ####  ",
  "   ##      ####   #        ##        ##  ##    ##      # ####  ##                ##      ####   #    ####   #          ####      ##   ",
  "            ##             #                    #       ####   #                          ##          ##                ##            ",
  "                                                         ##                                                                           ",
  "                                                                                                                                      ",
  "               ##                ##                ##                                #                                           ##   ",
  "          #   ####      ##      ####          #   ####      ##          ##          ##    ##                            ##      ####  ",
  " #       ##  ######    ####    #### #        ##  ######    ####    #   ####         ##   ####    #           #         ####    ###### ",
  "##       ## ########  ######  ####  ##  #    ## ########  ######  ##  #### #        ##  #### #  ##          ##        #### #  ########",
  "##       ## ###  ##  ######## ###   ## ##    ## ###  ##  ######## ## ####  ## #     ## ####  ## ##          ##       ####  ## ###  ###",
  "## #     ## ##       #### ##  ##    ## ##    ## ##       #### ##  ## ###   ## ##    ## ###   ## ##          ##       ###   ## ##    ##",
  "## ##    ## ###      ####     ##   ### ##    ## ##       ####     ## ##    ## ###   ## ##    ## ##          ##       ##    ## ##   ###",
  "## ###   ## ####     # ##     ##  #### ##    ## ##       # ##     ## ##    ## ####  ## ##    ## ##          ##       ##    ## ##  ####",
  "## ####  ##  ####      ##     ## ####  ##    ## ##         ##     ## ##    ## ##### ## ##    ## ##          ##       ##    ## ##  ### ",
  "## ##### ##   ####     ##     ######   ##    ## ##         ##     ## ##    ## ######## ##    ## ##          ##       ##    ## ##  ##  ",
  "## ########    ####    ##     #######  ##    ## ##         ##     ## ##    ## ## ##### ##    ## ##          ##       ##    ## ##  ### ",
  "## ## #####     ####   ##     ######## ##    ## ##         ##     ## ##    ## ##  #### ##   ### ##          ##       ##   ### ##  ####",
  "## ##  #### #    ###   ##     ###  ### ##    ## ##     #   ##     ## ##    ## ##   ### ##  #### ##          ##       ##  #### ##   ###",
  "## ##   ### ##    ##   ##     ##    ## ##    ## ##    ##   ##     ## ##    ## ##    ## ## ##### ##          ##       ## ##### ##    ##",
  "## ##    ## ##   ###   ##     ##    ## ##    ## ##   ###   ##     ## ##    ## ##     # ######## ##   ##     ##   ##  ######## ##   ###",
  "## ##     # ##  ####   ##     ##    ## ###  ### ##  ####   ##     ## ##   ### ##       ## ## ## ##  ####    ##  #### ## ## ## ##  ####",
  "## ##        # ####    ##     ##    #  ########  # ####    ##     ## ##  #### ##       ##    ##  # ####      # ####  ##    ##  # #### ",
  "## ##         ####     ##     ##        ##  ##    ####     ##     ##  # ####  ##       ##    #    ####        ####   ##    #    ####  ",
  "#  ##          ##      ##     #                    ##      ##     #    ####   #        ##          ##          ##    ##          ##   ",
  "   #                    #                                   #           ##             #                             #                ",
  "                                                                                                                                      ",
];
const ONE_LINE = [
  "                                                                                                                                                                                                                                                                              ",
  "   ##                    #                               ##                    ##                                #             ##                      ##                ##                ##                                #                                           ##   ",
  "  ####      ##          ##    ##                ##      ####      ##          ####      ##          ##          ##    ##      ####                #   ####      ##      ####          #   ####      ##          ##          ##    ##                            ##      ####  ",
  " ######    ####    ##  ###   ####          #   ####    ######    ####        ######    ####    #   ####         ##   ####    ######      #       ##  ######    ####    #### #        ##  ######    ####    #   ####         ##   ####    #           #         ####    ###### ",
  "########  #### #  ########  #### #        ##  ######  ########  #### #      ########  ######  ##  ######        ##  ######  ########    ##       ## ########  ######  ####  ##  #    ## ########  ######  ##  #### #        ##  #### #  ##          ##        #### #  ########",
  "###  ##  ####  ## ######## ####  ##  #    ## ######## ###  ##  ####  ##     ###  ##  ######## ## ######## #     ## ######## ###  ##     ##       ## ###  ##  ######## ###   ## ##    ## ###  ##  ######## ## ####  ## #     ## ####  ## ##          ##       ####  ## ###  ###",
  "##       ###   ## ######## ###   ## ##    ## #### ##  ##       ###   ##     ##       ###  ##  ## ###  ##  ##    ## ###  ##  ##          ## #     ## ##       #### ##  ##    ## ##    ## ##       #### ##  ## ###   ## ##    ## ###   ## ##          ##       ###   ## ##    ##",
  "##       ##    ## ## ## ## ##    ## ##    ## ####     ###      ##    ##     ###      ##       ## ##       ###   ## ##       ###         ## ##    ## ###      ####     ##   ### ##    ## ##       ####     ## ##    ## ###   ## ##    ## ##          ##       ##    ## ##   ###",
  "##       ##    ## ##    ## ##   ### ##    ## # ##     ####     ##   ###     ####     ##       ## ###      ####  ## ##       ####        ## ###   ## ####     # ##     ##  #### ##    ## ##       # ##     ## ##    ## ####  ## ##    ## ##          ##       ##    ## ##  ####",
  "##       ##    ## ##    ## ##  #### ##    ##   ##      ##      ##  ####      ####    ##       ## ####     ##### ## ##        ##         ## ####  ##  ####      ##     ## ####  ##    ## ##         ##     ## ##    ## ##### ## ##    ## ##          ##       ##    ## ##  ### ",
  "##       ##    ## ##    ## ## ####  ##    ##   ##              ## ####        ####   ##       ##  ##      ######## ##                   ## ##### ##   ####     ##     ######   ##    ## ##         ##     ## ##    ## ######## ##    ## ##          ##       ##    ## ##  ##  ",
  "##       ##    ## ##    ## ######   ##    ##   ##      ##      ######          ####  ##       ##          ## ##### ##        ##         ## ########    ####    ##     #######  ##    ## ##         ##     ## ##    ## ## ##### ##    ## ##          ##       ##    ## ##  ### ",
  "##       ##    ## ##    ## ## ##    ##    ##   ##     ####     #######          #### ##       ##  ##      ##  #### ##       ####        ## ## #####     ####   ##     ######## ##    ## ##         ##     ## ##    ## ##  #### ##   ### ##          ##       ##   ### ##  ####",
  "##     # ##    ## ##    ## ##       ##    ##   ##     ###      ########     #    ### ##       ## ####     ##   ### ##       ###         ## ##  #### #    ###   ##     ###  ### ##    ## ##     #   ##     ## ##    ## ##   ### ##  #### ##          ##       ##  #### ##   ###",
  "##    ## ##    ## ##    ## ##       ##    ##   ##     ##       ###  ###     ##    ## ##     # ## ###      ##    ## ##     # ##          ## ##   ### ##    ##   ##     ##    ## ##    ## ##    ##   ##     ## ##    ## ##    ## ## ##### ##          ##       ## ##### ##    ##",
  "##   ### ##    ## ##    ## ##       ##    ##   ##     ##   ##  ##    ##     ##   ### ##    ## ## ##       ##     # ##    ## ##   ##     ## ##    ## ##   ###   ##     ##    ## ##    ## ##   ###   ##     ## ##    ## ##     # ######## ##   ##     ##   ##  ######## ##   ###",
  "##  #### ##   ### ##    ## ##       ##    ##   ##     ##  #### ##    ##     ##  #### ##   ### ## ##   ##  ##       ##   ### ##  ####    ## ##     # ##  ####   ##     ##    ## ###  ### ##  ####   ##     ## ##   ### ##       ## ## ## ##  ####    ##  #### ## ## ## ##  ####",
  " # ####  ##  #### ##    #  ##       ###  ###   ##      # ####  ##    ##      # ####  ##  #### ## ##  #### ##       ##  ####  # ####     ## ##        # ####    ##     ##    #  ########  # ####    ##     ## ##  #### ##       ##    ##  # ####      # ####  ##    ##  # #### ",
  "  ####    # ####  ##       ##       ########   ##       ####   ##    #        ####    # ####  ##  # ####  ##        # ####    ####      ## ##         ####     ##     ##        ##  ##    ####     ##     ##  # ####  ##       ##    #    ####        ####   ##    #    ####  ",
  "   ##      ####   #        ##        ##  ##    ##        ##    ##              ##      ####   #    ####   #          ####      ##       #  ##          ##      ##     #                    ##      ##     #    ####   #        ##          ##          ##    ##          ##   ",
  "            ##             #                    #              #                        ##          ##                ##                   #                    #                                   #           ##             #                             #                ",
  "                                                                                                                                                                                                                                                                              ",
];

const CLEANUP_PHASES = 12;
const MILLIS_BEFORE_FIRST_CLEANUP_PHASE = 1000;
const MILLIS_BETWEEN_CLEANUP_PHASES = 50;
const CLEANUP_SMOOTHING_FACTOR = 10;
const MIN_MILLIS_BETWEEN_RENDERS = 20;
const X_PADDING = 2;
const Y_PADDING = 2;

const CsilTriangles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const vertexBufferRef = useRef<WebGLBuffer | null>(null);
  const useOneLineRef = useRef(
    typeof window === "undefined" || window.innerWidth >= 1024,
  );
  const gridRef = useRef<boolean[][]>([]);
  const rowsRef = useRef(-1);
  const colsRef = useRef(-1);
  const lastRenderRef = useRef(0);
  const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resizeRequestRef = useRef<Timeout | null>(null);

  const setupGrid = () => {
    const text = useOneLineRef.current ? ONE_LINE : TWO_LINES;
    gridRef.current = text.map((row) =>
      Array.from({ length: row.length }, (_, j) => row.charAt(j) == "#"),
    );
    rowsRef.current = gridRef.current.length;
    colsRef.current = gridRef.current[0]!.length;
  };
  setupGrid();

  const makeCleanupTemplate = () => {
    const cleanupPhases: number[][][] = Array.from(
      { length: CLEANUP_PHASES },
      () => [],
    );
    for (let i = 0; i < rowsRef.current; i++) {
      for (let j = 0; j < colsRef.current; j++) {
        const t =
          (Math.pow(CLEANUP_SMOOTHING_FACTOR, Math.random()) - 1) /
          (CLEANUP_SMOOTHING_FACTOR - 1);
        const phase = Math.floor((1 - t) * CLEANUP_PHASES);
        cleanupPhases[phase]!.push([i, j]);
      }
    }
    return cleanupPhases;
  };

  const getTriangles = (): Float32Array => {
    const deltaX = 1 / (colsRef.current + 2 * X_PADDING);
    const deltaY = 1 / (rowsRef.current + 1 + 2 * Y_PADDING);
    const vertcies = [];
    for (let i = 0; i < rowsRef.current; i++) {
      for (let j = 0; j < colsRef.current; j++) {
        if (gridRef.current[i]![j]) {
          const facingLeft = j % 2 === i % 2;
          if (facingLeft) {
            vertcies.push(
              (j + 1 + X_PADDING) * deltaX,
              (i + Y_PADDING) * deltaY,
              (j + 1 + X_PADDING) * deltaX,
              (i + 2 + Y_PADDING) * deltaY,
              (j + X_PADDING) * deltaX,
              (i + 1 + Y_PADDING) * deltaY,
            );
          } else {
            vertcies.push(
              (j + X_PADDING) * deltaX,
              (i + Y_PADDING) * deltaY,
              (j + 1 + X_PADDING) * deltaX,
              (i + 1 + Y_PADDING) * deltaY,
              (j + X_PADDING) * deltaX,
              (i + 2 + Y_PADDING) * deltaY,
            );
          }
        }
      }
    }
    return new Float32Array(vertcies);
  };

  const render = () => {
    const gl = glRef.current;
    const program = programRef.current;
    const vertexBuffer = vertexBufferRef.current;
    const canvas = canvasRef.current;

    if (!gl || !program || !vertexBuffer || !canvas) return;

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

    resize();

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
  });

  const resize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = containerRef.current
      ? containerRef.current.clientWidth
      : window.innerWidth;
    const shouldUseOneLine = width >= 1024;
    if (shouldUseOneLine != useOneLineRef.current) {
      useOneLineRef.current = shouldUseOneLine;
      setupGrid();
      if (cleanupTimeoutId !== null) {
        clearTimeout(cleanupTimeoutId);
      }
    }

    const aspectRatio =
      (rowsRef.current + 1 + 2 * Y_PADDING) /
      (Math.sqrt(3) * (colsRef.current + 2 * X_PADDING));
    const height = aspectRatio * width;

    canvas.style.width = `${Math.round(width)}px`;
    canvas.style.height = `${Math.round(height)}px`;

    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);

    render();
  };

  const requestRender = () => {
    if (renderTimeoutRef.current !== null) return;
    const millisSinceLastRender = performance.now() - lastRenderRef.current;
    if (millisSinceLastRender >= MIN_MILLIS_BETWEEN_RENDERS) {
      render();
    } else {
      renderTimeoutRef.current = setTimeout(() => {
        renderTimeoutRef.current = null;
        lastRenderRef.current = performance.now();
        render();
      }, MIN_MILLIS_BETWEEN_RENDERS - millisSinceLastRender);
    }
  };

  let cleanupPhases: number[][][] = [];
  let cleanupTimeoutId: NodeJS.Timeout | null = null;
  const doCleanupPhase = () => {
    const text = useOneLineRef.current ? ONE_LINE : TWO_LINES;
    cleanupPhases
      .pop()!
      .forEach(
        (pos) =>
          (gridRef.current[pos[0]!]![pos[1]!] =
            text[pos[0]!]!.charAt(pos[1]!) === "#"),
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

    cleanupPhases = makeCleanupTemplate();

    cleanupTimeoutId = setTimeout(
      doCleanupPhase,
      MILLIS_BEFORE_FIRST_CLEANUP_PHASE,
    );
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || containerRef.current!.clientWidth < 640) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const unclippedRow = y * (rowsRef.current + 2 * Y_PADDING) - Y_PADDING;
    const unclippedCol = x * (colsRef.current + 2 * X_PADDING) - X_PADDING;
    const row = Math.min(
      Math.max(Math.floor(unclippedRow), 0),
      rowsRef.current - 1,
    );
    const col = Math.min(
      Math.max(Math.floor(unclippedCol), 0),
      colsRef.current - 1,
    );

    const firstRow = Math.max(row - 8, 0);
    const lastRow = Math.min(row + 8, rowsRef.current - 1);
    const firstCol = Math.max(col - 5, 0);
    const lastCol = Math.min(col + 5, colsRef.current - 1);
    for (let i = firstRow; i <= lastRow; i++) {
      for (let j = firstCol; j <= lastCol; j++) {
        const p =
          0.05 -
          Math.sqrt((row - i) * (row - i) + 2 * (col - j) * (col - j)) / 150;
        if (Math.random() < p) {
          gridRef.current[i]![j] = !gridRef.current[i]![j];
        }
      }
    }

    requestRender();
    requestCleanupAnimation();
  };

  useResize(resize, containerRef, resizeRequestRef);

  return (
    <div className="flex w-full border-b border-black">
      <div className="csil-triangles-aspect-ratio w-full" ref={containerRef}>
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          width="0"
          height="0"
        >
          Computer Science Instructional Lab
        </canvas>
      </div>
    </div>
  );
};

export default CsilTriangles;
