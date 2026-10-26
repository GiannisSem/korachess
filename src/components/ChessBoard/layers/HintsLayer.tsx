import React from 'react';
import { Move, Chess } from 'chess.js';
import { squareToPercent } from '../utils/coordinates';
import styles from '../ChessBoard.module.css';

interface HintsLayerProps {
    moves: Move[];
    game: Chess;
    reversed: boolean;
}

export const HintsLayer: React.FC<HintsLayerProps> = ({ moves, game, reversed }) => {
    return (
        <div className={styles.layer}>
            {moves.map((m) => {
                const { x, y } = squareToPercent(m.to, reversed);
                const isCapture = !!game.get(m.to) || m.flags.includes('e');

                return (
                    <div
                        key={m.to}
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