import React from 'react';
import type {PieceSymbol} from 'chess.js';
import type {PendingPromotion} from '../types';
import { squareToPercent } from '../utils/coordinates';

interface PiecePickerProps {
    promotion: PendingPromotion;
    reversed: boolean;
    onSelect: (piece: PieceSymbol | null) => void;
}

export const PiecePicker: React.FC<PiecePickerProps> = ({ promotion, reversed, onSelect }) => {
    const { x, y } = squareToPercent(promotion.to, reversed);
    const pieces: PieceSymbol[] = ['q', 'r', 'b', 'n'];

    return (
        <div
            style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y <= 50 ? y : y - 37.5}%`,
                width: '12.5%',
                height: '50%',
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                borderRadius: 4,
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {pieces.map((p) => (
                <div
                    key={p}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect(p);
                    }}
                    style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }}
                >
                    <img
                        src={`/src/assets/pieces/${promotion.color}${p.toUpperCase()}.svg`}
                        alt={p}
                        style={{ width: '80%', height: '80%' }}
                    />
                </div>
            ))}
            <div
                key={'x'}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(null);
                }}
                style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: 'red',
                    fontSize: 50
                }}
            >
                x
            </div>
        </div>
    );
};