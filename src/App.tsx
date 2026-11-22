import './App.css';

import { useState } from 'react';

import courses from './assets/openings.json';
import StockfishIsReady from "./components/StockfishIsReady.tsx";
import VModeSelector from "./components/VModeSelector.tsx";
import RankedMode from "./modes/RankedMode.tsx";
import FreeplayMode from "./modes/FreeplayMode.tsx";
import OpeningsMode from "./modes/OpeningsMode.tsx";
import SettingsMode from "./modes/SettingsMode.tsx";
import { Analytics } from "@vercel/analytics/react"

const MODE_CONTENT: Record<string, { eyebrow: string; title: string; description: string }> = {
    ranked: {
        eyebrow: "Game",
        title: "Play against Kora",
        description: "Ranked game",
    },
    free: {
        eyebrow: "Casual game",
        title: "Freeplay",
        description: "Play a casual game against Kora.",
    },
    openings: {
        eyebrow: "Repertoire",
        title: "Openings",
        description: "Browse the available openings and lines.",
    },
    settings: {
        eyebrow: "KoraChess",
        title: "Settings",
        description: "Application preferences.",
    },
};

function App() {

    const [mode, setMode] = useState("ranked");
    const handleMode = (value: string) => {
        setMode(value);
    }

    const modeContent = MODE_CONTENT[mode] ?? {
        eyebrow: "KoraChess",
        title: "Choose a mode",
        description: "Choose a mode to get started.",
    };

    return (
        <div className="app-shell">
            <Analytics />
            <header className="app-header">
                <div className="brand">
                    <span className="brand-mark" aria-hidden="true">🐾</span>
                    <h1>KoraChess</h1>
                </div>
                <StockfishIsReady />
            </header>

            <div className="app-layout">
                <aside className="sidebar">
                    <VModeSelector onChange={handleMode} />
                </aside>

                <main className="main-content">
                    <div className="workspace-heading">
                        <div>
                            <p className="eyebrow">{modeContent.eyebrow}</p>
                            <h2>{modeContent.title}</h2>
                            <p className="workspace-description">{modeContent.description}</p>
                        </div>
                        {mode === "openings" && (
                            <span className="workspace-count">
                                {courses.length} {courses.length === 1 ? "opening" : "openings"}
                            </span>
                        )}
                    </div>

                    <section className="workspace-panel" aria-label={modeContent.title}>
                        {mode === "ranked" && (
                            <RankedMode />
                        )}

                        {mode === "free" && (
                            <FreeplayMode />
                        )}

                        {mode === "openings" && (
                            <OpeningsMode />
                        )}

                        {mode === "settings" && (
                            <SettingsMode />
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}

export default App;
