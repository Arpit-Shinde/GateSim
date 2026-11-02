const EPS = 0.5;
const same = (a, b) => Math.abs(a - b) < EPS;

// Bend points needed to get from `from` to `to` using only horizontal/vertical lines.
// `prev` is the point before `from`, used to avoid doubling back on the previous segment.
function routeSegment(from, to, prev) {
    if (same(from.x, to.x) || same(from.y, to.y)) return [];     // already straight

    let horizontalFirst;
    if (prev) {
        // Continue in the direction of the previous segment when possible
        if (same(prev.y, from.y)) {                                // previous was horizontal
            horizontalFirst = Math.sign(to.x - from.x) === Math.sign(from.x - prev.x);
        } else {                                                   // previous was vertical
            horizontalFirst = Math.sign(to.y - from.y) !== Math.sign(from.y - prev.y);
        }
    } else {
        horizontalFirst = Math.abs(to.x - from.x) >= Math.abs(to.y - from.y);
    }

    if (horizontalFirst) {
        const midX = (from.x + to.x) / 2;
        return [{ x: midX, y: from.y }, { x: midX, y: to.y }];     // H → V → H
    }
    const midY = (from.y + to.y) / 2;
    return [{ x: from.x, y: midY }, { x: to.x, y: midY }];       // V → H → V
}

function beautifyPath(path) {
    if (!path || path.length < 2) return path;

    // 1. drop consecutive duplicate points
    const pts = [path[0]];
    for (let i = 1; i < path.length; i++) {
        const p = path[i], q = pts[pts.length - 1];
        if (!(same(p.x, q.x) && same(p.y, q.y))) pts.push(p);
    }
    if (pts.length < 2) return path;

    // 2. make every segment horizontal/vertical
    const out = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
        const from = out[out.length - 1];
        const prev = out.length > 1 ? out[out.length - 2] : null;
        out.push(...routeSegment(from, pts[i], prev), pts[i]);
    }

    // 3. remove points that lie on a straight line
    const result = [out[0]];
    for (let i = 1; i < out.length - 1; i++) {
        const a = result[result.length - 1], b = out[i], c = out[i + 1];
        const collinear =
            (same(a.x, b.x) && same(b.x, c.x)) ||
            (same(a.y, b.y) && same(b.y, c.y));
        if (!collinear) result.push(b);
    }
    result.push(out[out.length - 1]);
    return result;
}

export function beautify({
    addToUndoStack,
    graph,
    clock_delays,
    setGraph

}) {
    addToUndoStack(graph, clock_delays);

    // Wires that other wires branch from must not move, or the branch start point
    // would no longer lie on them.
    const parentIds = new Set();
    for (const n of graph) {
        if (n.type !== "WIRE") continue;
        for (const inp of n.inputs ?? []) {
            if (inp && inp.index !== -1 && graph[inp.id]?.type === "WIRE") parentIds.add(inp.id);
        }
    }

    setGraph(
        graph.map(node =>
            node.type === "WIRE" && !parentIds.has(node.id)
                ? { ...node, path: beautifyPath(node.path) }
                : node
        )
    );
}