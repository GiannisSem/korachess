export type LeagueTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master';
export type SubRank = 1 | 2 | 3;

export interface Rank {
    id: number;
    league: LeagueTier;
    sub_rank: SubRank;
    name: string;
    elo: number;
    depth: number;
    rankUpScore: number;
    rankDownScore: number;
    icon: string;
}

export interface Match {
    gameIndex: number;        // 1 a 6
    playerColor: 'w' | 'b';
    result: 1 | 0.5 | 0;      // W, Draw, L
    pgn: string;
}

export interface Level {
    matches: Match[];
    rank_id: number;
}

// localStorage
// username, theme, rapid: Level, blitz: Level
export interface CurrentGame_LS {
    playerColor: 'w' | 'b';
    pgn: string;
}

export interface LastFiveGames_LS {
    results: (1 | 0.5 | 0)[]
    colors: ('w' | 'b')[]
}