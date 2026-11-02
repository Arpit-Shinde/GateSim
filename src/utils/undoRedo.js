export function undo(
    undoStack, 
    redoStack, 
    graph, 
    clock_delays,
    setSelectedGate,
    setSelectedWire,
    setGraph, 
    setClockDelays,
    setUndoStack,
    setRedoStack,
    
) {
    if (undoStack.length === 0) return;

    let newUndoStack = [...undoStack];
    let state = newUndoStack.pop();

    // Save current to redo
    let newRedoStack = [...redoStack];
    const now = performance.now();
    newRedoStack.push({
        graph: structuredClone(graph),
        clock_delays: clock_delays.map(c => ({ id: c.id, delay: c.delay, next_tick: c.next_tick }))
    });

    // Restore graph
    let restoredGraph = state.graph;

    // Rebuild clock delays with fresh next_delay

    let restoredDelays = state.clock_delays.map(clock => ({
        id: clock.id,
        delay: clock.delay,
        next_tick: now + clock.delay
    }));
    setSelectedGate(null);
    setSelectedWire(null);
    setGraph(restoredGraph);
    setClockDelays(restoredDelays);
    setUndoStack(newUndoStack);
    setRedoStack(newRedoStack);
}

export function redo(
    redoStack,
    undoStack,
    graph,
    clock_delays,
    setSelectedGate,
    setSelectedWire,
    setGraph,
    setClockDelays,
    setRedoStack,
    setUndoStack
) {
    if (redoStack.length === 0) return;

    let newRedoStack = [...redoStack];
    let state = newRedoStack.pop();

    // Save current to undo
    let newUndoStack = [...undoStack];
    const now = performance.now();
    newUndoStack.push({
        graph: structuredClone(graph),
        clock_delays: clock_delays.map(c => ({ id: c.id, delay: c.delay, next_tick: c.next_tick }))
    });

    // Restore graph
    let restoredGraph = state.graph;

    // Rebuild clock delays with fresh next_delay

    let restoredDelays = state.clock_delays.map(clock => ({
        id: clock.id,
        delay: clock.delay,
        next_tick: now + clock.delay
    }));
    setSelectedGate(null);
    setSelectedWire(null);
    setGraph(restoredGraph);
    setClockDelays(restoredDelays);
    setRedoStack(newRedoStack);
    setUndoStack(newUndoStack);
}