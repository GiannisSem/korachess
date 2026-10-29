import { useState, useRef, useEffect } from "react";
import themes from "../assets/themes.json";
import {dropdownListStyle, itemStyle, subLabelStyle, triggerButtonStyle, wrapperStyle} from "../styles/selector.ts"

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
                    {themes.map((theme: any) => {
                        const isSelected = selectedTheme === theme;

                        return (
                            <div
                                key={theme}
                                onClick={() => handleSelect(theme)}
                                style={{
                                    ...itemStyle,
                                    backgroundColor: isSelected ? "#2563eb" : "transparent",
                                    fontWeight: isSelected ? 600 : 400,
                                }}
                            >
                                <span>{theme}</span>
                                {theme && (
                                    <span style={subLabelStyle}>{theme}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}