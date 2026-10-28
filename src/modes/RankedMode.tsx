// da rimuovere in futuro
import themes from '../assets/themes.json';

// imports
import {ChessBoard, type MovePayload} from "../components/ChessBoard";
import {useState} from "react";
import {useStockfish} from "../hooks/useStockfish.ts";
import {requestEngineMove} from "../services/chessUtils.ts";

function RankedMode() {
    const stockfish = useStockfish();
    const [engineMove, setEngineMove] = useState<MovePayload>();

    const handlePlayerMove = (fen: string) => {
        requestEngineMove({
            engine: stockfish,
            fen,
            depth: 15,
            onMove: setEngineMove,
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