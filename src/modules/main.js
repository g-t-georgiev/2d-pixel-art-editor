import Application from "./editor/Application.js";

window.addEventListener("DOMContentLoaded", () => {
  const canvasElement = document.getElementById("paintCanvas");
  const application = new Application(canvasElement);

  // Development only
  window.__pixelEditor__ = application;
});