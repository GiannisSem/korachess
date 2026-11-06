import {ChessBoard, type MovePayload} from "./ChessBoard";
import {getTheme} from "../services/utils.ts";
import {requestEngineMove} from "../services/chessUtils.ts";
import {useStockfish} from "../hooks/useStockfish.ts";
import {useState} from "react";
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

    // ??? inserire da qualche parte, capire come fare a far partire la board.fen in base a colore / linea...
    const x = () => {
        console.log(line)
        if (difficulty && stockfish) {
            // aggiorna stockfish
            stockfish.startNewGame();
            stockfish.setElo(difficulty.elo)
        }
    }

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
                initialFen={initialFen}
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