import './App.css';

import { useState } from 'react';
import { ChessBoard, type MovePayload } from './components/ChessBoard';
import type { PieceSymbol, Square } from 'chess.js';
import themes from './assets/themes.json';
import { useStockfish } from './hooks/useStockfish';

import courses from './assets/openings.json';
import CourseCard, {type Course} from "./components/CourseCard.tsx";
import StockfishIsReady from "./components/StockfishIsReady.tsx";
import VModeSelector from "./components/VModeSelector.tsx";

const MODE_CONTENT: Record<string, { eyebrow: string; title: string; description: string }> = {
    ranked: {
        eyebrow: "Game",
        title: "Play against Stockfish",
        description: "You play as White.",
    },
    free: {
        eyebrow: "Analysis",
        title: "Free board",
        description: "Move the pieces to explore a position.",
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
    const stockfish = useStockfish();
    const [engineMove, setEngineMove] = useState<MovePayload>();

    const handlePlayerMove = (fen: string) => {
        stockfish?.calculateBestMove(fen, 15, (uciMove) => {
            const match = /^([a-h][1-8])([a-h][1-8])([qrbn])?$/.exec(uciMove);
            if (!match) {
                console.error('Invalid UCI move received from Stockfish:', uciMove);
                return;
            }

            setEngineMove({
                from: match[1] as Square,
                to: match[2] as Square,
                promotion: match[3] as PieceSymbol | undefined,
            });
        });
    };

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
            <header className="app-header">
                <div className="brand">
                    <span className="brand-mark" aria-hidden="true">♞</span>
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
                            <div className="board-stage">
                                <ChessBoard
                                    onEndGame={(reason) => console.log('Game ended:', reason)}
                                    theme={themes[2]}
                                    reversed={false}
                                    playerColor="w"
                                    onMove={handlePlayerMove}
                                    engineMove={engineMove}
                                />
                            </div>
                        )}

                        {mode === "free" && (
                            <div className="board-stage">
                                <ChessBoard />
                            </div>
                        )}

                        {mode === "openings" && (
                            <div className="openings-grid">
                                {courses.map((course: Course) => (
                                    <CourseCard key={course.opening} course={course} onClick={() => console.log("wow")}/>
                                ))}
                            </div>
                        )}

                        {mode === "settings" && (
                            <div className="settings-placeholder">
                                <strong>Settings unavailable</strong>
                                <span>This section will be available soon.</span>
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}

export default App;
