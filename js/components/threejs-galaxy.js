import { detectPerformance } from "../utils/performance.js";

/**
 * Three.js galaxy background component
 */
export function initGalaxy() {
  if (!window.THREE || document.body.dataset.performance === "low") return;
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("webgl-container").appendChild(renderer.domElement);
  
  const blockCount = detectPerformance();
  const blocks = [];
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const materials = {
    "neon-chaos": [
      new THREE.MeshBasicMaterial({ color: 0x00d1b2, wireframe: true }),
      new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true }),
      new THREE.MeshBasicMaterial({ color: 0x4CAF50, wireframe: true })
    ],
    "void-glitch": [
      new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true }),
      new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true }),
      new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    ],
    "pixel-inferno": [
      new THREE.MeshBasicMaterial({ color: 0xff4500, wireframe: true }),
      new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }),
      new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true })
    ]
  };
  
  for (let i = 0; i < blockCount; i++) {
    const material = materials["neon-chaos"][Math.floor(Math.random() * 3)];
    const block = new THREE.Mesh(geometry, material);
    const bound = window.innerWidth < 768 ? 40 : 60;
    block.position.set(
      (Math.random() - 0.5) * bound,
      (Math.random() - 0.5) * bound,
      (Math.random() - 0.5) * bound
    );
    block.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    block.scale.set(Math.random() * 2 + 1, Math.random() * 2 + 1, Math.random() * 2 + 1);
    block.userData = {
      speedX: (Math.random() - 0.5) * 0.07,
      speedY: (Math.random() - 0.5) * 0.07,
      speedZ: (Math.random() - 0.5) * 0.07,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      glitch: Math.random() * 0.1
    };
    scene.add(block);
    blocks.push(block);
  }
  
  camera.position.z = window.innerWidth < 768 ? 30 : 40;
  
  let lastFrame = 0;
  const animate = (timestamp) => {
    if (timestamp - lastFrame < 16) {
      requestAnimationFrame(animate);
      return;
    }
    lastFrame = timestamp;
    
    blocks.forEach(block => {
      block.position.x += block.userData.speedX + Math.sin(Date.now() * 0.001) * block.userData.glitch;
      block.position.y += block.userData.speedY + Math.cos(Date.now() * 0.001) * block.userData.glitch;
      block.position.z += block.userData.speedZ;
      block.rotation.x += block.userData.rotSpeed;
      block.rotation.y += block.userData.rotSpeed;
      block.rotation.z += block.userData.rotSpeed;
      
      const bound = window.innerWidth < 768 ? 20 : 30;
      if (block.position.x > bound) block.position.x = -bound;
      if (block.position.x < -bound) block.position.x = bound;
      if (block.position.y > bound) block.position.y = -bound;
      if (block.position.y < -bound) block.position.y = bound;
      if (block.position.z > bound) block.position.z = -bound;
      if (block.position.z < -bound) block.position.z = bound;
    });
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  animate(0);
  
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  return { updateMaterials: (theme) => blocks.forEach(block => block.material = materials[theme][Math.floor(Math.random() * 3)]) };
}