# PixelEditor

## Folder Structure

The application is divided into the following directories and corresponding components:

```
root/
├── .vscode/
│   ├── extensions.json
│   └─ settings.json
│
├── src/
│   ├── modules/
│   │   ├── algorithms/
│   │   │   └── FloodFill.js
│   │   │
│   │   ├── brushes/
│   │   │   └── Brush.js
│   │   │
│   │   ├── editor/
│   │   │   ├── controllers/
│   │   │   │   └── InputController.js
│   │   │   │
│   │   │   ├── core/
│   │   │   │   ├── PixelDocument.js
│   │   │   │   └── PixelDocumentLayer.js
│   │   │   │
│   │   │   ├── managers/
│   │   │   │   ├── ExportsManager.js
│   │   │   │   ├── HistoryManager.js
│   │   │   │   └── UIManager.js
│   │   │   │
│   │   │   ├── renderers/
│   │   │   │   ├── BackgroundRenderer.js
│   │   │   │   ├── DocumentRenderer.js
│   │   │   │   ├── GridOverlayRenderer.js
│   │   │   │   ├── RulerOverlayRenderer.js
│   │   │   │   ├── CursorOverlayRenderer.js
│   │   │   │   └── CanvasRenderer.js
│   │   │   │
│   │   │   ├── Application.js
│   │   │   └── Camera.js
│   │   │
│   │   ├── history/
│   │   │   ├── commands/
│   │   │   │   ├── DrawCommand.js
│   │   │   │   └── ....
│   │   │   │
│   │   │   └── HistoryManager.js
│   │   │
│   │   ├── tools/
│   │   │   ├── BucketTool.js
│   │   │   ├── EraserTool.js
│   │   │   ├── EyedropperTool.js
│   │   │   ├── index.js
│   │   │   ├── PenTool.js
│   │   │   ├── Tool.js
│   │   │   └── ToolManager.js
│   │   │
│   │   ├── utils/
│   │   │   ├── ColorUtils.js
│   │   │   ├── EventEmitter.js
│   │   │   └── MathUtils.js
│   │   │
│   │   └── main.js
│   │
│   └── styles/
│       └── styles.css
│
├── .editorconfig
├── .gitattributes
├── .gitignore
├── index.html
├── package.json
└── README.md
```