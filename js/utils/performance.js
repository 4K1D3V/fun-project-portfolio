/**
 * Detects device performance for optimization
 * @returns {number} Number of 3D blocks to render
 */
export function detectPerformance() {
  const isLowEnd = window.innerWidth < 768 ||
    navigator.hardwareConcurrency < 4 ||
    !window.WebGLRenderingContext ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.body.dataset.performance = isLowEnd ? "low" : "high";
  return isLowEnd ? 20 : 60;
}