import type {Square} from 'chess.js';
import { squareToCoords } from './coordinates';

export function getArrowPoints(from: Square, to: Square, reversed: boolean) {
    const start = squareToCoords(from, reversed);
    const end = squareToCoords(to, reversed);

    // Centro di ciascuna casella in scala 0-800
    const x1 = start.col * 100 + 50;
    const y1 = start.row * 100 + 50;
    const x2 = end.col * 100 + 50;
    const y2 = end.row * 100 + 50;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Accorcia leggermente la testa e la coda per non sovrapporsi al bordo
    const normX = dx / dist;
    const normY = dy / dist;

    const arrowEndX = x2 - normX * 15;
    const arrowEndY = y2 - normY * 15;

    return {
        x1,
        y1,
        x2: arrowEndX,
        y2: arrowEndY,
    };
}