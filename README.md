# PixelEditor

## Folder Structure

The application is divided into the following directories and corresponding components:

```
src/
├── algorithms/
│   └── FloodFill.js
│
├── brushes/
│   └── Brush.js
│
├── editor/
│   ├── controllers/
│   │   ├── commands/
│   │   │   ├── CommandsController.js
│   │   │   └── DrawCommand,js
│   │   │
│   │   └── InputController.js
│   │
│   ├── core/
│   │   ├── PixelDocument.js
│   │   └── PixelDocumentLayer.js
│   │
│   ├── managers/
│   │   ├── ExportsManager.js
│   │   ├── HistoryManager.js
│   │   └── UIManager.js
│   │
│   ├── renderers/
│   │   ├── BackgroundRenderer.js
│   │   ├── DocumentRenderer.js
│   │   ├── GridOverlayRenderer.js
│   │   ├── RulerOverlayRenderer.js
│   │   ├── CursorOverlayRenderer.js
│   │   └── CanvasRenderer.js
│   │
│   ├── Application.js
│   └── Camera.js
│
├── tools/
│   ├── BucketTool.js
│   ├── EraserTool.js
│   ├── EyedropperTool.js
│   ├── index.js
│   ├── PenTool.js
│   ├── Tool.js
│   └── ToolManager.js
│
├── utils/
│   ├── ColorUtils.js
│   ├── EventEmitter.js
│   └── MathUtils.js
│
└── main.js
```