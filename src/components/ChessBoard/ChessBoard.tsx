import React from 'react';
import type {ChessBoardProps} from './types';
import { useChessGame } from './hooks/useChessGame';
import { useUserArrows } from './hooks/useUserArrows';

import { BoardGrid } from './layers/BoardGrid';
import { HighlightsLayer } from './layers/HighlightsLayer';
import { PiecesLayer } from './layers/PiecesLayer';
import { HintsLayer } from './layers/HintsLayer';
import { ArrowsLayer } from './layers/ArrowsLayer';
import { PiecePicker } from './layers/PiecePicker';

import themes from '../../assets/themes.json'

import styles from './ChessBoard.module.css';

export const ChessBoard: React.FC<ChessBoardProps> = (props) => {
    const {
        reversed = false,
        theme = themes[0],
        engineArrows = [],
    } = props;

    const {
        game,
        selectedSquare,
        legalMoves,
        lastMove,
        pendingPromotion,
        handleSquareClick,
        confirmPromotion,
    } = useChessGame(props);

    const { userArrows, handleMouseDown, handleMouseUp } = useUserArrows(reversed);

    return (
        <div
            className={styles.container}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onContextMenu={(e) => e.preventDefault()}
        >
            <BoardGrid theme={theme} reversed={reversed} onSquareClick={handleSquareClick} />

            <HighlightsLayer
                selectedSquare={selectedSquare}
                lastMove={lastMove}
                game={game}
                reversed={reversed}
            />

            <PiecesLayer game={game} reversed={reversed} />

            <HintsLayer moves={legalMoves} game={game} reversed={reversed} />

            {/* Layer Frecce Utente (arancione) */}
            <ArrowsLayer arrows={userArrows} reversed={reversed} defaultColor="rgba(255, 170, 0, 0.8)" />

            {/* Layer Frecce Motore (blu/verde) */}
            <ArrowsLayer arrows={engineArrows} reversed={reversed} defaultColor="rgba(0, 140, 255, 0.8)" />

            {pendingPromotion && (
                <PiecePicker
                    promotion={pendingPromotion}
                    reversed={reversed}
                    onSelect={confirmPromotion}
                />
            )}
        </div>
    );
};