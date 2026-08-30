import type { Template, WebComponent } from "@modules/types";

const getHTMLString: Template<{ isExpanded: boolean; }> = ({ isExpanded }) => `
  <style>
    :host {
      --x-offset: 44px;
      --y-offset: 94px;

      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
      /* Initial position */
      transform: translate3d(var(--x-offset), var(--y-offset), 0);
      will-change: transform;
      /* Prevent scroll while dragging */
      touch-action: none;
      font-family: sans-serif;
    }

    .panel {
      width: 260px;
      background-color: #2d2d2d;
      border: 1px solid #3f3f3f;
      border-radius: 6px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .header {
      display: flex;
      align-items: center;
      background-color: #333333;
      border-bottom: 1px solid #3f3f3f;
      padding: 8px 12px;
      user-select: none;
    }

    .drag-handle {
      background: none;
      border: none;
      color: #888;
      cursor: grab;
      padding: 4px;
      margin-right: 8px;
      border-radius: 4px;
      font-size: 14px;
      line-height: 1;
    }

    .drag-handle:focus-visible {
      outline: 2px solid #007acc;
      color: #e0e0e0;
    }

    .drag-handle:active {
      cursor: grabbing;
    }

    .drag-handle:hover {
      background-color: #555;
      color: #fff;
    }

    .title {
      color: #e0e0e0;
      font-weight: 600;
      font-size: 14px;
      flex-grow: 1;
    }

    .toggle-btn {
      background: none;
      border: none;
      color: #e0e0e0;
      cursor: pointer;
      font-size: 16px;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .toggle-btn:hover, .toggle-btn:focus-visible {
      background-color: #444;
      outline: none;
    }

    .toggle-btn:focus-visible {
      outline: 2px solid #007acc;
    }

    .collapsible-content {
      height: var(--max-height, 0);
      overflow: hidden;
      transition: height 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .content-inner {
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
  </style>

  <div class="panel" role="region" aria-label="Layer Manager">
    <div class="header">
      <button class="drag-handle" aria-label="Move panel" title="Drag or use arrow keys">⋮⋮</button>
      <span class="title">Layers</span>
      <button class="toggle-btn" aria-expanded="true" aria-controls="layer-content" aria-label="Toggle Layers">${isExpanded ? "[\u2013]" :"[\u002b]"}</button>
    </div>

    <div class="collapsible-content" id="layer-content">
      <div class="content-inner">
        <slot></slot>
      </div>
    </div>
  </div>
`;

export default class LayerManager extends HTMLElement implements WebComponent {
  private _isExpanded: boolean = true;
  private _isDragging: boolean = false;

  private _xOffset: number;
  private _yOffset: number;
  private _currentX: number;
  private _currentY: number;
  private _initialX: number;
  private _initialY: number;

  // private _panel: HTMLElement;
  // private _header: HTMLElement;
  private _dragHandle: HTMLElement;
  private _toggleBtn: HTMLElement;
  private _panelContent: HTMLElement;
  private _panelContentInner: HTMLElement;

