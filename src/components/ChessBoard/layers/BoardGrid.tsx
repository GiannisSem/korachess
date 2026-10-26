import React from 'react';
import type {Square} from 'chess.js';
import type {BoardTheme} from '../types';
import { FILES, RANKS, coordsToSquare } from '../utils/coordinates';
import styles from '../ChessBoard.module.css';

interface BoardGridProps {
    theme: BoardTheme;
    reversed: boolean;
    onSquareClick: (square: Square) => void;
}

export const BoardGrid: React.FC<BoardGridProps> = ({ theme, reversed, onSquareClick }) => {
    return (
        <div className={styles.grid}>
            {Array.from({ length: 64 }).map((_, index) => {
                const row = Math.floor(index / 8);
                const col = index % 8;
                const isDark = (row + col) % 2 !== 0;
                const square = coordsToSquare(col, row, reversed);

                const showFile = row === 7;
                const showRank = col === 0;

                const textColor = isDark ? theme.light : theme.dark;

                return (
                    <div
                        key={square}
                        className={styles.cell}
                        style={{ backgroundColor: isDark ? theme.dark : theme.light }}
                        onClick={() => onSquareClick(square)}
                    >
                        {showRank && (
                            <span className={styles.coordRank} style={{ color: textColor, fontSize: 30 }}>
                {reversed ? RANKS[row] : RANKS[7 - row]}
              </span>
                        )}
                        {showFile && (
                            <span className={styles.coordFile} style={{ color: textColor, fontSize: 30  }}>
                {reversed ? FILES[7 - col] : FILES[col]}
              </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};