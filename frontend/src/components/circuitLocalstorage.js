const AUTOSAVE_KEY = "gatesim_autosave_circuit";

export async function saveAutosaveCircuit(graph, clockDelays = {}) {
  try {
    const payload = JSON.stringify({ graph, clockDelays });
    const jsonBytes = new TextEncoder().encode(payload);
    const stream = new Blob([jsonBytes])
      .stream()
      .pipeThrough(new CompressionStream("gzip"));
    const compressedBuffer = await new Response(stream).arrayBuffer();
    const gzipBytes = new Uint8Array(compressedBuffer);

    let binary = "";
    const chunkSize = 0x8000;
    for (let i = 0; i < gzipBytes.length; i += chunkSize) {
      binary += String.fromCharCode(...gzipBytes.subarray(i, i + chunkSize));
    }

    localStorage.setItem(AUTOSAVE_KEY, btoa(binary));
  } catch (err) {
    console.warn("Autosave failed (storage quota or compression error):", err);
  }
}

export async function loadAutosaveCircuit() {
  try {
    const base64 = localStorage.getItem(AUTOSAVE_KEY);
    if (!base64) return null;

    const binary = atob(base64);
    const gzipBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      gzipBytes[i] = binary.charCodeAt(i);
    }

    const stream = new Blob([gzipBytes])
      .stream()
      .pipeThrough(new DecompressionStream("gzip"));
    const decompressedText = await new Response(stream).text();
    return JSON.parse(decompressedText);
  } catch (err) {
    console.warn("Failed to restore autosave:", err);
    return null;
  }
}

export function clearAutosaveCircuit() {
  localStorage.removeItem(AUTOSAVE_KEY);
}