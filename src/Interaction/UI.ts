import { createEl } from '../Utils/DomUtils';
import { Engine } from 'babylonjs';

export function initUI(engine: Engine) {
  const fsBtn = createEl("fullscreen-btn");
  fsBtn.style.left = `${25}px`;
  fsBtn.style.top = `${25}px`;
  fsBtn.style.backgroundImage = "url('icons/baseline-fullscreen-24px.svg')";
  fsBtn.style.backgroundRepeat = "no-repeat";
  fsBtn.style.backgroundPosition = "center";
  fsBtn.style.backgroundSize = "cover";
  fsBtn.style.opacity = ".5";
  fsBtn.addEventListener("pointerdown", function() {
    if (!document.fullscreen) {
      document.body.requestFullscreen();
      fsBtn.style.backgroundImage = "url('icons/baseline-fullscreen_exit-24px.svg')";
    } else {
      document.exitFullscreen();
      fsBtn.style.backgroundImage = "url('icons/baseline-fullscreen-24px.svg')";
    }
  }, false);
}