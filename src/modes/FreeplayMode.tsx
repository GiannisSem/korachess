import {useState} from "react";
import type {Rank} from "../types.ts";
import ColorPicker from "../components/ColorPicker.tsx";
import Button from "../components/Button.tsx";
import type {Color} from "chess.js";
import Selector from "../components/Selector.tsx";

import ranks from "../assets/ranks.json";
import openings from "../assets/openings.json";
import FreeplayGame from "../components/FreeplayGame.tsx";
import type {GameEndReason} from "../components/ChessBoard/types.ts";

function FreeplayMode() {
    const [color, setColor] = useState<Color | undefined>(undefined);
    const [rank, setRank] = useState<Rank | null>(null);
    const [opening, setOpening] = useState<string>("");
    const [line, setLine] = useState<string[]>([]);
    const [started, setStarted] = useState(false);

    const [gameEnded, setGameEnded] = useState("");

    const handleLine = (line: string) => {
        setLine(openings.find((op) => op.opening === opening)!.lines.find((li) => li[0] === line)!);
    }

    const handleRank = (name: string) => {
        setRank(ranks.find((r: Rank) => r.name === name)!);
    }

    // filtra per colore le aperture da scegliere
    const handleStart = () => {
        if (!rank) return;

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
        console.log("start");
        console.log(l);
        setStarted(true);
    }

    const handleEndGame = async (reason: GameEndReason, pgn: string) => {
        setGameEnded(reason);
        await navigator.clipboard.writeText(pgn);
    }

    const handleReset = () => {
        setColor(undefined);
        setRank(null);
        setOpening("");
        setLine([]);
        setGameEnded("");
        setStarted(false);
    }

    return (
        <div>
            {
                !started && (
                    <>
                        <p>For playing an opening with the opposite color, just select the opening then select the opposite color.</p>
                        <ColorPicker onClick={setColor} />
                        <Selector firstRowText="Random opening"
                                  elements={color
                                      ? openings.filter((op) => op.color === color).map((op) => op.opening)
                                      : openings.map((op) => op.opening)
                                  }
                                  onClick={setOpening}
                        />
                        { opening && (
                            <Selector firstRowText="Random line"
                                      elements={openings.filter((op) => op.opening == opening)
                                          .flatMap((op) => op.lines.map((line): string => line[0]))}
                                      onClick={handleLine}
                            />
                        )}
                        <br />
                        <Selector firstRowText="Select a rank"
                                  elements={ranks.map((rank) => rank.name)}
                                  onClick={handleRank} />
                        <br />
                        <Button content={"Inizia partita"} onClick={handleStart} />
                    </>
                )
            }

            {
                started && (
                    <>
                        <FreeplayGame line={line[1]}
                                      color={color!}
                                      rank={rank!}
                                      handleEndGame={handleEndGame}
                        />
                        <Button content={"Back"} onClick={() => setStarted(false)} />
                    </>
                )
            }

            {
                gameEnded !== "" && (
                    <>
                        <p>Partita finita per {gameEnded}</p>
                        <Button content="Back" onClick={handleReset}/>
                    </>
                    // nuova partita o altro
                )
            }

        </div>
    )
}

export default FreeplayMode;