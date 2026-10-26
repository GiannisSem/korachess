import React from 'react';
import { Move, Chess } from 'chess.js';
import { squareToPercent } from '../utils/coordinates';
import styles from '../ChessBoard.module.css';

interface HintsLayerProps {
    moves: Move[];
    game: Chess;
    reversed: boolean;
}

export const HintsLayer: React.FC<HintsLayerProps> = ({ moves, reversed }) => {
    const destinations = new Set<string>();
    const uniqueMoves = moves.filter((move) => {
        if (destinations.has(move.to)) return false;
        destinations.add(move.to);
        return true;
    });

    return (
        <div className={styles.layer}>
            {uniqueMoves.map((m) => {
                const { x, y } = squareToPercent(m.to, reversed);
                const isCapture = m.isCapture();

                return (
                    <div
                        key={m.san}
                        style={{
                            position: 'absolute',
                            left: `${x}%`,
                            top: `${y}%`,
                            width: '12.5%',
                            height: '12.5%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            pointerEvents: 'none',
                        }}
                    >
                        <div className={isCapture ? styles.hintCapture : styles.hintDot} />
                    </div>
                );
            })}
        </div>
    );
};