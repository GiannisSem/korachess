import {ChessBoard, type MovePayload} from "./ChessBoard";
import {getTheme} from "../services/utils.ts";
import {getCurrentMove, getFirstFen, requestEngineMove} from "../services/chessUtils.ts";
import {useStockfish} from "../services/useStockfish.ts";
import {useEffect, useState} from "react";
import type {Rank} from "../types.ts";
import type {Color, Move} from "chess.js";

interface FreeplayGameProps {
    line: string;
    color: Color;
    rank: Rank;
    handleEndGame: (reason: "checkmate" | "stalemate" | "draw" | "resign", pgn: string) => void;
}

function FreeplayGame({line, color, rank, handleEndGame}: FreeplayGameProps) {
    const stockfish = useStockfish();
    const [engineMove, setEngineMove] = useState<MovePayload>();

    const [counter, setCounter] = useState(color === "w" ? -1 : 0);
    const lineMoves = line.split(" ");
    const [inTheory, setInTheory] = useState(true);

    useEffect(() => {
        if (stockfish) {
            // aggiorna stockfish
            stockfish.startNewGame();
            stockfish.setElo(rank.elo);
        }
    }, [stockfish]);

    const handlePlayerMove = (fen: string, move: Move | undefined) => {
        if (inTheory && counter < lineMoves.length-2) {
            console.log("move: " + lineMoves[counter+3]);
            setCounter(counter + 2);
            const tmove = getCurrentMove(lineMoves[counter+1]);

            if (move!.from === tmove.from && move!.to === tmove.to) {
                setEngineMove(getCurrentMove(lineMoves[counter+2]));
                return;
            } else {
                setInTheory(false);
            }
        }

        setInTheory(false);
        console.log("stockfish")
        requestEngineMove({
            engine: stockfish,
            fen,
            depth: rank.depth ?? 15,
            onMove: setEngineMove,
        });
    };

    return (
        <div className="board-stage">
            <ChessBoard
                initialFen={getFirstFen((color === "w") ? "start" : lineMoves[0])}
                onEndGame={handleEndGame}
                theme={getTheme(localStorage.getItem("theme") ?? "classic")}
                playerColor={color}
                reversed={color === "b"}
                onMove={handlePlayerMove}
                engineMove={engineMove}
            />
        </div>
    )
}

export default FreeplayGame;