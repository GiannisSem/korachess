import {ChessBoard, type MovePayload} from "./ChessBoard";
import {getTheme} from "../services/utils.ts";
import {getFirstFen, requestEngineMove} from "../services/chessUtils.ts";
import {useStockfish} from "../hooks/useStockfish.ts";
import {useEffect, useState} from "react";
import type {Rank} from "../types.ts";
import type {Color, Move, PieceSymbol, Square} from "chess.js";

interface FreeplayGameProps {
    line: string;
    color: Color;
    difficulty: Rank;
    handleEndGame: (reason: "checkmate" | "stalemate" | "draw", pgn: string) => void;
}

function FreeplayGame({line, color, difficulty, handleEndGame}: FreeplayGameProps) {
    const stockfish = useStockfish();
    const [engineMove, setEngineMove] = useState<MovePayload>();

    const [counter, setCounter] = useState(color === "w" ? -1 : 0);
    const lineMoves = line.split(" ");
    const [inTheory, setInTheory] = useState(true);

    useEffect(() => {
        if (stockfish) {
            // aggiorna stockfish
            stockfish.startNewGame();
            stockfish.setElo(difficulty.elo);
        }
    }, [stockfish]);

    const getCurrentMove = (count: number): MovePayload => {
        return {
            from: lineMoves[count].substring(0, 2) as Square,
            to: lineMoves[count].substring(2, 4) as Square,
            promotion: lineMoves.length == 5 ? lineMoves[count][5] as PieceSymbol : undefined
        }
    }

    const handlePlayerMove = (move: Move, fen: string) => {
        if (inTheory && counter < lineMoves.length-2) {
            console.log("move: " + lineMoves[counter+3]);
            setCounter(counter + 2);
            const tmove = getCurrentMove(counter + 1);

            if (move.from === tmove.from && move.to === tmove.to) {
                setEngineMove(getCurrentMove(counter + 2));
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
            depth: (difficulty) ? difficulty.depth : 15,
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