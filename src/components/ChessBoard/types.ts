import type {Square, PieceSymbol, Color} from 'chess.js';

export type PieceColor = Color; // 'w' | 'b'

export interface MovePayload {
    from: Square;
    to: Square;
    promotion?: PieceSymbol;
    san?: string;
    lan?: string;
}

export interface ArrowData {
    from: Square;
    to: Square;
    color?: string;
}

export interface BoardTheme {
    light: string;
    dark: string;
}

export interface PendingPromotion {
    from: Square;
    to: Square;
    color: PieceColor;
}

export interface ChessBoardProps {
    initialFen?: string;
    playerColor?: PieceColor;
    engineMove?: { from: Square; to: Square; promotion?: PieceSymbol };
    engineArrows?: ArrowData[];
    reversed?: boolean;
    theme?: BoardTheme;
    onMove?: (move: MovePayload) => void;
    onEndGame?: (reason: 'checkmate' | 'stalemate' | 'draw') => void;
    viewOnly?: boolean;
}