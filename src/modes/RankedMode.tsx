import {blitz, getRank, lastV, rapid} from "../services/utils.ts";
import ResultGrid from "../components/ResultGrid.tsx";
import type {Level, Match, Rank} from "../types.ts";
import {useState} from "react";
import RankedGame from "../components/RankedGame.tsx";
import Button from "../components/Button.tsx";
import type {Color} from "chess.js";
import type {GameEndReason} from "../components/ChessBoard";

const modeTime = {
    blitz: 300000,
    rapid: 600000
}

type Mode = "" | "blitz" | "rapid";

function RankedMode() {

    const rapidRaw: Level = rapid();
    const blitzRaw: Level = blitz();

    const [mode, setMode] = useState<Mode>("");
    const [onGame, setOnGame] = useState(false);
    const [color, setColor] = useState<Color | undefined>(undefined);

    const increment = 3000;

    const startGame = (mode: Mode) => {
        setMode(mode);
        const raw = mode == "blitz" ? blitzRaw : rapidRaw;
        // color -> se vuoto random, se presente, contrario precedente.
        if (raw.matches.length == 0) {
            setColor(Math.random() < 0.5 ? "w" : "b")
        } else {
            setColor(raw.matches[raw.matches.length - 1].playerColor == "w" ? "b" : "w");
        }

        setOnGame(true);
    }

    const handleFirstMove = () => {
        const moves = ["e2e4", "d2d4", "g1f3"];
        return moves[Math.floor(Math.random() * moves.length)];
    }

    const handleEndGame = (reason: GameEndReason, pgn: string) => {
        const raw = mode == "blitz" ? blitzRaw : rapidRaw;

        let result: 0 | 1 | 0.5;
        if (reason === "resign") {
            result = 0;
        } else if (reason === "w_checkmate") {
            result = color === "w" ? 1 : 0;
        } else if (reason === "b_checkmate") {
            result = color === "b" ? 1 : 0;
        } else {
            result = 0.5;
        }

        const match: Match = {
            playerColor: color!,
            result: result,
            pgn: pgn
        }

        raw.matches.push(match);

        if (raw.matches.length < 6){
            localStorage.setItem(mode, JSON.stringify(raw));
        } else {
            // lunghezza = 6 quindi calcola il rank
            let tot = 0;
            const rank: Rank = getRank(raw.rank);

            raw.matches.forEach((m: Match) => {
                tot += m.result;
            })

            let level: Level;
            if (tot < rank.rankDownScore){
                level = { matches: [], rank: getRank(rank.id-1).name }
            } else if(tot > rank.rankUpScore){
                level = { matches: [], rank: getRank(rank.id+1).name }
            } else {
                level = { matches: [], rank: rank.name }
            }
            localStorage.setItem(mode, JSON.stringify(level));
        }

        // salva nei last 5
        let list = lastV();

        if (list.length == 5) {
            let temp = []
            for (let i = 1; i < list.length; i++) {
                temp.push(list[i]);
            }
            list = temp;
        }
        list.push(match);

        localStorage.setItem("lastV", JSON.stringify(list));
    }

    return (
        <>
            { !onGame && (
                <div>
                    <h2>Blitz ({modeTime.blitz / 60000}+{increment / 1000})</h2>
                    <h3>{blitzRaw.rank}</h3>
                    <ResultGrid list={blitzRaw.matches} n={6} />
                    <Button content="New blitz game" onClick={() => startGame("blitz")} />

                    <h2>Rapid ({modeTime.rapid / 60000}+{increment / 1000})</h2>
                    <h3>{rapidRaw.rank}</h3>
                    <ResultGrid list={rapidRaw.matches} n={6} />
                    <Button content="New rapid game" onClick={() => startGame("blitz")} />
                </div>
            )}

            {
                onGame && (
                    <RankedGame color={color!}
                                firstMove={color == "b" ? handleFirstMove() : ""}
                                rank={getRank(mode == "blitz" ? blitzRaw.rank : rapidRaw.rank)}
                                time={mode == "blitz" ? modeTime.blitz : modeTime.rapid}
                                increment={increment}
                                handleEndGame={handleEndGame}
                                onEnd={() => setOnGame(false)}
                    />
                )
            }
        </>
    )
}

export default RankedMode;