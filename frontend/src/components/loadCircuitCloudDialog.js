import * as CONSTANTS from "../constants/constants";

async function loadCloudCircuit(
    fileName,
    setShowCloudLoadDialog,
    resetTimingCapture,
    compactAndReindex,
    CONSTANTS,
    evaluate,
    setUndoStack,
    setRedoStack,
    setGraph,
    setClockDelays
) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${CONSTANTS.API_BASE_URL}/circuits/load?fileName=${encodeURIComponent(fileName)}`, {
        method: "GET",
        headers: {
            token: token
        }
    })

    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    console.log("Compressed bytes received:", bytes.length, bytes);

    //the logic of code after this is as same as of components/fileIO loadCircuit
    try {
        let jsonText;

        // Detect GZIP using magic bytes
        const isGzip =
            bytes[0] === 0x1f &&
            bytes[1] === 0x8b;

        if (isGzip) {
            const decompressedStream = new Blob([bytes])
                .stream()
                .pipeThrough(new DecompressionStream("gzip"));

            jsonText = await new Response(
                decompressedStream
            ).text();

        } else {
            // Backward compatibility with old JSON files
            jsonText = new TextDecoder().decode(bytes);
        }

        const data = JSON.parse(jsonText);

        let loadedGraph;
        let loadedDelays = [];

        // Handle both old and new JSON formats
        if (Array.isArray(data)) {
            loadedGraph = data;

        } else if (Array.isArray(data.graph)) {
            loadedGraph = data.graph;

            loadedDelays = Array.isArray(data.clock_delays)
                ? data.clock_delays
                : [];

        } else {
            throw new Error("Invalid circuit file format");
        }

        // Reset timing capture
        resetTimingCapture();

        // Reindex loaded graph
        const [newGraph] = compactAndReindex(loadedGraph);

        // Evaluate circuit
        for (
            let i = 0;
            i < CONSTANTS.MAX_EVALUATION_ITERATIONS;
            i++
        ) {
            const changed = evaluate(newGraph);

            if (!changed) break;
        }

        // Clear undo/redo history
        setUndoStack([]);
        setRedoStack([]);

        setGraph(newGraph);
        setClockDelays(loadedDelays);
        setShowCloudLoadDialog(false); //close the window

    } catch (error) {
        console.error("Load error:", error);
        alert("Invalid circuit file. Please check the file format.");

    }
}

export function CloudLoadDialog({
    cloudCircuits = [],
    setShowCloudLoadDialog,
    resetTimingCapture,
    compactAndReindex,
    CONSTANTS,
    evaluate,
    setUndoStack,
    setRedoStack,
    setGraph,
    setClockDelays
}) {
    return (
        <div className="component-dialog-overlay">
            <div className="component-dialog">
                <h2>Cloud Circuits</h2>

                <div className="component-pin-list">
                    {cloudCircuits.length === 0 ? (
                        <div className="component-pin">No saved circuits found in cloud.</div>
                    ) : (
                        cloudCircuits.map((fileName) => {


                            return (
                                <button
                                    key={fileName}
                                    type="button"
                                    className="cloud-circuit-item"
                                    onClick={() => loadCloudCircuit(
                                        fileName,
                                        setShowCloudLoadDialog,
                                        resetTimingCapture,
                                        compactAndReindex,
                                        CONSTANTS,
                                        evaluate,
                                        setUndoStack,
                                        setRedoStack,
                                        setGraph,
                                        setClockDelays
                                    )}
                                    style={{
                                        width: "100%",
                                        textAlign: "left",
                                        cursor: "pointer",

                                    }}
                                >
                                    {fileName}
                                </button>
                            );
                        })
                    )}
                </div>

                <div className="component-dialog-buttons">
                    <button onClick={() => setShowCloudLoadDialog(false)}>
                        CLOSE
                    </button>
                </div>
            </div>
        </div>
    );
}