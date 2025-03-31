/**
 * DOM utility functions
 */
export function triggerParticleStorm(color = null, count = window.innerWidth < 768 ? 20 : 50) {
  const storm = document.getElementById("particle-storm");
  if (!storm || document.body.dataset.performance === "low") return;
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${Math.random() * 100}vh`;
    particle.style.background = color || ["#00d1b2", "#ff00ff", "#4CAF50"][Math.floor(Math.random() * 3)];
    storm.appendChild(particle);
    setTimeout(() => particle.remove(), 1000);
  }
}

export function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}