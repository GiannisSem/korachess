import React from 'react';
import { Chess } from 'chess.js';
import { squareToPercent } from '../utils/coordinates';
import styles from '../ChessBoard.module.css';

interface PiecesLayerProps {
    game: Chess;
    reversed: boolean;
}

export const PiecesLayer: React.FC<PiecesLayerProps> = ({ game, reversed }) => {
    const pieces: Array<{ key: string; square: string; type: string; color: string }> = [];

    game.board().forEach((row) => {
        row.forEach((piece) => {
            if (piece) {
                pieces.push({
                    key: `${piece.square}-${piece.color}${piece.type}`,
                    square: piece.square,
                    type: piece.type,
                    color: piece.color,
                });
            }
        });
    });

    return (
        <div className={styles.layer}>
            {pieces.map((p) => {
                const { x, y } = squareToPercent(p.square as any, reversed);
                const fileName = `${p.color}${p.type.toUpperCase()}`;

                return (
                    <div
                        key={p.square}
                        className={styles.piece}
                        style={{
                            transform: `translate(${x * 8}%, ${y * 8}%)`,
                        }}
                    >
                        <img
                            src={`/src/assets/pieces/${fileName}.svg`}
                            alt={fileName}
                            draggable={false}
                        />
                    </div>
                );
            })}
        </div>
    );
};