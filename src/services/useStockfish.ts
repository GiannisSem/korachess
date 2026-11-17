import { useEffect, useState } from 'react';
import { StockfishEngine } from './StockfishEngine.ts';

export function useStockfish() {
    const [engine, setEngine] = useState<StockfishEngine | null>(null);

    useEffect(() => {
        const stockfish = new StockfishEngine('/stockfish/stockfish-19-lite-single.js');
        setEngine(stockfish);

        return () => {
            stockfish.terminate();
        };
    }, []);

    return engine;
}