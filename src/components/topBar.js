import mouse_png from "../mouse.png"
import palm_png from "../palm.png"

export function TopBar({
    logo,
    showabout,
    openDownloadDialog,
    fileInputRef,
    setShowComponentIO,
    undo,
    redo,
    clearGraph,
    setTempGraph,
    setSelectedGate,
    beautify,
    graph,
    resetView,
    setTheme,
    theme,
    CONSTANTS,
    togglePauseSim,
    pauseSim,
    RotateGate,
    showTutorial,
    creatingComponent,
    beginCreateComponent,
    PushToTempGraph,
    toggleSelectMode,
    selectMode,
    FinaliseComponentCreation,
    setShowLearnSidebar,
    showLearnSidebar,
    setShowTimingDiagram,
    showTimingDiagram,
    setSelectMode,
    setoPin,
    setMouse,
    setWirePath,
    setdraginfo,
    setPan,
    setCopySelectMode,
    loadCircuit,
    componentFileInputRef,
    loadComponent,
    setInteractivityMode,
    interactivityMode
}) {
    return (
        <div className="utilities">
            <img
                src={logo}
                alt="GateSim Logo"
                width={55}
                height={75}
                className="logo"
                style={{ marginRight: '8px' }}
                onClick={showabout}
            />

            <details className="utilities-menu">
                <summary className="utilities-button">FILE</summary>
                <div className="utilities-menu-content">
                    <button onClick={openDownloadDialog}>DOWNLOAD CIRCUIT</button>
                    <button onClick={() => fileInputRef.current.click()}>LOAD CIRCUIT</button>
                    <button onClick={() => setShowComponentIO(true)}>COMPONENTS</button>
                </div>
            </details>

            <details className="utilities-menu">
                <summary className="utilities-button">EDIT</summary>
                <div className="utilities-menu-content">
                    <button onClick={() => undo()}>↶ UNDO</button>
                    <button onClick={() => redo()}>↷ REDO</button>
                    <button onClick={() => clearGraph()}>CLEAR CIRCUIT</button>
                    <button
                        onClick={() => {

                            // Exit normal selection mode.
                            setSelectMode(false);

                            // Clear any active wire interaction.
                            setoPin(null);
                            setMouse(null);
                            setWirePath([]);
                            setdraginfo(null);
                            setPan(null);

                            // Start copy-area selection.
                            setCopySelectMode(true);

                        }}
                    >
                        COPY AREA
                    </button>
                    <button onClick={() => {
                        setTempGraph([])
                        setSelectedGate(null)
                    }}>DESELECT ALL</button>
                    <button onClick={() => { beautify(graph) }}>BEAUTIFY</button>
                </div>
            </details>

            <details className="utilities-menu">
                <summary className="utilities-button">VIEW</summary>
                <div className="utilities-menu-content">
                    <button onClick={() => resetView()}>RESET VIEW</button>
                    {/* <button
                        onClick={() => {
                            setTheme(!theme);
                            CONSTANTS.toggleTheme(document, theme);
                        }}
                    >
                        TOGGLE THEME
                    </button> */}

                </div>
            </details>

            <details className="utilities-menu">
                <summary className="utilities-button">SIMULATION</summary>
                <div className="utilities-menu-content">
                    <button onClick={togglePauseSim}>
                        {pauseSim ? "▶ START CLOCKS" : "⏸ PAUSE CLOCKS"}
                    </button>
                </div>
            </details>
            <details className="utilities-menu">
                <summary className="utilities-button">TOOLS</summary>
                <div className="utilities-menu-content">
                    <button onClick={() => RotateGate()}>ROTATE</button>

                </div>
            </details>
            <button className="utilities-button" onClick={showTutorial}>TUTORIAL</button>


            {!creatingComponent ? (
                <button className="utilities-button" onClick={beginCreateComponent}>
                    CREATE COMPONENT
                </button>
            ) : (
                <>
                    <button className="utilities-button" onClick={PushToTempGraph}>
                        ADD
                    </button>
                    <button className="utilities-button" onClick={toggleSelectMode}>
                        {selectMode ? "EXIT SELECT" : "SELECT MODE"}
                    </button>
                    <button className="utilities-button" onClick={FinaliseComponentCreation}>
                        DONE
                    </button>
                </>
            )}
            <button className="utilities-button" onClick={() => setShowLearnSidebar(v => !v)}>
                {showLearnSidebar ? "HIDE GUIDE" : "SELF-LEARN"}
            </button>
            <button className="utilities-button" onClick={() => setShowTimingDiagram(v => !v)}>
                {showTimingDiagram ? "HIDE TIMING" : "TIMING DIAGRAM"}
            </button>
            <button
                className={`utilities-button ${interactivityMode === "DRAG" ? "active" : ""}`}
                onClick={() => setInteractivityMode("DRAG")}
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
                <img
                    src={mouse_png}
                    alt=""
                    width={16}
                    height={16}
                    style={{ display: 'block' }}
                />
            </button>
            <button
                className={`utilities-button ${interactivityMode === "PAN" ? "active" : ""}`}
                onClick={() => setInteractivityMode("PAN")}
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
                <img
                    src={palm_png}
                    alt=""
                    width={16}
                    height={16}
                    style={{ display: 'block' }}
                />
            </button>

            {/* <button onClick={() => { console.table(graph) }}>print</button> */}

            {/* Hidden file inputs */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                style={{ display: "none" }}
                onChange={loadCircuit}
            />
            <input
                ref={componentFileInputRef}
                type="file"
                accept=".json"
                style={{ display: "none" }}
                onChange={loadComponent}
            />
        </div>
    )
}