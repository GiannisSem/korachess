import { useState, useRef, useEffect } from "react";
import {dropdownListStyle, itemStyle, triggerButtonStyle, wrapperStyle} from "../styles/selector.ts"

interface SelectorProps {
    firstRowText?: string;
    elements: string[]
    onClick: (selected: any | null) => void;
}

export default function Selector({ firstRowText, elements, onClick }: SelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<any | null>(null);
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

    const handleSelect = (item: any | null) => {
        setSelected(item);
        setIsOpen(false);
        onClick(item);
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
                    {selected
                        ? selected
                        : firstRowText}
                </span>
                <span style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s" }}>
                    ▼
                </span>
            </button>

            {/* Menu a tendina con scrollbar */}
            {isOpen && (
                <div style={dropdownListStyle}>
                    {/* Prima opzione: Reset / Null */}
                    {
                        firstRowText && (
                            <div
                                onClick={() => handleSelect(null)}
                                style={{
                                    ...itemStyle,
                                    backgroundColor: selected === null ? "#2563eb" : "transparent",
                                    fontWeight: selected === null ? 600 : 400,
                                    fontStyle: "italic",
                                    color: "#9ca3af",
                                }}
                            >
                                <span>{firstRowText}</span>
                            </div>
                        )
                    }

                    {/* Voci da items.json */}
                    {elements.map((item: any, index: number) => {
                        const isSelected = selected === item;

                        return (
                            <div
                                key={index}
                                onClick={() => handleSelect(item)}
                                style={{
                                    ...itemStyle,
                                    backgroundColor: isSelected ? "#2563eb" : "transparent",
                                    fontWeight: isSelected ? 600 : 400,
                                }}
                            >
                                <span>{item}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
