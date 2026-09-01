import * as CONSTANTS from "../constants/constants";

export function getWireStart(graph, input) {
    let startx = graph[input].x + CONSTANTS.GATE_WIDTH - CONSTANTS.INPUT_PIN_X
    let starty = graph[input].y + CONSTANTS.INPUT_PIN_Y

    if (graph[input].type === "INPUT") {
        startx = graph[input].x + CONSTANTS.TOGGLE_WIDTH - CONSTANTS.INPUT_PIN_X
        starty = graph[input].y + CONSTANTS.TOGGLE_HEIGHT / 2
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

    return { x: endx, y: endy }
}