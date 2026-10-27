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

    const handleColor = () => {
        return isready ? {
            color: "lime", backgroundColor: "green"
        } : {
            color: "orange", backgroundColor: "red"
        }
    }

    return (
        <div className="stockfish-isready" style={handleColor()}>
            <p>* {isready ? "READY" : "NOT READY"}</p>
        </div>
    );
}

export default StockfishIsReady;