import type {Square, PieceSymbol} from "chess.js"; // o dal pacchetto di scacchi che usi
// o dal pacchetto di scacchi che usi

export interface MovePayload {
    from: Square;
    to: Square;
    promotion?: PieceSymbol;
}

/**
 * Converte una stringa UCI (es. "e2e4", "e7e8q") in un oggetto MovePayload.
 * Restituisce null se la stringa non è valida.
 */
export function parseUciMove(uciMove: string): MovePayload | null {
    const match = /^([a-h][1-8])([a-h][1-8])([qrbn])?$/.exec(uciMove);
    if (!match) return null;

    return {
        from: match[1] as Square,
        to: match[2] as Square,
        promotion: (match[3] as PieceSymbol) || undefined,
    };
}

export const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function getFirstFen(uciMove: string): string {
    if (!uciMove) return STARTING_FEN;

    switch (uciMove.toLowerCase().trim()) {
        // --- Spinte di Pedone di 2 case (creano target en-passant, halfmove = 0) ---
        case "e2e4":
            return "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1";
        case "d2d4":
            return "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1";
        case "c2c4":
            return "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3 0 1";
        case "f2f4":
            return "rnbqkbnr/pppppppp/8/8/5P2/8/PPPPP1PP/RNBQKBNR b KQkq f3 0 1";
        case "g2g4":
            return "rnbqkbnr/pppppppp/8/8/6P1/8/PPPPPP1P/RNBQKBNR b KQkq g3 0 1";
        case "b2b4":
            return "rnbqkbnr/pppppppp/8/8/1P6/8/P1PPPPPP/RNBQKBNR b KQkq b3 0 1";
        case "a2a4":
            return "rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR b KQkq a3 0 1";
        case "h2h4":
            return "rnbqkbnr/pppppppp/8/8/7P/8/PPPPPPP1/RNBQKBNR b KQkq h3 0 1";

        // --- Sviluppo Cavalli (halfmove clock incrementato a 1) ---
        case "g1f3":
            return "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1";
        case "b1c3":
            return "rnbqkbnr/pppppppp/8/8/8/2N5/PPPPPPPP/R1BQKBNR b KQkq - 1 1";
        case "g1h3":
            return "rnbqkbnr/pppppppp/8/8/8/7N/PPPPPPPP/RNBQKB1R b KQkq - 1 1";
        case "b1a3":
            return "rnbqkbnr/pppppppp/8/8/8/N7/PPPPPPPP/R1BQKBNR b KQkq - 1 1";

        // --- Spinte di Pedone di 1 casa (nessun en-passant, halfmove = 0) ---
        case "e2e3":
            return "rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR b KQkq - 0 1";
        case "d2d3":
            return "rnbqkbnr/pppppppp/8/8/8/3P4/PPP1PPPP/RNBQKBNR b KQkq - 0 1";
        case "c2c3":
            return "rnbqkbnr/pppppppp/8/8/8/2P5/PP1PPPPP/RNBQKBNR b KQkq - 0 1";
        case "b2b3":
            return "rnbqkbnr/pppppppp/8/8/8/1P6/P1PPPPPP/RNBQKBNR b KQkq - 0 1";
        case "g2g3":
            return "rnbqkbnr/pppppppp/8/8/8/6P1/PPPPPP1P/RNBQKBNR b KQkq - 0 1";
        case "f2f3":
            return "rnbqkbnr/pppppppp/8/8/8/5P2/PPPPP1PP/RNBQKBNR b KQkq - 0 1";
        case "a2a3":
            return "rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR b KQkq - 0 1";
        case "h2h3":
            return "rnbqkbnr/pppppppp/8/8/8/7P/PPPPPPP1/RNBQKBNR b KQkq - 0 1";

        default:
            return STARTING_FEN;
    }
}

interface CalculateMoveParams {
    engine: {
        calculateBestMove: (
            fen: string,
            depth: number,
            callback: (move: string) => void
        ) => void;
    } | null | undefined;
    fen: string;
    depth?: number;
    onMove: (move: MovePayload) => void;
    onError?: (invalidUci: string) => void;
}

async function randomDelay(minSec: number = 0, maxSec: number = 2): Promise<number> {
    const ms = (Math.random() * (maxSec - minSec) + minSec) * 1000;
    await new Promise((resolve) => setTimeout(resolve, ms));
    return ms / 1000; // Restituisce i secondi effettivi attesi
}

/**
 * Richiede la mossa migliore al motore e restituisce il MovePayload parsato.
 */
export function requestEngineMove({
                                      engine,
                                      fen,
                                      depth = 15,
                                      onMove,
                                      onError,
                                  }: CalculateMoveParams): void {
    if (!engine) return;

    engine.calculateBestMove(fen, depth, async (uciMove: string) => {
        const parsedMove = parseUciMove(uciMove);
        if (!parsedMove) {
            if (onError) {
                onError(uciMove);
            } else {
                console.error("Invalid UCI move received from Stockfish:", uciMove);
            }
            return;
        }

        await randomDelay();

        onMove(parsedMove);
    });
}

export function getCurrentMove(move: string): MovePayload {
    return {
        from: move.substring(0, 2) as Square,
        to: move.substring(2, 4) as Square,
        promotion: move.length == 5 ? move[5] as PieceSymbol : undefined
    }
}