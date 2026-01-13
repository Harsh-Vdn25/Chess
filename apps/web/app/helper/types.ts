export interface Game {
    id: string,
    playedAt: Date,
    userId1: number,
    userId2: number
}

export interface ProfileType  {
    username: string;
    Avatar: string;
    points: number;
    wins: number;
    losses: number;
    winRate: number;
    games: Game[]
}