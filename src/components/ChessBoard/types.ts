import {type Square, type PieceSymbol, type Color, Move} from 'chess.js';

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
    name: string;
    light: string;
    dark: string;
}

export interface PendingPromotion {
    from: Square;
    to: Square;
    color: PieceColor;
}

export type GameEndReason = 'w_checkmate' | 'b_checkmate' | 'stalemate' | 'draw' | 'resign';

export type PgnHeaders = Partial<Record<'Event' | 'Site' | 'White' | 'Black', string>>;

export interface ChessBoardProps {
    initialFen?: string;
    pgnHeaders?: PgnHeaders;
    playerColor?: PieceColor;
    engineMove?: { from: Square; to: Square; promotion?: PieceSymbol };
    engineArrows?: ArrowData[];
    reversed?: boolean;
    theme?: BoardTheme;
    onMove?: (fen: string, res?: Move) => boolean | void;
    onEndGame?: (reason: GameEndReason, pgn: string) => void;
    viewOnly?: boolean;
    resign?: boolean;
}