import { useState, useRef, useEffect, useCallback } from 'react';
import { Chess, type Square, Move } from 'chess.js';
import type {ChessBoardProps, GameEndReason, PendingPromotion} from '../types';
import {STARTING_FEN} from "../../../services/chessUtils.ts";

export function useChessGame({
                                 initialFen = STARTING_FEN,
                                 pgnHeaders,
                                 playerColor,
                                 engineMove,
                                 onMove,
                                 onEndGame,
                                 viewOnly = false,
                                 resign = false,
                             }: ChessBoardProps) {
    const chessRef = useRef(new Chess(initialFen));
    const [fen, setFen] = useState(initialFen);
    const [isViewOnly, setViewOnly] = useState(viewOnly);
    const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
    const [legalMoves, setLegalMoves] = useState<Move[]>([]);
    const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
    const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion | null>(null);
    const lastEngineMoveRef = useRef<ChessBoardProps['engineMove']>(undefined);
    const gameEndReportedRef = useRef(false);

    const createPgn = useCallback((result: string) => {
        const game = chessRef.current;
        const today = new Date();
        const date = [
            today.getFullYear().toString().padStart(4, '0'),
            (today.getMonth() + 1).toString().padStart(2, '0'),
            today.getDate().toString().padStart(2, '0'),
        ].join('.');

        game.setHeader('Date', date);
        for (const [key, value] of Object.entries(pgnHeaders ?? {})) {
            if (value) game.setHeader(key, value);
        }
        game.setHeader('Result', result);
        return game.pgn();
    }, [pgnHeaders]);

    const checkGameEnd = useCallback(() => {
        const game = chessRef.current;
        if (gameEndReportedRef.current || !game.isGameOver() || !onEndGame) return;

        let reason: GameEndReason;
        let result: string;
        if (game.isCheckmate()) {
            const winner = game.turn() === 'w' ? 'b' : 'w';
            reason = `${winner}_checkmate`;
            result = winner === 'w' ? '1-0' : '0-1';
        } else {
            reason = game.isStalemate() ? 'stalemate' : 'draw';
            result = '1/2-1/2';
        }

        gameEndReportedRef.current = true;
        onEndGame(reason, createPgn(result));
        setViewOnly(true);
    }, [createPgn, onEndGame]);

    useEffect(() => {
        if (resign && onEndGame && !gameEndReportedRef.current) {
            const result = playerColor === 'w' ? '0-1' : playerColor === 'b' ? '1-0' : '*';
            gameEndReportedRef.current = true;
            onEndGame('resign', createPgn(result));
            setViewOnly(true);
        }
    }, [resign, playerColor, onEndGame, createPgn])

    useEffect(() => {
        setViewOnly(viewOnly);
    }, [viewOnly]);

    useEffect(() => {
        if (!isViewOnly) return;
        setSelectedSquare(null);
        setLegalMoves([]);
        setPendingPromotion(null);
    }, [isViewOnly]);

    // Gestione mossa in ingresso da Stockfish
    useEffect(() => {
        if (!engineMove || lastEngineMoveRef.current === engineMove) return;
        lastEngineMoveRef.current = engineMove;

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

                if (onMove?.(game.fen(), res) === false) {
                    game.undo();
                    setFen(game.fen());
                    const history = game.history({ verbose: true });
                    const previousMove = history[history.length - 1];
                    setLastMove(previousMove
                        ? { from: previousMove.from, to: previousMove.to }
                        : null);
                    return;
                }

                checkGameEnd();
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