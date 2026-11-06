import {useState} from "react";
import type {Rank} from "../types.ts";
import ColorPicker from "../components/ColorPicker.tsx";
import Button from "../components/Button.tsx";
import type {Color} from "chess.js";
import Selector from "../components/Selector.tsx";

import ranks from "../assets/ranks.json";
import openings from "../assets/openings.json";
import FreeplayGame from "../components/FreeplayGame.tsx";

function FreeplayMode() {
    const [color, setColor] = useState<Color | undefined>(undefined);
    const [difficulty, setDifficulty] = useState<Rank | null>(null);
    const [opening, setOpening] = useState<string>("");
    const [line, setLine] = useState<string[]>([]);
    const [started, setStarted] = useState(false);

    const [gameEnded, setGameEnded] = useState("");

    const handleColor = (color: Color | undefined) => {
        setColor(color);
    }

    const handleDifficulty = (selectedRank: Rank) => {
        setDifficulty(selectedRank)
    }

    const handleOpening = (opening: string) => {
        setOpening(opening);
    }

    const handleLine = (line: string[]) => {
        setLine(line);
    }

    // filtra per colore le aperture da scegliere
    const handleStart = () => {
        if (!difficulty) return;

        const chosenColor = color ?? (Math.random() < 0.5 ? "w" : "b");
        setColor(chosenColor);

        // errore che non cambia opening e line dentro al metodo
        let o = opening;
        let l = line;

        if (opening === "") {
            // random opening
            const random = Math.floor(Math.random() * openings.length);
            o = openings[random].opening;
        }

        if (line.length == 0) {
            // random line dell'apertura
            const op = openings.find((ope) => ope.opening === o);
            if (op) {
                const random = Math.floor(Math.random() * op.lines.length);
                l = op.lines[random];
            }
        }

        setOpening(o);
        setLine(l);

        setStarted(true);
    }

    const handleEndGame = async (reason: "checkmate" | "stalemate" | "draw", pgn: string) => {
        setGameEnded(reason);
        await navigator.clipboard.writeText(pgn);
    }

    return (
        <div>
            {
                !started && (
                    <>
                        <ColorPicker onClick={handleColor} />
                        <Selector firstRowText="Select a rank"
                                  elements={ranks.map((rank) => rank.name)}
                                  onClick={handleDifficulty} />
                        <Selector firstRowText="Random opening"
                                  elements={openings.map((op) => op.opening)}
                                  onClick={handleOpening}
                        />
                        { opening && (
                            <Selector firstRowText="Random line"
                                      elements={openings.filter((op) => op.opening == opening)
                                          .flatMap((op) => op.lines.map((line): string => line[0]))}
                                      onClick={handleLine}
                            />
                        )}
                        <br />
                        <Button content={"Inizia partita"} onClick={handleStart} />
                    </>
                )
            }

            {
                started && (
                    <FreeplayGame line={line[1]}
                                  color={color!}
                                  difficulty={difficulty ?? ranks[0]}
                                  handleEndGame={handleEndGame}
                    />
                )
            }

            {
                gameEnded !== "" && (
                    <p>Partita finita per {gameEnded}</p>
                    // nuova partita o altro
                )
            }

        </div>
    )
}

export default FreeplayMode;