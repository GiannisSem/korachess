import React from 'react';
import type {ArrowData} from '../types';
import { getArrowPoints } from '../utils/svgGeometry';

interface ArrowsLayerProps {
    arrows: ArrowData[];
    defaultColor?: string;
    reversed: boolean;
}

export const ArrowsLayer: React.FC<ArrowsLayerProps> = ({
                                                            arrows,
                                                            defaultColor = 'rgba(255, 170, 0, 0.8)',
                                                            reversed,
                                                        }) => {
    if (arrows.length === 0) return null;

    return (
        <svg
            viewBox="0 0 800 800"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 10,
            }}
        >
            <defs>
                <marker
                    id="arrowhead"
                    markerWidth="6"
                    markerHeight="6"
                    refX="4"
                    refY="3"
                    orient="auto"
                >
                    <polygon points="0 0, 6 3, 0 6" fill={defaultColor} />
                </marker>
            </defs>
            {arrows.map((a, i) => {
                const { x1, y1, x2, y2 } = getArrowPoints(a.from, a.to, reversed);
                const strokeColor = a.color || defaultColor;

                return (
                    <line
                        key={`${a.from}-${a.to}-${i}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={strokeColor}
                        strokeWidth="16"
                        strokeLinecap="round"
                        markerEnd="url(#arrowhead)"
                    />
                );
            })}
        </svg>
    );
};