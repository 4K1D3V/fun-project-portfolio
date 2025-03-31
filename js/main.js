import { initPreloader } from "./components/preloader.js";
import { showNotification } from "./components/notification.js";
import { initGalaxy } from "./components/threejs-galaxy.js";
import { detectPerformance } from "./utils/performance.js";
import { AudioManager } from "./utils/audio.js";
import { triggerParticleStorm, debounce } from "./utils/dom.js";
import { translations } from "./data/translations.js";
import { artifacts } from "./data/artifacts.js";
import { nexus } from "./data/nexus.js";
import { crucible } from "./data/crucible.js";
import { forge } from "./data/forge.js";
import { echoes } from "./data/echoes.js";
import { archives } from "./data/archives.js";

// Initialize core components
initPreloader();
const galaxy = initGalaxy();
const audioManager = new AudioManager();

// Load audio assets
const audioFiles = {
  "portal-scream": "https://www.myinstants.com/media/sounds/minecraft-ghast-scream.mp3",
  "shatter-sound": "https://www.myinstants.com/media/sounds/explosion.mp3",
  "warp-sound": "https://www.myinstants.com/media/sounds/minecraft-portal.mp3",
  "transmit-scream": "https://www.myinstants.com/media/sounds/sci-fi-weapon.mp3",
  "minecraft-activate": "https://www.myinstants.com/media/sounds/minecraft-level-up.mp3",
  "server-activate": "https://www.myinstants.com/media/sounds/minecraft-anvil.mp3",
  "marketing-activate": "https://www.myinstants.com/media/sounds/minecraft-explosion.mp3",
  "translation-activate": "https://www.myinstants.com/media/sounds/minecraft-ender-pearl.mp3",
  "chaos-glitch": "https://www.myinstants.com/media/sounds/minecraft-wither-spawn.mp3",
  "shard-whisper": "https://www.myinstants.com/media/sounds/minecraft-ender-dragon-growl.mp3",
  "crucible-bubble": "https://www.myinstants.com/media/sounds/minecraft-lava-bubble.mp3",
  "cube-hit": "https://www.myinstants.com/media/sounds/minecraft-damage.mp3",
  "forge-clank": "https://www.myinstants.com/media/sounds/minecraft-anvil-land.mp3",
  "echo-whisper": "https://www.myinstants.com/media/sounds/minecraft-ghast-moan.mp3",
  "archive-rift": "https://www.myinstants.com/media/sounds/minecraft-enderman-teleport.mp3"
};
Object.entries(audioFiles).forEach(([id, src]) => audioManager.loadSound(id, src));

// DOM elements
const elements = {
  introTitle: document.getElementById("intro-title"),
  introDesc: document.getElementById("intro-desc"),
  portalGrid: document.getElementById("portal-grid"),
  artifactGrid: document.getElementById("artifact-grid"),
  nexusGrid: document.getElementById("nexus-grid"),
  crucibleGrid: document.getElementById("crucible-grid"),
  forgeGrid: document.getElementById("forge-grid"),
  echoesGrid: document.getElementById("echoes-grid"),
  archivesTimeline: document.getElementById("archives-timeline"),
  transmitTitle: document.getElementById("transmit-title"),
  transmitForm: document.getElementById("transmit-form"),
  artifactModal: document.getElementById("artifact-modal"),
  artifactBody: document.getElementById("artifact-body"),
  nexusModal: document.getElementById("nexus-modal"),
  nexusBody: document.getElementById("nexus-body"),
  forgeModal: document.getElementById("forge-modal"),
  forgeBody: document.getElementById("forge-body"),
  portalAbyss: document.querySelector(".portal-abyss"),
  riftNav: document.querySelector(".rift-nav"),
  themeSwitcher: document.querySelector(".theme-switcher"),
  cosmicClock: document.getElementById("cosmic-clock")
};

// State
let currentLang = "en";
let introIndex = 0;
let chaosModeActive = false;
let crucibleScore = 0;

