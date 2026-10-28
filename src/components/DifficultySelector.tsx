import { useState, useRef, useEffect } from "react";
import ranks from "../assets/ranks.json";

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

const wrapperStyle: React.CSSProperties = {
    position: "relative",
    width: "240px",
    fontFamily: "system-ui, sans-serif",
};

const triggerButtonStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    backgroundColor: "#1f2937",
    color: "#ffffff",
    border: "1px solid #374151",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "0.95rem",
};

const dropdownListStyle: React.CSSProperties = {
    position: "absolute",
    top: "calc(100% + 6px)",
    left: 0,
    right: 0,
    maxHeight: "220px",
    overflowY: "auto",
    backgroundColor: "#111827",
    border: "1px solid #374151",
    borderRadius: "8px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
    zIndex: 50,
};

const itemStyle: React.CSSProperties = {
    padding: "10px 14px",
    color: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "0.9rem",
    borderBottom: "1px solid #1f2937",
    transition: "background-color 0.15s ease",
};

const subLabelStyle: React.CSSProperties = {
    fontSize: "0.75rem",
    opacity: 0.7,
    marginLeft: "8px",
};