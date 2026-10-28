import { useState, useRef, useEffect, useCallback } from 'react';
import { Chess, type Square, Move } from 'chess.js';
import type {ChessBoardProps, PendingPromotion} from '../types';

export function useChessGame({
                                 initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                                 playerColor,
                                 engineMove,
                                 onMove,
                                 onEndGame,
                                 viewOnly = false,
                             }: ChessBoardProps) {
    const chessRef = useRef(new Chess(initialFen));
    const [fen, setFen] = useState(initialFen);
    const [isViewOnly, setViewOnly] = useState(viewOnly);
    const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
    const [legalMoves, setLegalMoves] = useState<Move[]>([]);
    const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
    const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion | null>(null);

    const checkGameEnd = useCallback(() => {
        const game = chessRef.current;
        if (game.isGameOver() && onEndGame) {
            if (game.isCheckmate()) onEndGame('checkmate', chessRef.current.pgn());
            else if (game.isStalemate()) onEndGame('stalemate', chessRef.current.pgn());
            else if (game.isDraw()) onEndGame('draw', chessRef.current.pgn());
            setViewOnly(true);
        }
    }, [onEndGame]);

    useEffect(() => {
        if (!isViewOnly) return;
        setSelectedSquare(null);
        setLegalMoves([]);
        setPendingPromotion(null);
    }, [isViewOnly]);

    // Gestione mossa in ingresso da Stockfish
    useEffect(() => {
        if (!engineMove) return;
        try {
            const res = chessRef.current.move(engineMove);
            if (res) {
                setFen(chessRef.current.fen());
                setLastMove({ from: res.from, to: res.to });
                checkGameEnd();
            }
        } catch {
            console.error('Mossa motore non valida:', engineMove);
        }
    }, [engineMove, checkGameEnd]);

    const executeMove = useCallback((from: Square, to: Square, promotion?: any) => {
        const game = chessRef.current;
        try {
            const res = game.move({ from, to, promotion });
            if (res) {
                setFen(game.fen());
                setLastMove({ from: res.from, to: res.to });
                setSelectedSquare(null);
                setLegalMoves([]);
                checkGameEnd();

                if (onMove) {
                    onMove(chessRef.current.fen());
                }
            }
        } catch (e) {
            console.error('Mossa non valida:', e);
        }
    }, [onMove, checkGameEnd]);

    const handleSquareClick = useCallback((square: Square) => {
        if (isViewOnly || pendingPromotion) return;

        const game = chessRef.current;
        const piece = game.get(square);

        // Se clicchiamo su un proprio pezzo valido
        if (piece && (!playerColor || piece.color === playerColor) && piece.color === game.turn()) {
            setSelectedSquare(square);
            setLegalMoves(game.moves({ square, verbose: true }));
            return;
        }

        // Se c'è già un pezzo selezionato e clicchiamo una casa di destinazione
        if (selectedSquare) {
            const matchingMove = legalMoves.find((m) => m.to === square);
            if (matchingMove) {
                // Controllo promozione pedone
                if (matchingMove.flags.includes('p')) {
                    setPendingPromotion({
                        from: selectedSquare,
                        to: square,
                        color: game.turn(),
                    });
                    return;
                }

                executeMove(selectedSquare, square);
                return;
            }
        }

        setSelectedSquare(null);
        setLegalMoves([]);
    }, [pendingPromotion, playerColor, selectedSquare, legalMoves, executeMove]);

    const confirmPromotion = useCallback((pieceSymbol: any) => {
        if (isViewOnly || !pendingPromotion) return;
        if (!pieceSymbol) {
            setPendingPromotion(null);
            return;
        }
        executeMove(pendingPromotion.from, pendingPromotion.to, pieceSymbol);
        setPendingPromotion(null);
    }, [pendingPromotion, executeMove]);

    return {
        game: chessRef.current,
        fen,
        selectedSquare,
        legalMoves,
        lastMove,
        pendingPromotion,
        handleSquareClick,
        confirmPromotion,
    };
}