// Render functions
function renderPortals(lang) {
  const portals = ["minecraft", "server", "marketing", "translation"];
  elements.portalGrid.innerHTML = portals.map(portal => `
        <div class="portal-scream" data-portal="${portal}" role="button" tabindex="0" aria-label="${translations[lang][portal].title}">
            <h3>${translations[lang][portal].title}</h3>
            <p>${translations[lang][portal].desc}</p>
            <div class="portal-distort"></div>
        </div>
    `).join("");
}

function renderArtifacts() {
  elements.artifactGrid.innerHTML = Object.entries(artifacts).map(([id, { title, desc, holoText }]) => `
        <div class="artifact-shatter" data-id="${id}" role="button" tabindex="0" aria-label="${title}">
            <h3>${title}</h3>
            <p>${desc}</p>
            <div class="hologram" id="holo-${id}">${holoText}</div>
        </div>
    `).join("");
}

function renderNexus() {
  elements.nexusGrid.innerHTML = Object.entries(nexus).map(([id, { title, desc, shardText }]) => `
        <div class="nexus-shard" data-id="${id}" role="button" tabindex="0" aria-label="${title}">
            <h3>${title}</h3>
            <p>${desc}</p>
            <div class="hologram" id="shard-${id}">${shardText}</div>
        </div>
    `).join("");
}

function renderCrucible() {
  elements.crucibleGrid.innerHTML = Object.entries(crucible).map(([id, { title, desc, action }]) => `
        <div class="crucible-experiment" data-id="${id}" role="button" tabindex="0" aria-label="${title}">
            <h3>${title}</h3>
            <p>${desc}</p>
            <div class="hologram" id="exp-${id}">${action}</div>
        </div>
    `).join("");
}

function renderForge() {
  elements.forgeGrid.innerHTML = Object.entries(forge).map(([id, { title, desc, holoText }]) => `
        <div class="forge-fragment" data-id="${id}" role="button" tabindex="0" aria-label="${title}">
            <h3>${title}</h3>
            <p>${desc}</p>
            <div class="hologram" id="forge-${id}">${holoText}</div>
        </div>
    `).join("");
}

function renderEchoes() {
  elements.echoesGrid.innerHTML = Object.entries(echoes).map(([id, { title, desc, holoText }]) => `
        <div class="echoes-orb" data-id="${id}" role="button" tabindex="0" aria-label="${title}">
            <h3>${title}</h3>
            <p>${desc}</p>
            <div class="hologram" id="echo-${id}">${holoText}</div>
        </div>
    `).join("");
}

function renderArchives() {
  elements.archivesTimeline.innerHTML = Object.entries(archives).map(([id, { title, desc, date }]) => `
        <div class="archives-event" data-id="${id}" role="button" tabindex="0" aria-label="${title}">
            <h3>${title}</h3>
            <p>${desc} - ${date}</p>
        </div>
    `).join("");
}

