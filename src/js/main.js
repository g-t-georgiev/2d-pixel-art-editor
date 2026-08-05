import PixelEditor from "./editor/PixelEditor.js";

window.addEventListener("DOMContentLoaded", () => {
  const canvasElement = document.getElementById("paintCanvas");
  window.pixelEditor = new PixelEditor(canvasElement);
});