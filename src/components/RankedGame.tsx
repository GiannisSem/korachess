import {ChessBoard, type MovePayload} from "./ChessBoard";
import {getTheme} from "../services/utils.ts";
import {getFirstFen, requestEngineMove} from "../services/chessUtils.ts";
import {useStockfish} from "../services/useStockfish.ts";
import {useEffect, useState} from "react";
import type {Rank} from "../types.ts";
import type {Color} from "chess.js";
import {Timer} from "./Timer.tsx";
import Button from "./Button.tsx";
import type {GameEndReason, PgnHeaders} from "./ChessBoard/types.ts";

interface RankedGameProps {
    color: Color;
    firstMove: string
    rank: Rank;
    time: number,
    increment: number
    pgnHeaders: PgnHeaders;
    handleEndGame: (reason: GameEndReason, pgn: string) => void;
    onEnd: () => void;
}

function RankedGame({color, firstMove, rank, time, increment, pgnHeaders, handleEndGame, onEnd}: RankedGameProps) {
    const stockfish = useStockfish();
    const [engineMove, setEngineMove] = useState<MovePayload>();

    const [yourTurn, setYourTurn] = useState<boolean>(false);
    const [resign, setResign] = useState<boolean>(false);

    useEffect(() => {
        if (stockfish) {
            // aggiorna stockfish
            stockfish.startNewGame();
            stockfish.setElo(rank.elo);
        }
    }, [stockfish]);

    const handleBotMove = (move: MovePayload) => {
        setEngineMove(move);
        setYourTurn(true);
    }

    const handlePlayerMove = (fen: string) => {
        setYourTurn(false);

        requestEngineMove({
            engine: stockfish,
            fen,
            depth: rank.depth,
            onMove: handleBotMove,
        });
    };

    const [end, setEnd] = useState(false);
    const handleEnd = (reason: GameEndReason, pgn: string) => {
        setYourTurn(false);
        handleEndGame(reason, pgn);
        setEnd(true);
    }

    return (
        <div className="board-stage">
            <ChessBoard
                initialFen={getFirstFen((color === "w") ? "start" : firstMove)}
                pgnHeaders={pgnHeaders}
                onEndGame={handleEnd}
                theme={getTheme(localStorage.getItem("theme") ?? "classic")}
                playerColor={color}
                reversed={color === "b"}
                onMove={handlePlayerMove}
                engineMove={engineMove}
                resign={resign}
            />
            <Timer startTime={time} active={yourTurn} increment={increment} onEnd={() => setResign(true)} />
            { !end && <Button content={"Resign"} onClick={() => setResign(true)} /> }
            { end && <Button content={"Back"} onClick={onEnd} /> }
        </div>
    )
}

export default RankedGame;