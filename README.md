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
│   ├── renderers/
│   ├── ├── BackgroundRenderer.js
│   ├── ├── DocumentRenderer.js
│   ├── ├── GridOverlayRenderer.js
│   ├── ├── RulerOverlayRenderer.js
│   ├── ├── CursorOverlayRenderer.js
│   ├── └── CanvasRenderer.js
│   │
│   ├── Camera.js
│   ├── ExportsManager.js
│   ├── InputController.js
│   ├── PixelDocument.js
│   ├── PixelEditor.js
│   └── UIController.js
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