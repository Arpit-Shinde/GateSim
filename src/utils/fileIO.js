export function commitDownload(
    downloadFileName,
    graph,
    clock_delays,
    setShowDownloadDialog
) {
    const trimmed = downloadFileName.trim();
    if (!trimmed) {
        alert("Please enter a file name.");
        return;
    }

    const safeName = trimmed.replace(/[^a-z0-9_\-]+/gi, "_");
    const fullName = safeName.endsWith(".json") ? safeName : `${safeName}.json`;

    const data = {
        graph: graph,
        clock_delays: clock_delays.map(c => ({
            id: c.id,
            delay: c.delay,
            next_tick: c.next_tick
        }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fullName;
    a.click();
    URL.revokeObjectURL(url);

    setShowDownloadDialog(false);
}

export function loadCircuit(
    e,
    resetTimingCapture,
    compactAndReindex, 
    CONSTANTS,
    evaluate,
    setUndoStack,
    setRedoStack,
    setGraph,
    setClockDelays
) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);

            let loadedGraph;
            let loadedDelays = [];

            // Handle both old and new formats
            if (Array.isArray(data)) {
                loadedGraph = data;
            } else if (data.graph && Array.isArray(data.graph)) {
                loadedGraph = data.graph;
                loadedDelays = data.clock_delays || [];
            } else {
                throw new Error("Invalid circuit file format");
            }

            // Reindex the loaded graph
            // A freshly loaded circuit has no relationship to any previously
            // tracked timing signals — start the capture panel clean rather
            // than trying to remap ids across two unrelated graphs.
            resetTimingCapture();

            // Reindex the loaded graph
            // Reindex the loaded graph. With no oldClockDelays passed,
            // every clock in the file gets a fresh next_delay — the same
            // behavior the manual rebuild above used to produce.
            const [newGraph] = compactAndReindex(loadedGraph);

            // Evaluate the circuit
            for (let i = 0; i < CONSTANTS.MAX_EVALUATION_ITERATIONS; i++) {
                const changed = evaluate(newGraph);

                if (!changed) {
                    break;
                }
            }


            // Clear undo/redo on load
            setUndoStack([]);
            setRedoStack([]);

            setGraph(newGraph);
            setClockDelays(loadedDelays);

            // console.log("✅ Circuit loaded successfully!");

        } catch (error) {
            console.error("Load error:", error);
            alert("Invalid circuit file. Please check the file format.");
        }
    };

    reader.readAsText(file);
    e.target.value = "";
}