// Language warp
function warpLanguage(lang) {
  try {
    currentLang = lang;
    document.querySelectorAll(".rift-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.lang === lang));
    elements.introTitle.textContent = translations[lang].introTitle;
    cycleIntroText();
    elements.portalGrid.previousElementSibling.textContent = translations[lang].portals;
    renderPortals(lang);
    elements.artifactGrid.previousElementSibling.textContent = translations[lang].artifacts;
    elements.nexusGrid.previousElementSibling.textContent = translations[lang].nexus;
    elements.crucibleGrid.previousElementSibling.textContent = translations[lang].crucible;
    elements.forgeGrid.previousElementSibling.textContent = translations[lang].forge;
    elements.echoesGrid.previousElementSibling.textContent = translations[lang].echoes;
    elements.archivesTimeline.previousElementSibling.textContent = translations[lang].archives;
    elements.transmitTitle.textContent = translations[lang].transmit;
    document.body.classList.add("warp");
    audioManager.play("warp-sound");
    triggerParticleStorm();
    showNotification(`Warped to ${lang.toUpperCase()} Realm`);
    setTimeout(() => document.body.classList.remove("warp"), 800);
  } catch (err) {
    console.error("Language warp failed:", err);
    showNotification("Warp Error!");
  }
}

// Theme switcher with Chaos Mode
function switchTheme(theme) {
  try {
    document.body.dataset.theme = theme;
    triggerParticleStorm();
    audioManager.play(theme === "chaos-mode" ? "chaos-glitch" : "warp-sound");
    if (galaxy) galaxy.updateMaterials(theme);
    showNotification(`Theme shifted to ${theme === "chaos-mode" ? "CHAOS MODE" : theme.replace("-", " ")}`);
    chaosModeActive = theme === "chaos-mode";
    if (chaosModeActive) {
      setInterval(() => {
        document.documentElement.style.setProperty("--primary", `hsl(${Math.random() * 360}, 100%, 50%)`);
        document.documentElement.style.setProperty("--secondary", `hsl(${Math.random() * 360}, 100%, 50%)`);
        document.documentElement.style.setProperty("--shadow", `hsl(${Math.random() * 360}, 100%, 50%)`);
      }, 500);
    }
  } catch (err) {
    console.error("Theme switch failed:", err);
  }
}

// Cycle intro text with glitch
function cycleIntroText() {
  const descs = translations[currentLang].introDesc;
  elements.introDesc.textContent = descs[introIndex];
  if (chaosModeActive && Math.random() < 0.3) {
    elements.introDesc.textContent = descs[introIndex].split("").map(char => Math.random() < 0.1 ? String.fromCharCode(Math.floor(Math.random() * 94) + 33) : char).join("");
  }
  introIndex = (introIndex + 1) % descs.length;
}
setInterval(cycleIntroText, 3000);

// Handlers
function activatePortal(portal) {
  const soundMap = {
    minecraft: "minecraft-activate",
    server: "server-activate",
    marketing: "marketing-activate",
    translation: "translation-activate"
  };
  const messageMap = {
    minecraft: "Minecraft Forge Activated!",
    server: "Server Abyss Online!",
    marketing: "Marketing Storm Unleashed!",
    translation: "Language Warp Engaged!"
  };
  try {
    audioManager.play(soundMap[portal]);
    triggerParticleStorm({ minecraft: "#00d1b2", server: "#ff00ff", marketing: "#4CAF50", translation: "#ff4500" } [portal]);
    showNotification(messageMap[portal]);
  } catch (err) {
    console.error("Portal activation failed:", err);
  }
}

function shatterArtifact(id) {
  const artifact = artifacts[id];
  if (!artifact) return;
  try {
    elements.artifactBody.innerHTML = `
            <h3>${artifact.title}</h3>
            <img src="${artifact.image}" alt="${artifact.title}" loading="lazy">
            <p>${artifact.desc}</p>
        `;
    elements.artifactModal.style.display = "block";
    elements.artifactModal.setAttribute("aria-hidden", "false");
    audioManager.play("shatter-sound");
    triggerParticleStorm("#ffffff", 50);
    showNotification(`${artifact.title} Shattered into the Void!`);
    if (chaosModeActive) {
      const p = elements.artifactBody.querySelector("p");
      setInterval(() => {
        p.style.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
      }, 200);
    }
  } catch (err) {
    console.error("Artifact shatter failed:", err);
  }
}

function shatterNexus(id) {
  const shard = nexus[id];
  if (!shard) return;
  try {
    elements.nexusBody.innerHTML = `
            <h3>${shard.title}</h3>
            <p>${shard.content}</p>
        `;
    elements.nexusModal.style.display = "block";
    elements.nexusModal.setAttribute("aria-hidden", "false");
    audioManager.play("shard-whisper");
    triggerParticleStorm("#00ff00", 30);
    showNotification(`${shard.title} Shard Exploded!`);
    if (chaosModeActive) {
      const p = elements.nexusBody.querySelector("p");
      setInterval(() => {
        p.style.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
      }, 200);
    }
  } catch (err) {
    console.error("Nexus shatter failed:", err);
  }
}

function unleashCrucible(id) {
  const experiment = crucible[id];
  if (!experiment) return;
  try {
    if (id === "glitchCube") {
      launchGlitchCubeGame();
    } else {
      elements.nexusBody.innerHTML = `
                <h3>${experiment.title}</h3>
                <p>${experiment.desc} (Coming Soon)</p>
            `;
      elements.nexusModal.style.display = "block";
      elements.nexusModal.setAttribute("aria-hidden", "false");
      audioManager.play("crucible-bubble");
      triggerParticleStorm("#ff4500", 40);
      showNotification(`${experiment.title} Unleashed!`);
    }
  } catch (err) {
    console.error("Crucible unleash failed:", err);
  }
}

function forgeFragment(id) {
  const fragment = forge[id];
  if (!fragment) return;
  try {
    elements.forgeBody.innerHTML = `
            <h3>${fragment.title}</h3>
            <p>${fragment.desc}</p>
            <a href="${fragment.link}" download class="transmit-pulse">Download Fragment</a>
        `;
    elements.forgeModal.style.display = "block";
    elements.forgeModal.setAttribute("aria-hidden", "false");
    audioManager.play("forge-clank");
    triggerParticleStorm("#00d1b2", 30);
    showNotification(`${fragment.title} Forged!`);
  } catch (err) {
    console.error("Forge fragment failed:", err);
  }
}

function echoVoid(id) {
  const echo = echoes[id];
  if (!echo) return;
  try {
    audioManager.play("echo-whisper");
    triggerParticleStorm("#4CAF50", 20);
    showNotification(`${echo.title} Echoes from the Void!`);
  } catch (err) {
    console.error("Echo void failed:", err);
  }
}

function riftArchive(id) {
  const event = archives[id];
  if (!event) return;
  try {
    audioManager.play("archive-rift");
    triggerParticleStorm("#ff00ff", 25);
    showNotification(`${event.title} Rift Opened!`);
  } catch (err) {
    console.error("Rift archive failed:", err);
  }
}

// Glitch Cube Dodge Mini-Game (Completed)
function launchGlitchCubeGame() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  const container = document.createElement("div");
  container.id = "crucible-game";
  container.style.position = "fixed";
  container.style.inset = "0";
  container.style.zIndex = "25";
  document.body.appendChild(container);
  container.appendChild(renderer.domElement);
  
  const player = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
  );
  player.position.set(0, 0, 0);
  scene.add(player);
  
  const cubes = [];
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: chaosModeActive ? Math.random() * 0xffffff : 0xff4500, wireframe: true });
  
  for (let i = 0; i < 15; i++) {
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      -Math.random() * 20 - 10
    );
    cube.userData = { speedZ: 0.1 + Math.random() * 0.2 };
    scene.add(cube);
    cubes.push(cube);
  }
  
  camera.position.z = 10;
  crucibleScore = 0;
  
  const scoreDisplay = document.createElement("div");
  scoreDisplay.style.position = "absolute";
  scoreDisplay.style.top = "10px";
  scoreDisplay.style.left = "50%";
  scoreDisplay.style.transform = "translateX(-50%)";
  scoreDisplay.style.color = "var(--primary)";
  scoreDisplay.style.fontFamily = "'Orbitron', sans-serif";
  scoreDisplay.style.fontSize = "2rem";
  scoreDisplay.style.textShadow = "0 0 15px var(--secondary)";
  scoreDisplay.textContent = `Score: ${crucibleScore}`;
  container.appendChild(scoreDisplay);
  
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const keys = {};
  
  function onKeyDown(event) { keys[event.key] = true; }
  
  function onKeyUp(event) { keys[event.key] = false; }
  
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  
  function onClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cubes);
    if (intersects.length > 0) {
      const cube = intersects[0].object;
      scene.remove(cube);
      cubes.splice(cubes.indexOf(cube), 1);
      crucibleScore += 10;
      scoreDisplay.textContent = `Score: ${crucibleScore}`;
      audioManager.play("cube-hit");
      triggerParticleStorm("#ff4500", 20);
    }
  }
  
  container.addEventListener("click", onClick);
  
  let animationFrame;
  
  function animate() {
    const speed = 0.2;
    if (keys["ArrowUp"] || keys["w"]) player.position.y += speed;
    if (keys["ArrowDown"] || keys["s"]) player.position.y -= speed;
    if (keys["ArrowLeft"] || keys["a"]) player.position.x -= speed;
    if (keys["ArrowRight"] || keys["d"]) player.position.x += speed;
    
    player.position.x = Math.max(-10, Math.min(10, player.position.x));
    player.position.y = Math.max(-5, Math.min(5, player.position.y));
    
    cubes.forEach(cube => {
      cube.position.z += cube.userData.speedZ;
      cube.rotation.x += 0.05;
      cube.rotation.y += 0.05;
      if (cube.position.z > 5) {
        cube.position.z = -20;
        cube.position.x = (Math.random() - 0.5) * 20;
        cube.position.y = (Math.random() - 0.5) * 20;
      }
      
      // Collision detection
      const dx = cube.position.x - player.position.x;
      const dy = cube.position.y - player.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 1.5 && cube.position.z < 1 && cube.position.z > -1) {
        showNotification(`Game Over! Score: ${crucibleScore}`);
        container.remove();
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("keyup", onKeyUp);
        cancelAnimationFrame(animationFrame);
        return;
      }
    });
    
    if (cubes.length === 0) {
      showNotification(`Victory! Score: ${crucibleScore}`);
      container.remove();
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      cancelAnimationFrame(animationFrame);
      return;
    }
    
    renderer.render(scene, camera);
    animationFrame = requestAnimationFrame(animate);
  }
  animate();
  
  const closeButton = document.createElement("span");
  closeButton.textContent = "×";
  closeButton.className = "close";
  closeButton.style.position = "absolute";
  closeButton.style.top = "10px";
  closeButton.style.right = "20px";
  closeButton.style.fontSize = "40px";
  closeButton.style.cursor = "pointer";
  closeButton.addEventListener("click", () => {
    container.remove();
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keyup", onKeyUp);
    cancelAnimationFrame(animationFrame);
    audioManager.play("portal-scream");
  });
  container.appendChild(closeButton);
  
  audioManager.play("crucible-bubble");
  triggerParticleStorm("#ff4500", 40);
  showNotification("Dodge the Glitch Cubes!");
}

