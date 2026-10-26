import React from 'react';
import {type Square, Chess } from 'chess.js';
import { squareToPercent } from '../utils/coordinates';
import styles from '../ChessBoard.module.css';

interface HighlightsLayerProps {
    selectedSquare: Square | null;
    lastMove: { from: Square; to: Square } | null;
    game: Chess;
    reversed: boolean;
}

export const HighlightsLayer: React.FC<HighlightsLayerProps> = ({
                                                                    selectedSquare,
                                                                    lastMove,
                                                                    game,
                                                                    reversed,
                                                                }) => {
    let checkSquare: Square | null = null;
    if (game.inCheck()) {
        const turn = game.turn();
        const board = game.board();
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const p = board[r][c];
                if (p && p.type === 'k' && p.color === turn) {
                    checkSquare = p.square;
                }
            }
        }
    }

    const renderHighlight = (square: Square, color: string, role: string) => {
        const { x, y } = squareToPercent(square, reversed);
        return (
            <div
                key={`${role}-${square}`}
                style={{
                    position: 'absolute',
                    left: `${x}%`,
                    top: `${y}%`,
                    width: '12.5%',
                    height: '12.5%',
                    backgroundColor: color,
                    pointerEvents: 'none',
                }}
            />
        );
    };

    return (
        <div className={styles.layer}>
            {lastMove && renderHighlight(lastMove.from, 'rgba(255,255,0,0.4)', 'last-from')}
            {lastMove && renderHighlight(lastMove.to, 'rgba(255,255,0,0.4)', 'last-to')}
            {selectedSquare && renderHighlight(selectedSquare, 'rgba(255,255,0,0.6)', 'selected')}
            {checkSquare && renderHighlight(checkSquare, 'radial-gradient(ellipse at center, red 0%, transparent 75%)', 'check')}
        </div>
    );
};