export const setToolSchema = {
  type: "string",
  enum: ["pen", "eraser", "bucket", "eyedropper"],
} as const;

export const setColorSchema = {
  type: "object",
  properties: {
    color: {
      type: "string",
      nullable: true
    },
    updateUi: {
      type: "boolean",
    }
  },
  required: ["color", "updateUi"],
  additionalProperties: false,
} as const;

export const setPenSizeSchema = {
  type: "object",
  properties: {
    size: {
      type: "number",
    }
  },
  required: ["size"],
  additionalProperties: false,
} as const;

export const gridToggleSchema = {
  type: "object",
  properties: {
    enabled: {
      type: "boolean",
    }
  },
  required: ["enabled"],
  additionalProperties: false,
} as const;

export const documentResizeSchema = {
  type: "object",
  properties: {
    width: {
      type: "number",
    },
    height: {
      type: "number",
    },
  },
  required: ["width", "height"],
  additionalProperties: false,
} as const;