// Utility functions
function showHologram(id, prefix = "holo") {
  const holo = document.getElementById(`${prefix}-${id}`);
  if (holo) holo.classList.add("active");
}

function hideHologram() {
  document.querySelectorAll(".hologram").forEach(h => h.classList.remove("active"));
}

function closeArtifact() {
  elements.artifactModal.style.display = "none";
  elements.artifactModal.setAttribute("aria-hidden", "true");
  audioManager.play("portal-scream");
}

function closeNexus() {
  elements.nexusModal.style.display = "none";
  elements.nexusModal.setAttribute("aria-hidden", "true");
  audioManager.play("portal-scream");
}

function closeForge() {
  elements.forgeModal.style.display = "none";
  elements.forgeModal.setAttribute("aria-hidden", "true");
  audioManager.play("portal-scream");
}

// Event listeners
elements.transmitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  try {
    const form = e.target;
    form.classList.add("transmitting");
    audioManager.play("transmit-scream");
    triggerParticleStorm("#ff00ff", 100);
    showNotification("Scream Sucked into the Wormhole!");
    setTimeout(() => {
      alert("Your scream tore through the fuckin' void!");
      form.reset();
      form.classList.remove("transmitting");
      form.style.opacity = "1";
    }, 1500);
  } catch (err) {
    console.error("Form submission failed:", err);
    showNotification("Transmission Error!");
  }
});

