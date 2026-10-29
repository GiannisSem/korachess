import { useState, useRef, useEffect } from "react";
import themes from "../assets/themes.json";
import {dropdownListStyle, itemStyle, subLabelStyle, triggerButtonStyle, wrapperStyle} from "../styles/selector.ts"
import type {BoardTheme} from "./ChessBoard";

interface ThemeSelectorProps {
    currentTheme: string;
    onClick: (selectedTheme: string) => void;
}

export default function ThemeSelector({ currentTheme, onClick }: ThemeSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState<string>(currentTheme);
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

    const handleSelect = (theme: string) => {
        setSelectedTheme(theme);
        setIsOpen(false);
        onClick(theme);
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
                    {selectedTheme
                        ? (selectedTheme)
                        : "Select a theme"}
                </span>
                <span style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s" }}>
                    ▼
                </span>
            </button>

            {/* Menu a tendina con scrollbar */}
            {isOpen && (
                <div style={dropdownListStyle}>
                    {/* Voci da Themes.json */}
                    {themes.map((theme: BoardTheme) => {
                        const isSelected = selectedTheme === theme.name;

                        return (
                            <div
                                key={theme.name}
                                onClick={() => handleSelect(theme.name)}
                                style={{
                                    ...itemStyle,
                                    backgroundColor: isSelected ? "#2563eb" : "transparent",
                                    fontWeight: isSelected ? 600 : 400,
                                }}
                            >
                                <span>{theme.name}</span>
                                {theme && (
                                    <span style={subLabelStyle}>{theme.light} {theme.dark}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}