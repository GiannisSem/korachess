import {useRef, useState} from "react";
import Button from "../components/Button.tsx";
import themes from "../assets/themes.json";

import "../styles/SettingsMode.css"
import Selector from "../components/Selector.tsx";
import ResultGrid from "../components/ResultGrid.tsx";
import {blitz, lastV, rapid} from "../services/utils.ts";

function SettingsMode() {
    const [username, setUsername] = useState<string>(() => {
        return localStorage.getItem("username") ?? "User";
    });

    const inputRef = useRef<HTMLInputElement>(null);

    const handleChangeUsername = () => {
        if (inputRef.current?.value === "") {
            return;
        }

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
        localStorage.setItem("theme", selectedTheme ?? "classic");
    }

    return (
        <div className="dashboard-container">

            {/* SEZIONE 1: Quadrati Grandi (Rank) */}
            <div className="ranks-section">
                <div className="rank-box blitz">
                    <h3>Blitz</h3>
                    <span className="rank-score">{blitz().rank}</span>
                </div>
                <div className="rank-box rapid">
                    <h3>Rapid</h3>
                    <span className="rank-score">{rapid().rank}</span>
                </div>
            </div>

            {/* SEZIONE 2: Quadratini (Ultimi 5 risultati) */}
            <div className="results-section">
                <h3>Last results</h3>
                <ResultGrid list={lastV()} n={5}/>
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

                    <div>
                        Current theme: {currentTheme}
                        <Selector firstRowText="Select a theme"
                                  elements={themes.map((theme) => theme.name)}
                                  onClick={handleSelectTheme}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default SettingsMode;