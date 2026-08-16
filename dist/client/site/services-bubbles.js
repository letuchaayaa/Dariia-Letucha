(() => {
  const canvas = document.querySelector("[data-services-bubbles]");
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    premultipliedAlpha: false,
  });
  if (!gl) return;

  const trailLength = 15;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointer = { x: 0.72, y: 0.04, tx: 0.72, ty: 0.04 };
  const trail = Array.from({ length: trailLength }, () => ({ x: pointer.x, y: pointer.y }));
  let frame = 0;
  let startTime = performance.now();
  let width = 1;
  let height = 1;

  const vertexShaderSource = `
    attribute vec2 aPosition;
    varying vec2 vTexCoord;

    void main() {
      vTexCoord = aPosition * 0.5 + 0.5;
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;

    const int TRAIL_LENGTH = 15;
    const float EPS = 1e-4;
    const int ITR = 18;

    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uPointerTrail[TRAIL_LENGTH];

    varying vec2 vTexCoord;

    float rnd3D(vec3 p) {
      return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453123);
    }

    float noise3D(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);

      float a000 = rnd3D(i);
      float a100 = rnd3D(i + vec3(1.0, 0.0, 0.0));
      float a010 = rnd3D(i + vec3(0.0, 1.0, 0.0));
      float a110 = rnd3D(i + vec3(1.0, 1.0, 0.0));
      float a001 = rnd3D(i + vec3(0.0, 0.0, 1.0));
      float a101 = rnd3D(i + vec3(1.0, 0.0, 1.0));
      float a011 = rnd3D(i + vec3(0.0, 1.0, 1.0));
      float a111 = rnd3D(i + vec3(1.0, 1.0, 1.0));

      vec3 u = f * f * (3.0 - 2.0 * f);
      float k0 = a000;
      float k1 = a100 - a000;
      float k2 = a010 - a000;
      float k3 = a001 - a000;
      float k4 = a000 - a100 - a010 + a110;
      float k5 = a000 - a010 - a001 + a011;
      float k6 = a000 - a100 - a001 + a101;
      float k7 = -a000 + a100 + a010 - a110 + a001 - a101 - a011 + a111;

      return k0 + k1 * u.x + k2 * u.y + k3 * u.z + k4 * u.x * u.y + k5 * u.y * u.z + k6 * u.z * u.x + k7 * u.x * u.y * u.z;
    }

    vec3 origin = vec3(0.0, 0.0, 1.0);
    vec3 lookAt = vec3(0.0, 0.0, 0.0);
    vec3 cDir = normalize(lookAt - origin);
    vec3 cUp = vec3(0.0, 1.0, 0.0);
    vec3 cSide = cross(cDir, cUp);

    float smoothMin(float d1, float d2, float k) {
      float h = exp(-k * d1) + exp(-k * d2);
      return -log(h) / k;
    }

    vec3 translate(vec3 p, vec3 t) {
      return p - t;
    }

    float sdSphere(vec3 p, float s) {
      return length(p) - s;
    }

    float map(vec3 p) {
      float baseRadius = min(uResolution.x, uResolution.y) < 760.0 ? 0.0095 : 0.012;
      float radius = baseRadius * float(TRAIL_LENGTH);
      float k = 7.0;
      float d = 1e5;

      for (int i = 0; i < TRAIL_LENGTH; i++) {
        float fi = float(i);
        vec2 pointerTrail = uPointerTrail[i] * uResolution / min(uResolution.x, uResolution.y);
        float sphere = sdSphere(translate(p, vec3(pointerTrail, 0.0)), radius - baseRadius * fi);
        d = smoothMin(d, sphere, k);
      }

      float fixedRadius = min(uResolution.x, uResolution.y) < 760.0 ? 0.34 : 0.54;
      float fixedX = min(uResolution.x, uResolution.y) < 760.0 ? 0.02 : 0.98;
      float fixedY = min(uResolution.x, uResolution.y) < 760.0 ? 0.28 : -0.24;
      float sphere = sdSphere(translate(p, vec3(fixedX, fixedY, 0.0)), fixedRadius);
      d = smoothMin(d, sphere, k);

      float secondRadius = min(uResolution.x, uResolution.y) < 760.0 ? 0.2 : 0.34;
      float secondX = min(uResolution.x, uResolution.y) < 760.0 ? -0.48 : -0.82;
      float secondY = min(uResolution.x, uResolution.y) < 760.0 ? 0.58 : 0.36;
      float secondSphere = sdSphere(translate(p, vec3(secondX, secondY, 0.0)), secondRadius);
      d = smoothMin(d, secondSphere, k);

      return d;
    }

    vec3 generateNormal(vec3 p) {
      return normalize(vec3(
        map(p + vec3(EPS, 0.0, 0.0)) - map(p + vec3(-EPS, 0.0, 0.0)),
        map(p + vec3(0.0, EPS, 0.0)) - map(p + vec3(0.0, -EPS, 0.0)),
        map(p + vec3(0.0, 0.0, EPS)) - map(p + vec3(0.0, 0.0, -EPS))
      ));
    }

    vec3 dropletColor(vec3 normal, vec3 rayDir) {
      vec3 reflectDir = reflect(rayDir, normal);
      float noisePosTime = noise3D(reflectDir * 2.0 + uTime);
      float noiseNegTime = noise3D(reflectDir * 2.0 - uTime);

      vec3 _color0 = vec3(0.1765, 0.1255, 0.2275) * noisePosTime;
      vec3 _color1 = vec3(0.4118, 0.4118, 0.4157) * noiseNegTime;

      return (_color0 + _color1) * 2.3;
    }

    void main() {
      vec2 p = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);
      vec3 ray = origin + cSide * p.x + cUp * p.y;
      vec3 rayDirection = cDir;

      float dist = 0.0;
      for (int i = 0; i < ITR; ++i) {
        dist = map(ray);
        ray += rayDirection * dist;
        if (dist < EPS) break;
      }

      vec3 color = vec3(0.0);
      float alpha = 0.0;

      if (dist < EPS) {
        vec3 normal = generateNormal(ray);
        color = pow(dropletColor(normal, rayDirection), vec3(7.0));
        alpha = 0.92;
      }

      gl_FragColor = vec4(color, alpha);
    }
  `;

  const createShader = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
  if (!vertexShader || !fragmentShader) return;

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return;
  }

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, "aPosition");
  const timeLocation = gl.getUniformLocation(program, "uTime");
  const resolutionLocation = gl.getUniformLocation(program, "uResolution");
  const trailLocation = gl.getUniformLocation(program, "uPointerTrail");

  gl.useProgram(program);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const bounds = canvas.getBoundingClientRect();
    width = Math.max(1, Math.round(bounds.width * dpr));
    height = Math.max(1, Math.round(bounds.height * dpr));
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  };


  const render = (time = 0) => {
    const elapsed = (time - startTime) * 0.001;

    if (!reducedMotion.matches) {
      const rangeX = window.innerWidth <= 700 ? 0.12 : 0.18;
      const rangeY = window.innerWidth <= 700 ? 0.16 : 0.2;
      pointer.x = 0.58 + Math.sin(elapsed * 0.22) * rangeX;
      pointer.y = -0.08 + Math.cos(elapsed * 0.18) * rangeY;
    }

    if (!reducedMotion.matches) {
      pointer.tx += (pointer.x - pointer.tx) * 0.16;
      pointer.ty += (pointer.y - pointer.ty) * 0.16;
    }

    trail.pop();
    trail.unshift({ x: pointer.tx, y: pointer.ty });

    const trailData = new Float32Array(trailLength * 2);
    trail.forEach((point, index) => {
      trailData[index * 2] = point.x;
      trailData[index * 2 + 1] = point.y;
    });

    gl.useProgram(program);
    gl.uniform1f(timeLocation, elapsed * 1.6);
    gl.uniform2f(resolutionLocation, width, height);
    gl.uniform2fv(trailLocation, trailData);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    frame = requestAnimationFrame(render);
  };

  resize();
  render();

  window.addEventListener("resize", resize, { passive: true });

  window.addEventListener("pagehide", () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("resize", resize);
    gl.deleteBuffer(positionBuffer);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    gl.deleteProgram(program);
  });
})();