elements.riftNav.addEventListener("click", (e) => {
  const btn = e.target.closest(".rift-btn");
  if (btn) warpLanguage(btn.dataset.lang);
});

elements.themeSwitcher.addEventListener("change", (e) => switchTheme(e.target.value));

elements.portalGrid.addEventListener("click", (e) => {
  const portal = e.target.closest(".portal-scream");
  if (portal) activatePortal(portal.dataset.portal);
});

elements.artifactGrid.addEventListener("click", (e) => {
  const artifact = e.target.closest(".artifact-shatter");
  if (artifact) shatterArtifact(artifact.dataset.id);
});

elements.nexusGrid.addEventListener("click", (e) => {
  const shard = e.target.closest(".nexus-shard");
  if (shard) shatterNexus(shard.dataset.id);
});

elements.crucibleGrid.addEventListener("click", (e) => {
  const experiment = e.target.closest(".crucible-experiment");
  if (experiment) unleashCrucible(experiment.dataset.id);
});

elements.forgeGrid.addEventListener("click", (e) => {
  const fragment = e.target.closest(".forge-fragment");
  if (fragment) forgeFragment(fragment.dataset.id);
});

elements.echoesGrid.addEventListener("click", (e) => {
  const orb = e.target.closest(".echoes-orb");
  if (orb) echoVoid(orb.dataset.id);
});

