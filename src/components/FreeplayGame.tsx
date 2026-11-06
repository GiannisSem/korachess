import {ChessBoard, type MovePayload} from "./ChessBoard";
import {getTheme} from "../services/utils.ts";
import {getFirstFen, requestEngineMove} from "../services/chessUtils.ts";
import {useStockfish} from "../hooks/useStockfish.ts";
import {useEffect, useState} from "react";
import type {Rank} from "../types.ts";
import type {Color} from "chess.js";

interface FreeplayGameProps {
    line: string;
    color: Color;
    difficulty: Rank;
    handleEndGame: (reason: "checkmate" | "stalemate" | "draw", pgn: string) => void;
}

function FreeplayGame({line, color, difficulty, handleEndGame}: FreeplayGameProps) {
    const stockfish = useStockfish();
    const [engineMove, setEngineMove] = useState<MovePayload>();

    useEffect(() => {
        if (stockfish) {
            // aggiorna stockfish
            stockfish.startNewGame();
            stockfish.setElo(difficulty.elo)
        }
    }, [stockfish]);

    const handlePlayerMove = (fen: string) => {
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
                initialFen={getFirstFen((color === "w") ? "start" : line.split(' ')[0])}
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