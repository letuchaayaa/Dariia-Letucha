import * as THREE from './vendor/three.module.min.js';

const section = document.querySelector('[data-cinematic-demo]');
const canvas = document.querySelector('[data-cinematic-canvas]');
const copy = section?.querySelector('.cinematic-demo__copy');

if (section && canvas && copy) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(innerWidth < 768 ? 50 : 45, innerWidth / innerHeight, .1, 100);
  const cylinder = new THREE.Group();
  scene.add(cylinder);

  const count = 12;
  const radius = innerWidth < 768 ? 2.2 : 2.5;
  const panelWidth = (Math.PI * 2 * radius / count) * 1.025;
  const panelHeight = innerWidth < 768 ? 1.2 : 2;
  const loader = new THREE.TextureLoader();

  for (let index = 0; index < count; index += 1) {
    const angle = index / count * Math.PI * 2;
    const texture = loader.load(`assets/cinematic/img${index + 1}.webp`);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    const material = new THREE.MeshBasicMaterial({ map: texture, color: 0xaaaaaa, side: THREE.DoubleSide });
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(panelWidth, panelHeight), material);
    panel.position.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius);
    panel.rotation.y = angle;
    cylinder.add(panel);
  }

  const particleLines = [];
  for (let index = 0; index < 12; index += 1) {
    const points = [];
    const base = index / 12 * Math.PI * 2;
    const lineRadius = radius + .8;
    for (let segment = 0; segment <= 20; segment += 1) {
      const angle = base + segment / 20 * .3;
      points.push(new THREE.Vector3(Math.cos(angle) * lineRadius, -1 + (index % 7) / 6 * 2, Math.sin(angle) * lineRadius));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
    const line = new THREE.Line(geometry, material);
    cylinder.add(line);
    particleLines.push(line);
  }

  const cameraKeyframes = [
    { at: 0, value: [0, 0, 8] },
    { at: .17, value: [0, 5, 5] },
    { at: .4, value: [1.5, 2, 2] },
    { at: .78, value: [.5, 0, .8] },
    { at: 1, value: [-6, -1, 8] },
  ];

  const ease = (value) => value * value * (3 - 2 * value);
  const sampleCamera = (progress) => {
    let left = cameraKeyframes[0];
    let right = cameraKeyframes[cameraKeyframes.length - 1];
    for (let index = 0; index < cameraKeyframes.length - 1; index += 1) {
      if (progress >= cameraKeyframes[index].at && progress <= cameraKeyframes[index + 1].at) {
        left = cameraKeyframes[index];
        right = cameraKeyframes[index + 1];
        break;
      }
    }
    const local = ease((progress - left.at) / Math.max(.001, right.at - left.at));
    return left.value.map((value, index) => THREE.MathUtils.lerp(value, right.value[index], local));
  };

  let target = 0;
  let current = 0;
  let previousRotation = 0;

  const updateTarget = () => {
    const distance = Math.max(1, section.offsetHeight - innerHeight);
    target = THREE.MathUtils.clamp((scrollY - section.offsetTop) / distance, 0, 1);
    document.body.classList.toggle('cinematic-active', scrollY < section.offsetTop + section.offsetHeight - 2);
  };

  const resize = () => {
    const width = innerWidth;
    const height = innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = width < 768 ? 50 : 45;
    camera.updateProjectionMatrix();
    updateTarget();
  };

  const render = () => {
    current += (target - current) * .065;
    const cameraPosition = sampleCamera(current);
    camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
    camera.lookAt(0, 0, 0);
    const rotation = .5 + current * 28.27;
    const velocity = Math.abs(rotation - previousRotation);
    previousRotation = rotation;
    cylinder.rotation.y = rotation;
    particleLines.forEach((line, index) => {
      line.material.opacity += (Math.min(.95, velocity * 28) - line.material.opacity) * (.11 + index % 3 * .02);
    });
    const copyFade = current < .72 ? 1 : 1 - (current - .72) / .22;
    copy.style.opacity = String(Math.max(0, copyFade));
    copy.style.transform = `translate(-50%, calc(-50% - ${current * 32}px))`;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  addEventListener('scroll', updateTarget, { passive: true });
  addEventListener('resize', resize);
  resize();
  updateTarget();
  requestAnimationFrame(render);
}
