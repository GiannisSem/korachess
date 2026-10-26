import { useState, useCallback } from 'react';
import type {Square} from 'chess.js';
import type {ArrowData} from '../types';
import { coordsToSquare } from '../utils/coordinates';

export function useUserArrows(reversed: boolean) {
    const [arrows, setArrows] = useState<ArrowData[]>([]);
    const [startSquare, setStartSquare] = useState<Square | null>(null);

    const getSquareFromMouseEvent = (e: React.MouseEvent<HTMLDivElement>): Square | null => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const col = Math.floor((x / rect.width) * 8);
        const row = Math.floor((y / rect.height) * 8);

        if (col >= 0 && col < 8 && row >= 0 && row < 8) {
            return coordsToSquare(col, row, reversed);
        }
        return null;
    };

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button === 0) {
            // Click sinistro: pulisce le frecce utente
            setArrows([]);
        } else if (e.button === 2) {
            // Click destro: inizia a tracciare la freccia
            const sq = getSquareFromMouseEvent(e);
            setStartSquare(sq);
        }
    }, [reversed]);

    const handleMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button === 2 && startSquare) {
            const targetSquare = getSquareFromMouseEvent(e);
            if (targetSquare && targetSquare !== startSquare) {
                setArrows((prev) => {
                    // Toggle: se la freccia esiste già, la rimuove
                    const exists = prev.some((a) => a.from === startSquare && a.to === targetSquare);
                    if (exists) {
                        return prev.filter((a) => !(a.from === startSquare && a.to === targetSquare));
                    }
                    return [...prev, { from: startSquare, to: targetSquare }];
                });
            }
            setStartSquare(null);
        }
    }, [startSquare, reversed]);

    return {
        userArrows: arrows,
        handleMouseDown,
        handleMouseUp,
    };
}