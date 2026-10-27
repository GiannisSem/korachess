import { useStockfish } from "../hooks/useStockfish.ts";
import { useEffect, useState } from "react";

function StockfishIsReady() {
    const stockfish = useStockfish();
    const [isready, setIsready] = useState(false);

    useEffect(() => {
        if (!stockfish) {
            setIsready(false);
            return;
        }

        const handleReady = () => setIsready(stockfish.isReady());
        stockfish.setOnReady(handleReady);
        setIsready(stockfish.isReady());

        return () => {
            stockfish.clearOnReady();
        };
    }, [stockfish]);

    return (
        <div className="stockfish-block">
            <div className={`stockfish-isready ${isready ? "is-ready" : "is-loading"}`} role="status" aria-live="polite">
                <span className="engine-indicator" aria-hidden="true" />
                <span>{isready ? "Stockfish ready" : "Starting engine..."}</span>
            </div>
        </div>
    );
}

export default StockfishIsReady;