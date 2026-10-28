import {ChessBoard, type MovePayload} from "../components/ChessBoard";
import {useState} from "react";
import DifficultySelector from "../components/DifficultySelector.tsx";
import type {Rank} from "../types.ts";
import ColorSelector from "../components/ColorSelector.tsx";
import Button from "../components/Button.tsx";
import type {Color} from "chess.js";
import {useStockfish} from "../hooks/useStockfish.ts";
import themes from "../assets/themes.json";
import {requestEngineMove} from "../services/chessUtils.ts";

function FreeplayMode() {
    const stockfish = useStockfish();
    const [engineMove, setEngineMove] = useState<MovePayload>();

    const [color, setColor] = useState<Color | undefined>(undefined);
    const [difficulty, setDifficulty] = useState<Rank | null>(null);
    const [started, setStarted] = useState(false);

    const [gameEnded, setGameEnded] = useState("");

    const handleColor = (color: Color | undefined) => {
        setColor(color);
    }

    const handleDifficulty = (selectedRank: Rank) => {
        setDifficulty(selectedRank)
    }

    const handleStart = () => {
        if (!difficulty || !stockfish) return;

        if (color === undefined) setColor(Math.random() < 0.5 ? "w" : "b");

        // aggiorna stockfish
        stockfish.startNewGame();
        stockfish.setElo(difficulty.elo)

        // imposta colore
        console.log(color);
        console.log(difficulty);
        setStarted(true);
    }

    const handlePlayerMove = (fen: string) => {
        requestEngineMove({
            engine: stockfish,
            fen,
            depth: (difficulty) ? difficulty.depth : 15,
            onMove: setEngineMove,
        });
    };

    const handleEndGame = async (reason: "checkmate" | "stalemate" | "draw", pgn: string) => {
        setGameEnded(reason);
        await navigator.clipboard.writeText(pgn);
    }

    return (
        <div>
            {
                !started && (
                    <>
                        <ColorSelector onClick={handleColor} />
                        <DifficultySelector onClick={handleDifficulty} />
                        <br />
                        <Button content={"Inizia partita"} onClick={handleStart} />
                    </>
                )
            }

            {
                started && (
                    <div className="board-stage">
                        <ChessBoard
                            onEndGame={handleEndGame}
                            theme={themes[2]}
                            playerColor={color}
                            reversed={color === "b"}
                            onMove={handlePlayerMove}
                            engineMove={engineMove}
                        />
                    </div>
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