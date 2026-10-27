import { useState } from "react";
import "./VModeSelector.css";

const DEFAULT_OPTIONS = ["ranked", "free", "openings", "settings"];

const MODE_LABELS: Record<string, string> = {
    ranked: "Ranked",
    free: "Free play",
    openings: "Openings",
    settings: "Settings",
};

interface VModeSelectorProps {
    options?: string[];
    onChange?: (value: string) => void;
}

function VModeSelector({options = DEFAULT_OPTIONS, onChange}: VModeSelectorProps) {
    const [selectedValue, setSelectedValue] = useState<string>(options[0] ?? DEFAULT_OPTIONS[0]);

    const handleSelect = (value: string) => {
        setSelectedValue(value);
        onChange?.(value);
    };

    return (
        <div className="radio-container" role="radiogroup" aria-label="Game modes">
            <div className="sidebar-heading">Modes</div>
            {options.map((option) => {
                const isSelected = selectedValue === option;
                const label = MODE_LABELS[option] ?? option;

                return (
                    <button
                        key={option}
                        type="button"
                        className={`mode-option ${isSelected ? "selected" : ""}`}
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => handleSelect(option)}
                    >
                        <span className="mode-label">{label}</span>
                    </button>
                );
            })}
        </div>
    );
}

export default VModeSelector;