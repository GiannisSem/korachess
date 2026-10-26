import type {Square} from 'chess.js';

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
export const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;

export function squareToCoords(square: Square, reversed: boolean): { col: number; row: number } {
    const file = square[0];
    const rank = square[1];

    let col = FILES.indexOf(file as typeof FILES[number]);
    let row = 7 - RANKS.indexOf(rank as typeof RANKS[number]); // 0 in alto ('8'), 7 in basso ('1')

    if (reversed) {
        col = 7 - col;
        row = 7 - row;
    }

    return { col, row };
}

export function coordsToSquare(col: number, row: number, reversed: boolean): Square {
    const actualCol = reversed ? 7 - col : col;
    const actualRow = reversed ? 7 - row : row;

    const file = FILES[actualCol];
    const rank = RANKS[7 - actualRow];

    return `${file}${rank}` as Square;
}

export function squareToPercent(square: Square, reversed: boolean): { x: number; y: number } {
    const { col, row } = squareToCoords(square, reversed);
    return {
        x: col * 12.5,
        y: row * 12.5,
    };
}