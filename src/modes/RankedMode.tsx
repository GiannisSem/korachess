import {ChessBoard, type MovePayload} from "../components/ChessBoard";
import {useState} from "react";
import {useStockfish} from "../hooks/useStockfish.ts";
import {requestEngineMove} from "../services/chessUtils.ts";
import {getTheme} from "../services/utils.ts";

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
                theme={getTheme(localStorage.getItem("theme") ?? "classic")}
                reversed={false}
                playerColor="w"
                onMove={handlePlayerMove}
                engineMove={engineMove}
            />
        </div>
    )
}

export default RankedMode;