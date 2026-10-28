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

    engine.calculateBestMove(fen, depth, (uciMove: string) => {
        const parsedMove = parseUciMove(uciMove);
        if (!parsedMove) {
            if (onError) {
                onError(uciMove);
            } else {
                console.error("Invalid UCI move received from Stockfish:", uciMove);
            }
            return;
        }

        onMove(parsedMove);
    });
}