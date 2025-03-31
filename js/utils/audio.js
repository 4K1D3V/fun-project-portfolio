/**
 * Audio utility for managing sound effects
 */
export class AudioManager {
  constructor() {
    this.sounds = new Map();
  }
  
  loadSound(id, src) {
    const audio = new Audio(src);
    audio.preload = "auto";
    this.sounds.set(id, audio);
    document.body.appendChild(audio);
  }
  
  play(id) {
    const sound = this.sounds.get(id);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => console.warn(`Audio blocked: ${id}`));
    }
  }
}