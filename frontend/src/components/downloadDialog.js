export function DownloadDialog({
  cancelDownload,
  downloadFileName,
  setDownloadFileName,
  commitDownload
}) {
  return (
    <div className="text-edit-overlay" onClick={cancelDownload}>
      <div
        className="text-edit-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-edit-title">Download Circuit</div>

        <input
          className="text-edit-input"
          autoFocus
          placeholder="circuit"
          value={downloadFileName}
          onChange={(e) => setDownloadFileName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitDownload();
            if (e.key === "Escape") cancelDownload();
          }}
        />

        <div className="text-edit-hint">
          Saved as <code>{downloadFileName.trim().replace(/[^a-z0-9_\-]+/gi, "_") || "circuit"}.gatesim</code>
        </div>

        <div className="text-edit-buttons">
          <button className="utilities-button" onClick={cancelDownload}>
            CANCEL
          </button>
          <button className="utilities-button primary" onClick={commitDownload}>
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
}