elements.archivesTimeline.addEventListener("click", (e) => {
  const event = e.target.closest(".archives-event");
  if (event) riftArchive(event.dataset.id);
});

elements.artifactGrid.addEventListener("mouseover", (e) => {
  const artifact = e.target.closest(".artifact-shatter");
  if (artifact) showHologram(artifact.dataset.id);
});

elements.nexusGrid.addEventListener("mouseover", (e) => {
  const shard = e.target.closest(".nexus-shard");
  if (shard) showHologram(shard.dataset.id, "shard");
});

elements.crucibleGrid.addEventListener("mouseover", (e) => {
  const experiment = e.target.closest(".crucible-experiment");
  if (experiment) showHologram(experiment.dataset.id, "exp");
});

elements.forgeGrid.addEventListener("mouseover", (e) => {
  const fragment = e.target.closest(".forge-fragment");
  if (fragment) showHologram(fragment.dataset.id, "forge");
});

elements.echoesGrid.addEventListener("mouseover", (e) => {
  const orb = e.target.closest(".echoes-orb");
  if (orb) showHologram(orb.dataset.id, "echo");
});

elements.artifactGrid.addEventListener("mouseout", () => hideHologram());
elements.nexusGrid.addEventListener("mouseout", () => hideHologram());
elements.crucibleGrid.addEventListener("mouseout", () => hideHologram());
elements.forgeGrid.addEventListener("mouseout", () => hideHologram());
elements.echoesGrid.addEventListener("mouseout", () => hideHologram());

elements.artifactModal.querySelector(".close").addEventListener("click", closeArtifact);
elements.nexusModal.querySelector(".close").addEventListener("click", closeNexus);
elements.forgeModal.querySelector(".close").addEventListener("click", closeForge);

elements.portalAbyss.addEventListener("click", () => {
  document.getElementById("portals").scrollIntoView({ behavior: "smooth" });
  audioManager.play("portal-scream");
  triggerParticleStorm();
});

// Keyboard navigation with Chaos Mode Easter egg
let chaosInput = "";
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    const target = e.target.closest(".portal-scream, .artifact-shatter, .nexus-shard, .crucible-experiment, .forge-fragment, .echoes-orb, .archives-event, .close, .portal-abyss");
    if (target) target.click();
  }
  chaosInput += e.key.toUpperCase();
  if (chaosInput.includes("CHAOS")) {
    switchTheme("chaos-mode");
    chaosInput = "";
  }
});

// Cursor effects
const cursor = document.getElementById("void-cursor");
document.addEventListener("mousemove", debounce((e) => {
  if (window.innerWidth < 768) return;
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
  if (Math.random() < 0.2) triggerParticleStorm(chaosModeActive ? `#${Math.floor(Math.random() * 16777215).toString(16)}` : document.body.dataset.theme === "neon-chaos" ? "#ff00ff" : document.body.dataset.theme === "void-glitch" ? "#00ff00" : "#ff4500", 1);
}, 10));

document.addEventListener("click", () => {
  if (window.innerWidth < 768) return;
  cursor.style.transform = "scale(1.5)";
  setTimeout(() => cursor.style.transform = "scale(1)", 100);
  triggerParticleStorm();
});

// Cosmic clock with chaos twist
function updateCosmicClock() {
  const now = new Date("March 30, 2025");
  let timeString = now.toLocaleTimeString();
  if (chaosModeActive && Math.random() < 0.1) {
    timeString = timeString.split("").map(char => Math.random() < 0.2 ? String.fromCharCode(Math.floor(Math.random() * 94) + 33) : char).join("");
  }
  elements.cosmicClock.textContent = `Void Time: ${timeString}`;
}
setInterval(updateCosmicClock, 1000);

// Initial setup
detectPerformance();
renderPortals("en");
renderArtifacts();
renderNexus();
renderCrucible();
renderForge();
renderEchoes();
renderArchives();
warpLanguage("en");
updateCosmicClock();