export const GATE_WIDTH = 70
export const GATE_HEIGHT = 60

export const INPUT_PIN_X = -20;
export const INPUT_PIN_Y_TOP = GATE_HEIGHT / 6;
export const INPUT_PIN_Y_BOTTOM = 5 * GATE_HEIGHT / 6;
export const OUTPUT_PIN_Y = GATE_HEIGHT / 2;
export const INPUT_PIN_Y = GATE_HEIGHT / 2;
export const PIN_RADIUS = 5;

export const GATE_STROKE_WIDTH = 0.7;
export const GATE_STROKE_COLOR = "#000000";
export const GATE_FILL_COLOR = "#ffffff"
export const CUSTOM_GATE_BODY_TEXT_COLOR = "#2f2f2f"
export const CUSTOM_GATE_PINS_TEXT_COLOR = "#686868"

export const NAND_PIN_RADIUS = 3

export const BULB_WIDTH = 30
export const BULB_PIN_X = BULB_WIDTH / 2
export const BULB_PIN_Y = BULB_WIDTH
export const BULB_PIN_LENGTH = 15
export const BULB_ON_COLOR = "#63fd04"

// Base dimensions for the INPUT component
export const INPUT_WIDTH = 40;
export const INPUT_HEIGHT = 40;

export const TOGGLE_WIDTH = 60
export const TOGGLE_HEIGHT = 40
export const TOGGLE_CAPSULE_RADIUS = 10

export let WIRE_COLOR = "#838383"
export const WIRE_STROKE_WIDTH = 3

export const MAX_EVALUATION_ITERATIONS = 5;
export const MIN_FRAME_TIME = 50;





export const GATE_TYPES = ["INPUT", "AND", "OR", "NOT", "XOR", "NAND", "NOR", "XNOR", "BULB"]

export const CANVAS_START = { x: 150, y: 10 }
export let CANVAS_BACKGROUND = "#211f1f"
export let GATE_CARD_BACKGROUND = "#110f0f"

export const SELECTION_FILL_COLOR = "rgba(66, 153, 225, 0.15)";
export const SELECTION_STROKE_COLOR = "#4299e1";



// JK Flip-Flop specific constants
export const JK_INPUT_PINS = {
  J: { x: 0, y: 10 },
  CLK: { x: 0, y: 20 },
  K: { x: 0, y: 30 }
};

export const JK_OUTPUT_PINS = {
  Q: { x: 60, y: 10 },
  Q_NOT: { x: 60, y: 30 }
};

export function toggleTheme(document, theme) {
  if (theme) {
    WIRE_COLOR = "#acacac" //dark mode
    GATE_CARD_BACKGROUND = "#c9c9c9"
    CANVAS_BACKGROUND = "#313131"
    document.documentElement.style.setProperty(
      "--utilities-background",
      "#3c3c3c"
    );
    document.documentElement.style.setProperty(
      "--homepage-background",
      "#2b2b2b"
    );
    document.documentElement.style.setProperty(
      "--gatecard-label-background",
      "#c7c7c7"
    );
  }
  else {
    WIRE_COLOR = "#000000"
    GATE_CARD_BACKGROUND = "#fbfbfb"
    CANVAS_BACKGROUND = "#ababab"
    document.documentElement.style.setProperty(
      "--utilities-background",
      "#e6e6e6"
    );
    document.documentElement.style.setProperty(
      "--homepage-background",
      "#cacaca"
    );
    document.documentElement.style.setProperty(
      "--gatecard-label-background",
      "#393939"
    );
  }
}

export const TIMING_MAX_SAMPLES = 4000;   // cap history length; oldest samples evicted
export const TIMING_ROW_HEIGHT = 36;      // px per signal row
export const TIMING_PX_PER_MS = 0.4;      // horizontal scale of the waveform
export const TIMING_AXIS_HEIGHT = 24;     // px reserved for the time axis row
export const TIMING_LOW_COLOR = "#8a8a8a";
export const TIMING_GRID_COLOR = "#3a3a3a";