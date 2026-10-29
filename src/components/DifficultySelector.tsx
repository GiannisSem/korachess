import { useState, useRef, useEffect } from "react";
import ranks from "../assets/ranks.json";
import {dropdownListStyle, itemStyle, subLabelStyle, triggerButtonStyle, wrapperStyle} from "../styles/selector.ts"

interface DifficultySelectorProps {
    onClick: (selectedRank: any | null) => void;
}

export default function DifficultySelector({ onClick }: DifficultySelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRank, setSelectedRank] = useState<any | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (rank: any | null) => {
        setSelectedRank(rank);
        setIsOpen(false);
        onClick(rank);
    };

    return (
        <div ref={dropdownRef} style={wrapperStyle}>
            {/* Bottone selettore */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                style={triggerButtonStyle}
            >
                <span>
                    {selectedRank
                        ? (selectedRank.name || selectedRank.title || `Rank ${selectedRank.id}`)
                        : "Select a rank"}
                </span>
                <span style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s" }}>
                    ▼
                </span>
            </button>

            {/* Menu a tendina con scrollbar */}
            {isOpen && (
                <div style={dropdownListStyle}>
                    {/* Prima opzione: Reset / Null */}
                    <div
                        onClick={() => handleSelect(null)}
                        style={{
                            ...itemStyle,
                            backgroundColor: selectedRank === null ? "#2563eb" : "transparent",
                            fontWeight: selectedRank === null ? 600 : 400,
                            fontStyle: "italic",
                            color: "#9ca3af",
                        }}
                    >
                        <span>Select a rank</span>
                    </div>

                    {/* Voci da ranks.json */}
                    {ranks.map((rank: any) => {
                        const isSelected = selectedRank?.id === rank.id;

                        return (
                            <div
                                key={rank.id}
                                onClick={() => handleSelect(rank)}
                                style={{
                                    ...itemStyle,
                                    backgroundColor: isSelected ? "#2563eb" : "transparent",
                                    fontWeight: isSelected ? 600 : 400,
                                }}
                            >
                                <span>{rank.name || rank.title || `Rank ${rank.id}`}</span>
                                {rank.difficulty && (
                                    <span style={subLabelStyle}>{rank.difficulty}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
