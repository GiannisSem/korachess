export type LeagueTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master';
export type SubRank = 1 | 2 | 3;

export interface Rank {
    id: string;
    league: LeagueTier;
    sub_rank: SubRank;
    name: string;
    elo: number;
    depth: number;
    rankUpScore: number;
    rankDownScore: number;
    icon: string;
}

export interface MatchHistoryEntry {
    gameIndex: number;        // 1 a 6
    playerColor: 'w' | 'b';
    result: 1 | 0.5 | 0;      // W, Draw, L
    pgn: string;
}