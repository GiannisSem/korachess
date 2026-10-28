import { useState } from "react";
import bK from "../assets/pieces/bK.svg";
import wK from "../assets/pieces/wK.svg";
import type {Color} from "chess.js";

interface ColorSelectorProps {
    onClick: (color: Color | undefined) => void;
}

export default function ColorSelector({ onClick }: ColorSelectorProps) {
    const [selectedColor, setSelectedColor] = useState<Color | undefined>(undefined);

    const handleSelect = (color: Color | undefined) => {
        setSelectedColor(color);
        onClick(color);
    };

    return (
        <div style={containerStyle}>
            {/* Bianco */}
            <button
                type="button"
                onClick={() => handleSelect("w")}
                style={{
                    ...buttonStyle,
                    borderColor: selectedColor === "w" ? "#3b82f6" : "#374151",
                    backgroundColor: selectedColor === "w" ? "#1e293b" : "#111827",
                }}
                title="Gioca col Bianco"
            >
                <img src={wK} alt="Re Bianco" style={iconStyle} />
            </button>

            {/* Random */}
            <button
                type="button"
                onClick={() => handleSelect(undefined)}
                style={{
                    ...buttonStyle,
                    borderColor: selectedColor === undefined ? "#3b82f6" : "#374151",
                    backgroundColor: selectedColor === undefined ? "#1e293b" : "#111827",
                }}
                title="Colore Casuale"
            >
                <div style={randomIconWrapperStyle}>
                    <img src={wK} alt="Bianco" style={halfIconWhiteStyle} />
                    <img src={bK} alt="Nero" style={halfIconBlackStyle} />
                </div>
            </button>

            {/* Nero */}
            <button
                type="button"
                onClick={() => handleSelect("b")}
                style={{
                    ...buttonStyle,
                    borderColor: selectedColor === "b" ? "#3b82f6" : "#374151",
                    backgroundColor: selectedColor === "b" ? "#1e293b" : "#111827",
                }}
                title="Gioca col Nero"
            >
                <img src={bK} alt="Re Nero" style={iconStyle} />
            </button>
        </div>
    );
}

// Stili inline
const containerStyle: React.CSSProperties = {
    display: "inline-flex",
    gap: "10px",
    padding: "6px",
    backgroundColor: "#0f172a",
    borderRadius: "12px",
    border: "1px solid #1e293b",
};

const buttonStyle: React.CSSProperties = {
    width: "56px",
    height: "56px",
    borderRadius: "8px",
    border: "2px solid transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    padding: 0,
};

const iconStyle: React.CSSProperties = {
    width: "36px",
    height: "36px",
    userSelect: "none",
};

// Effetto split metà e metà per il pulsante Random
const randomIconWrapperStyle: React.CSSProperties = {
    position: "relative",
    width: "36px",
    height: "36px",
};

const halfIconWhiteStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "36px",
    height: "36px",
    clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
};

const halfIconBlackStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "36px",
    height: "36px",
    clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
};