/**
 * Preloader component to handle initial page load animation
 */
export function initPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;
  
  const hidePreloader = () => {
    preloader.classList.add("hidden");
    setTimeout(() => preloader.remove(), 500);
  };
  
  window.addEventListener("load", hidePreloader, { once: true });
}