import * as CONSTANTS from "../constants/constants";

export function getWireStart(graph, input) {
    let startx = graph[input].x + CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X
    let starty = graph[input].y + CONSTANTS.INPUT_PIN_Y

    if (graph[input].type === "INPUT") {
        startx = graph[input].x + CONSTANTS.TOGGLE_WIDTH - CONSTANTS.INPUT_PIN_X
        starty = graph[input].y + CONSTANTS.TOGGLE_HEIGHT / 2
    }
    if (graph[input].type === "JK") {
        // Default to Q (top output)
        const outputIndex = graph[input]._outputIndex || 0;
        const yPos = outputIndex === 0
            ? CONSTANTS.INPUT_PIN_Y_TOP
            : CONSTANTS.INPUT_PIN_Y_BOTTOM;

        return {
            x: graph[input].x + CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X,
            y: graph[input].y + yPos
        };
    }

    return { x: startx, y: starty }
}

export function getWireEnd(node, index) {
    let endx = node.x + CONSTANTS.INPUT_PIN_X
    let endy
    if (index === 0) endy = node.y + CONSTANTS.INPUT_PIN_Y_TOP
    else endy = node.y + CONSTANTS.INPUT_PIN_Y_BOTTOM
    if (node.type === "BULB") {
        endx = node.x + CONSTANTS.BULB_PIN_X
        endy = node.y + CONSTANTS.BULB_PIN_Y + CONSTANTS.BULB_PIN_LENGTH
    }
    if (node.type === "NOT") {

        endy = node.y + CONSTANTS.INPUT_PIN_Y
    }
    if ((node.type === "NAND3" || node.type === "AND3" || node.type === "OR3" || node.type === "NOR3" || node.type === "XOR3" || node.type === "XNOR3") && index === 1) {
        endy = node.y + CONSTANTS.GATE_HEIGHT / 2
    }

    if (node.type === "JK") {
        const yPositions = [
            CONSTANTS.INPUT_PIN_Y_TOP,    // J
            CONSTANTS.GATE_HEIGHT / 2,     // CLK
            CONSTANTS.INPUT_PIN_Y_BOTTOM   // K
        ];
        return {
            x: node.x + CONSTANTS.INPUT_PIN_X,
            y: node.y + (yPositions[index] || CONSTANTS.INPUT_PIN_Y_BOTTOM)
        };
    }

    return { x: endx, y: endy }
}