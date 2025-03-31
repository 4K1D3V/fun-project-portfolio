/**
 * Notification component for user feedback
 * @param {string} message - Message to display
 */
export function showNotification(message) {
  const notification = document.getElementById("notification");
  if (!notification) return;
  
  notification.textContent = message;
  notification.classList.add("active");
  setTimeout(() => notification.classList.remove("active"), 3000);
}