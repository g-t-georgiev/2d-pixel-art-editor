# PixelEditor

## Folder Structure

The application is divided into the following directories and corresponding components:

```
root/
├── .vscode/
│   ├── extensions.json
│   └─ settings.json
│
├── node_modules/
│   └─ ...
│
├── src/
│   ├── modules/
│   │   ├── algorithms/
│   │   │   └── FloodFill.ts
│   │   │
│   │   ├── brushes/
│   │   │   └── Brush.ts
│   │   │
│   │   ├── export/
│   │   │   ├── ExportsManager.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── history/
│   │   │   ├── commands/
│   │   │   │   ├── ClearCommand.ts
│   │   │   │   ├── Command.ts
│   │   │   │   ├── DrawCommand.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── ResizeCommand.ts
│   │   │   │   └── ....
│   │   │   │
│   │   │   ├── HistoryManager.ts
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── render/
│   │   │   ├── renderers/
│   │   │   │   ├── BackgroundRenderer.ts
│   │   │   │   ├── CursorOverlayRenderer.ts
│   │   │   │   ├── DocumentRenderer.ts
│   │   │   │   ├── GridOverlayRenderer.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── RulerOverlayRenderer.ts
│   │   │   │
│   │   │   ├── CanvasRenderer.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── store/
│   │   │   ├── actions/
│   │   │   │   ├── index.ts
│   │   │   │   └── ....
│   │   │   │
│   │   │   ├── schemas/
│   │   │   │   ├── index.ts
│   │   │   │   └── ....
│   │   │   │
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── tools/
│   │   │   ├── BucketTool.ts
│   │   │   ├── EraserTool.ts
│   │   │   ├── EyeDropperTool.ts
│   │   │   ├── index.ts
│   │   │   ├── PenTool.ts
│   │   │   ├── Tool.ts
│   │   │   ├── ToolManager.ts
│   │   │   ├── toolsExport.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── ui/
│   │   │   ├── components/
│   │   │   │   ├── layers/
│   │   │   │   │   ├─ index.ts
│   │   │   │   │   ├─ layer-item.ts
│   │   │   │   │   ├─ layers-manager.ts
│   │   │   │   │   └── types.ts
│   │   │   │   │
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── controllers/
│   │   │   │   ├── index.ts
│   │   │   │   └── LayersController.ts
│   │   │   │
│   │   │   ├── core/
│   │   │   │   ├── component-utils.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── WebComponentBase.ts
│   │   │   │
│   │   │   ├── managers/
│   │   │   │   ├── index.ts
│   │   │   │   └── UIManager.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── ColorUtils.ts
│   │   │   ├── EventEmitter.ts
│   │   │   ├── index.ts
│   │   │   └── MathUtils.ts
│   │   │
│   │   ├── Application.ts
│   │   ├── Camera.ts
│   │   ├── index.ts
│   │   ├── InputController.ts
│   │   ├── PixelDocument.ts
│   │   ├── PixelDocumentLayer.ts
│   │   └── types.js
│   │
│   └── styles/
│       └── styles.css
│
├── .editorconfig
├── .gitattributes
├── .gitignore
├── index.html
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.ts
```