  private resizeObserver!: ResizeObserver;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });

    this._isExpanded = true;
    this._isDragging = false;

    // Position tracking
    this._xOffset = 44; // Default starting X
    this._yOffset = 94; // Default starting Y
    this._currentX = 0;
    this._currentY = 0;
    this._initialX = 0;
    this._initialY = 0;

    shadowRoot.innerHTML = getHTMLString({ isExpanded: this._isExpanded });

    // this._panel = shadowRoot.querySelector(".panel")!;
    // this._header = shadowRoot.querySelector(".header")!;
    this._dragHandle = shadowRoot.querySelector(".drag-handle")!;
    this._toggleBtn = shadowRoot.querySelector(".toggle-btn")!;
    this._panelContent = shadowRoot.querySelector(".collapsible-content")!;
    this._panelContentInner = shadowRoot.querySelector(".content-inner")!;

    // Dragging
    this.dragStart = this.dragStart.bind(this);
    this.drag = this.drag.bind(this);
    this.dragEnd = this.dragEnd.bind(this);

    // Keyboard Dragging Accessibility
    this.handleKeyboardDrag = this.handleKeyboardDrag.bind(this);

    // Panel Toggle
    this.togglePanel = this.togglePanel.bind(this);

    // Stop propagation
    this._stopPropagation = this._stopPropagation.bind(this);
  }

  public connectedCallback() {
    // Dragging Event
    this._dragHandle.addEventListener("pointerdown", this.dragStart);
    // Keyboard Dragging Accessibility
    this._dragHandle.addEventListener("keydown", this.handleKeyboardDrag);
    // Panel Toggle Event
    this._toggleBtn.addEventListener("click", this.togglePanel);


    // Stop propagation
    this.addEventListener("pointerdown", this._stopPropagation);
    this.addEventListener("pointermove", this._stopPropagation);
    this.addEventListener("pointerup", this._stopPropagation);
    this.addEventListener("pointercancel", this._stopPropagation);
    this.addEventListener("click", this._stopPropagation);
    this.addEventListener("dblclick", this._stopPropagation);
    this.addEventListener("wheel", this._stopPropagation); // Stops canvas zooming when scrolling layer list
    this.addEventListener("contextmenu", this._stopPropagation); // Stops custom canvas right-click menus

    // Resize Observer
    this.resizeObserver = new ResizeObserver(() => {
      if (this._isExpanded && this._panelContent.style.height !== "auto") {
        this._panelContent.style.setProperty("--max-height", `${this._panelContent.scrollHeight}px`);
        this._panelContent.style.height = "var(--max-height)";
      }
    });
    this.resizeObserver.observe(this._panelContentInner);
  }

  public disconnectedCallback() {
    // Resize Observer
    this.resizeObserver.disconnect();

    // Dragging Events
    this._dragHandle.removeEventListener("pointerdown", this.dragStart);
    this._dragHandle.removeEventListener("pointermove", this.drag);
    this._dragHandle.removeEventListener("pointerup", this.dragEnd);
    this._dragHandle.removeEventListener("pointercancel", this.dragEnd);

    // Keyboard Dragging Accessibility
    this._dragHandle.removeEventListener("keydown", this.handleKeyboardDrag);

    // Panel Toggle Event
    this._toggleBtn.removeEventListener("click", this.togglePanel);

    // Stop propagation
    this.removeEventListener("pointerdown", this._stopPropagation);
    this.removeEventListener("pointermove", this._stopPropagation);
    this.removeEventListener("pointerup", this._stopPropagation);
    this.removeEventListener("pointercancel", this._stopPropagation);
    this.removeEventListener("click", this._stopPropagation);
    this.removeEventListener("dblclick", this._stopPropagation);
    this.removeEventListener("wheel", this._stopPropagation); // Stops canvas zooming when scrolling layer list
    this.removeEventListener("contextmenu", this._stopPropagation); // Stops custom canvas right-click menus
  }

  /* Dragging Logic */
  private dragStart(ev: PointerEvent) {
    this._isDragging = true;

    this._dragHandle.setPointerCapture(ev.pointerId);

    this._initialX = ev.clientX - this._xOffset;
    this._initialY = ev.clientY - this._yOffset;

    this._dragHandle.addEventListener("pointermove", this.drag);
    this._dragHandle.addEventListener("pointerup", this.dragEnd);
    this._dragHandle.addEventListener("pointercancel", this.dragEnd);
  }

  private drag(ev: PointerEvent) {
    if (!this._isDragging) return;

    ev.preventDefault();

    this._currentX = ev.clientX - this._initialX;
    this._currentY = ev.clientY - this._initialY;

    this._xOffset = this._currentX;
    this._yOffset = this._currentY;

    this.updateTransform();
  }

  private dragEnd(ev: PointerEvent) {
    this._isDragging = false;

    this._dragHandle.releasePointerCapture(ev.pointerId);

    this._initialX = this._currentX;
    this._initialY = this._currentY;

    this.checkBounds(); // Ensure it hasn't been dropped off-screen

    this._dragHandle.removeEventListener("pointermove", this.drag);
    this._dragHandle.removeEventListener("pointerup", this.dragEnd);
    this._dragHandle.removeEventListener("pointercancel", this.dragEnd);
  }

  private handleKeyboardDrag(ev: KeyboardEvent) {
    const step = ev.shiftKey ? 20 : 5; // Hold shift to move faster
    let moved = false;

    switch (ev.key) {
      case "ArrowUp": {
        this._yOffset -= step;
        moved = true;

        break;
      }
      case "ArrowDown": {
        this._yOffset += step;
        moved = true;

        break;
      }
      case "ArrowLeft": {
        this._xOffset -= step;
        moved = true;
        break;
      }
      case "ArrowRight": {
        this._xOffset += step;
        moved = true;
        break;
      }
    }

    if (!moved) return;

    ev.preventDefault();

    this.updateTransform();
    this.checkBounds();
  }

  private updateTransform() {
    this.style.setProperty("--x-offset", this._xOffset + "px");
    this.style.setProperty("--y-offset", this._yOffset + "px");
  }

  /* Boundary Awareness */
  private checkBounds() {
    const rect = this.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Add a 10px buffer from the edges
    const padding = 10;

    let adjusted = false;

    // Check Bottom
    if (rect.bottom > viewportHeight - padding) {
      this._yOffset -= (rect.bottom - (viewportHeight - padding));
      adjusted = true;
    }
    // Check Top
    if (rect.top < padding) {
      this._yOffset += (padding - rect.top);
      adjusted = true;
    }
    // Check Right
    if (rect.right > viewportWidth - padding) {
      this._xOffset -= (rect.right - (viewportWidth - padding));
      adjusted = true;
    }
    // Check Left
    if (rect.left < padding) {
      this._xOffset += (padding - rect.left);
      adjusted = true;
    }

    if (adjusted) {
      this.style.transition = "transform 0.2s ease-out";
      this.updateTransform();

      // Remove transition after adjustment so dragging stays instantaneous
      setTimeout(() => {
        this.style.transition = "";
      }, 200);
    }
  }

  /* Collapse Logic (Adapted) */
  private togglePanel() {
    this._isExpanded = !this._isExpanded;
    this._toggleBtn.toggleAttribute("aria-expanded", this._isExpanded);
    this._toggleBtn.textContent = this._isExpanded ? "[\u2013]" : "[\u002b]";

    const onTransitionEnd = () => {
      if (this._isExpanded) this._panelContent.style.setProperty("height", "auto");
      this._panelContent.style.removeProperty("will-change");
      this._panelContent.removeEventListener("transitionend", onTransitionEnd);

      if (this._isExpanded) this.checkBounds(); // Recalibrate if expansion pushes it off-screen
    };

    if (this._isExpanded) {
      // Opening
      const scrollHeight = this._panelContent.scrollHeight;
      this._panelContent.style.removeProperty("height");
      this._panelContent.style.setProperty("--max-height", `${scrollHeight}px`);
      this._panelContent.style.setProperty("will-change", "height");

      // Small timeout ensures the browser registers the removal of 'height: 0px' before setting the variable
      requestAnimationFrame(() => {
        this._panelContent.style.setProperty("height", `${scrollHeight}px`);
      });

      this._panelContent.addEventListener("transitionend", onTransitionEnd);
    } else {
      // Closing
      this._panelContent.style.setProperty("height", `${this._panelContent.scrollHeight}px`);
      this._panelContent.offsetHeight; // Force Reflow

      this._panelContent.style.setProperty("will-change", "height");
      this._panelContent.style.setProperty("height", "0px");

      this._panelContent.addEventListener("transitionend", onTransitionEnd);
    }
  }

  /** Stop propagation */
  private _stopPropagation<T extends Event>(ev: T) {
    ev.stopPropagation();
  }
}

customElements.define("layer-manager", LayerManager);