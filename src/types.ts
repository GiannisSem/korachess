//export type LeagueTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master';
//export type SubRank = 1 | 2 | 3;

export interface Rank {
    id: number;
    league: string;
    sub_rank: number;
    name: string;
    elo: number;
    depth: number;
    rankUpScore: number;
    rankDownScore: number;
    icon: string;
}

export interface Match {
    playerColor: 'w' | 'b';
    result: 1 | 0.5 | 0;      // W, Draw, L
    pgn: string;
}

export interface Level {
    matches: Match[];
    rank: string;
}

// localStorage
// username, theme, rapid: Level, blitz: Level, lastV: FinishedGame[]
export interface CurrentGame {
    playerColor: 'w' | 'b';
    fen: string;
}