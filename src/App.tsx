import { useState } from 'react';
import { ChessBoard, type MovePayload } from './components/ChessBoard';
import type { PieceSymbol, Square } from 'chess.js';
import themes from './assets/themes.json';
import { useStockfish } from './hooks/useStockfish';

function App() {
    const stockfish = useStockfish();
    const [engineMove, setEngineMove] = useState<MovePayload>();

    const handlePlayerMove = (fen: string) => {
        stockfish?.calculateBestMove(fen, 15, (uciMove) => {
            const match = /^([a-h][1-8])([a-h][1-8])([qrbn])?$/.exec(uciMove);
            if (!match) {
                console.error('Mossa UCI non valida ricevuta da Stockfish:', uciMove);
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
        <>
            <ChessBoard
                onEndGame={(reason) => console.log('Partita terminata:', reason)}
                theme={themes[2]}

                reversed={false}
                playerColor="w"

                onMove={handlePlayerMove}
                engineMove={engineMove}
            />
            <p>
                Stockfish: {engineMove ? `${engineMove.from}-${engineMove.to}` : 'in attesa della mossa'}
            </p>
        </>
    );
}

export default App;
