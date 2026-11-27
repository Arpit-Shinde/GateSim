import * as CONSTANTS from "../constants/constants";

export async function commitDownload(
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

    try {
        const baseName = trimmed.replace(/\.(json|gatesim)$/i, "");
        const safeName = baseName.replace(/[^a-z0-9_-]+/gi, "_");
        const fullName = `${safeName}.gatesim`;

        const data = {
            graph,
            clock_delays: clock_delays.map(c => ({
                id: c.id,
                delay: c.delay,
                next_tick: c.next_tick
            }))
        };

        // Serialize JSON
        const json = JSON.stringify(data);

        console.log(json)

        // Compress using GZIP
        const compressedStream = new Blob([json])
            .stream()
            .pipeThrough(new CompressionStream("gzip"));

        const compressedBlob = await new Response(
            compressedStream
        ).blob();

        // Download
        const url = URL.createObjectURL(compressedBlob);

        const a = document.createElement("a");
        a.href = url;
        a.download = fullName;
        a.click();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
        alert("Circuit Saved Locally Successfully");
        setShowDownloadDialog(false);

    } catch (error) {
        console.error("Download error:", error);
        alert("Failed to download circuit.");
    }
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

    reader.onload = async (event) => {
        try {
            const bytes = new Uint8Array(event.target.result);

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
            loadedDelays.map((obj)=>{
                obj.next_tick = performance.now() + obj.delay;
            })
            setClockDelays(loadedDelays);

        } catch (error) {
            console.error("Load error:", error);
            alert("Invalid circuit file. Please check the file format.");

        }
    };

    reader.readAsArrayBuffer(file);
    e.target.value = "";
}

export async function commitDownloadCloud(
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

    try {
        const token = localStorage.getItem("token");
        if (!token) { //check if token exists
            alert("Must be Logged In");
            return;
        }

        //process the file
        const baseName = trimmed.replace(/\.(json|gatesim)$/i, "");
        const safeName = baseName.replace(/[^a-z0-9_-]+/gi, "_");
        const fullName = `${safeName}.gatesim`;

        const data = {
            graph,
            clock_delays: clock_delays.map(c => ({
                id: c.id,
                delay: c.delay,
                next_tick: c.next_tick
            }))
        };

        // Serialize JSON
        const json = JSON.stringify(data);

        // Compress using GZIP
        const compressedStream = new Blob([json])
            .stream()
            .pipeThrough(new CompressionStream("gzip"));

        const compressedBlob = await new Response(
            compressedStream
        ).blob();

        const bytes = new Uint8Array(await compressedBlob.arrayBuffer());
        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        const fileDataBase64 = btoa(binary);

        // console.log(fileDataBase64)

        const response = await fetch(`${CONSTANTS.API_BASE_URL}/circuits/save`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
                token: token
            },
            body: JSON.stringify({
                fileName: fullName,       // e.g., "adder.gatesim"
                fileDataBase64: fileDataBase64 // Base64 string of the GZIP bytes
            })
        });

        const responseData = await response.json();

        console.log(responseData);
        alert("Circuit Saved to Cloud Successfully");

        setShowDownloadDialog(false);

    } catch (error) {
        console.error("Download error:", error);
        alert("Failed to download circuit.");
    }
}

