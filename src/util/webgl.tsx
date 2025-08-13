export const createShader = (
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

  const success: unknown = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) return shader;

  console.error("Error compiling shader:", gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
};

export const createProgram = (
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

  const success: unknown = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) return program;

  console.error("Program linking failed:", gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
};

export const createUniform = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
): WebGLUniformLocation | null => {
  const uniform = gl.getUniformLocation(program, name);
  if (uniform) {
    return uniform;
  } else {
    console.error("Error creating uniform");
    return null;
  }
};
