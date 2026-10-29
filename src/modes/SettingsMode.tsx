import ThemeSelector from "../components/ThemeSelector.tsx";
import {useRef, useState} from "react";
import Button from "../components/Button.tsx";
import type {Level} from "../types.ts";
import ranks from "../assets/ranks.json"

import "../styles/SettingsMode.css"

function SettingsMode() {
    const rapid = () => {
        const raw = localStorage.getItem("rapid");

        if (!raw) {
            const baseLevel: Level = { matches: [], rank_id: 0 }
            localStorage.setItem("rapid", JSON.stringify(baseLevel));
            return baseLevel;
        }

        return JSON.parse(raw);
    }

    const blitz = () => {
        const raw = localStorage.getItem("blitz");

        if (!raw) {
            const baseLevel: Level = { matches: [], rank_id: 0 }
            localStorage.setItem("blitz", JSON.stringify(baseLevel));
            return baseLevel;
        }

        return JSON.parse(raw);
    }

    const lastV = (): [1 | 0.5 | 0, 'w' | 'b'][] => {
        const raw = localStorage.getItem("lastV");

        if (!raw) {
            const base: [1 | 0.5 | 0, 'w' | 'b'][] = [];
            localStorage.setItem("lastV", JSON.stringify(base));
            return base;
        }

        try {
            return JSON.parse(raw);
        } catch {
            return [];
        }
    };

    const [username, setUsername] = useState<string>(() => {
        return localStorage.getItem("username") ?? "User";
    });

    const inputRef = useRef<HTMLInputElement>(null);

    const handleChangeUsername = () => {
        const user = inputRef.current?.value ?? "User";
        setUsername(user);
        localStorage.setItem("username", user);

        if (inputRef.current)
            inputRef.current.value = "";
    }

    const [currentTheme, setCurrentTheme] = useState<string>(() => {
        return localStorage.getItem("theme") ?? "classic";
    });

    const handleSelectTheme = (selectedTheme: string) => {
        setCurrentTheme(selectedTheme);
        localStorage.setItem("theme", selectedTheme);
    }

    const showRank = (mode: Level): string => {
        return ranks[mode.rank_id].name;
    }

    return (
        <div className="dashboard-container">

            {/* SEZIONE 1: Quadrati Grandi (Rank) */}
            <div className="ranks-section">
                <div className="rank-box blitz">
                    <h3>Blitz</h3>
                    <span className="rank-score">{showRank(blitz())}</span>
                </div>
                <div className="rank-box rapid">
                    <h3>Rapid</h3>
                    <span className="rank-score">{showRank(rapid())}</span>
                </div>
            </div>

            {/* SEZIONE 2: Quadratini (Ultimi 5 risultati) */}
            <div className="results-section">
                <h3>Ultimi Risultati</h3>
                <div className="results-grid">
                    {lastV().map((res: any, index: number) => (
                        <div key={index} className={`result-box result-${res}`}>
                            {res.matches[index]} color: {res.colors[index]}
                        </div>
                    ))}
                    {lastV().length < 5 && (
                        <>
                            { // aggiungi celle vuote
                            }
                        </>
                    )}
                </div>
            </div>

            {/* SEZIONE 3: Impostazioni */}
            <div className="settings-section">
                <h3>Impostazioni</h3>
                <div className="settings-form">
                    <label>
                        Username: {username}
                        <input ref={inputRef} type="text" placeholder="Insert new username"/>
                        <Button content={"Change"} onClick={handleChangeUsername} />
                    </label>

                    <label>
                        Theme
                        <ThemeSelector currentTheme={currentTheme} onClick={handleSelectTheme} />
                    </label>
                </div>
            </div>

        </div>
    );
}

export default SettingsMode;