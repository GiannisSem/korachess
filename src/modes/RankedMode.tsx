// da rimuovere in futuro
import themes from '../assets/themes.json';

// imports
import {ChessBoard, type MovePayload} from "../components/ChessBoard";
import {useState} from "react";
import {useStockfish} from "../hooks/useStockfish.ts";
import type {PieceSymbol, Square} from "chess.js";

function RankedMode() {
    const stockfish = useStockfish();
    const [engineMove, setEngineMove] = useState<MovePayload>();

    const handlePlayerMove = (fen: string) => {
        stockfish?.calculateBestMove(fen, 15, (uciMove) => {
            const match = /^([a-h][1-8])([a-h][1-8])([qrbn])?$/.exec(uciMove);
            if (!match) {
                console.error('Invalid UCI move received from Stockfish:', uciMove);
                return;
            }

            setEngineMove({
                from: match[1] as Square,
                to: match[2] as Square,
                promotion: match[3] as PieceSymbol | undefined,
            });
        });
    };
    return (
        <div className="board-stage">
            <ChessBoard
                onEndGame={(reason) => console.log('Game ended:', reason)}
                theme={themes[2]}
                reversed={false}
                playerColor="w"
                onMove={handlePlayerMove}
                engineMove={engineMove}
            />
        </div>
    )
}

export default RankedMode;