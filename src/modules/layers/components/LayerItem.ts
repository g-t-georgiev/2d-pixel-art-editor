import type { Template, WebComponent } from "@modules/types";

const getHTMLString: Template<{
  name: string;
  isActive: boolean;
  isHidden: boolean;
}> = ({ name, isActive, isHidden }) => `
  <style>
    .layer {
      display: flex;
      align-items: center;
      padding: 6px 8px;
      background-color: ${isActive ? '#3f3f3f' : 'transparent'};
      border-radius: 4px;
      color: #e0e0e0;
      cursor: pointer;
      user-select: none;
    }

    .layer:hover {
      background-color: #3a3a3a;
    }

    .thumbnail {
      width: 24px;
      height: 24px;
      background-image:
        linear-gradient(45deg, #444 25%, transparent 25%),
        linear-gradient(-45deg, #444 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #444 75%),
        linear-gradient(-45deg, transparent 75%, #444 75%);

      background-size: 8px 8px;
      background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
      border: 1px solid #222;
      border-radius: 2px;
      margin-right: 10px;
    }

    .title {
      flex-grow: 1;
      font-size: 13px;
    }

    .actions {
      display: flex;
      gap: 4px;
    }

    button {
      background: none;
      border: none;
      color: #a0a0a0;
      cursor: pointer;
      font-size: 14px;
      padding: 2px 4px;
      border-radius: 3px;
    }

    button:hover {
      background-color: #555;
      color: #fff;
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
  </style>

  <div class="layer">
    <button class="drag-handle" aria-label="Move panel" title="Drag or use arrow keys">⋮⋮</button>
    <div class="thumbnail"></div>
    <span class="title">${name}</span>
    <div class="actions">
      <button title="Toggle Visibility">${isHidden ? '[-]' : '[O]'}</button>
      <button title="Options">[⋮]</button>
    </div>
  </div>
`;

export default class LayerItem extends HTMLElement implements WebComponent {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });

    // Retrieve attributes
    const name = this.getAttribute("name") || "Layer";
    const isActive = this.hasAttribute("active");
    const isHidden = this.hasAttribute("hidden");

    shadowRoot.innerHTML = getHTMLString({ name, isActive, isHidden });
  }
}

customElements.define("layer-item", LayerItem);