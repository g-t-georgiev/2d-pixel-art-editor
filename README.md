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
│   │   ├── editor/
│   │   │   ├── controllers/
│   │   │   │   └── InputController.ts
│   │   │   │
│   │   │   ├── core/
│   │   │   │   ├── PixelDocument.ts
│   │   │   │   └── PixelDocumentLayer.ts
│   │   │   │
│   │   │   ├── managers/
│   │   │   │   ├── ExportsManager.ts
│   │   │   │   ├── HistoryManager.ts
│   │   │   │   └── UIManager.js
│   │   │   │
│   │   │   ├── renderers/
│   │   │   │   ├── BackgroundRenderer.ts
│   │   │   │   ├── DocumentRenderer.ts
│   │   │   │   ├── GridOverlayRenderer.ts
│   │   │   │   ├── RulerOverlayRenderer.ts
│   │   │   │   ├── CursorOverlayRenderer.ts
│   │   │   │   └── CanvasRenderer.ts
│   │   │   │
│   │   │   ├── Application.ts
│   │   │   └── Camera.ts
│   │   │
│   │   ├── history/
│   │   │   ├── commands/
│   │   │   │   ├── Command.ts
│   │   │   │   ├── DrawCommand.ts
│   │   │   │   └── ....
│   │   │   │
│   │   │   └── HistoryManager.ts
│   │   │
│   │   ├── tools/
│   │   │   ├── BucketTool.ts
│   │   │   ├── EraserTool.ts
│   │   │   ├── EyedropperTool.ts
│   │   │   ├── index.ts
│   │   │   ├── PenTool.ts
│   │   │   ├── Tool.ts
│   │   │   └── ToolManager.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── ColorUtils.ts
│   │   │   ├── EventEmitter.ts
│   │   │   └── MathUtils.ts
│   │   │
│   │   ├── index.ts
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
└── tsconfig.json
```