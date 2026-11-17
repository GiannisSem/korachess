import themes from "../assets/themes.json"
import ranks from "../assets/ranks.json"
import type {Level, Match, Rank} from "../types.ts";

export function getTheme(theme_name: string) {
    return themes.find(t => t.name == theme_name);
}

export function getRank(param: string | number): Rank {
    if (typeof param === "string") {
        return ranks.find(r => r.name == param)!
    } else {
        return ranks[param];
    }
}

export function rapid(): Level{
    const raw = localStorage.getItem("rapid");

    if (!raw) {
        const baseLevel: Level = { matches: [], rank: "Bronze I" }
        localStorage.setItem("rapid", JSON.stringify(baseLevel));
        return baseLevel;
    }

    return JSON.parse(raw);
}

export function blitz(): Level {
    const raw = localStorage.getItem("blitz");

    if (!raw) {
        const baseLevel: Level = { matches: [], rank: "Bronze I" }
        localStorage.setItem("blitz", JSON.stringify(baseLevel));
        return baseLevel;
    }

    return JSON.parse(raw);
}

export function lastV(): Match[] {
    const raw = localStorage.getItem("lastV");

    if (!raw) {
        const base: Match[] = [];
        localStorage.setItem("lastV", JSON.stringify(base));
        return base;
    }

    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}