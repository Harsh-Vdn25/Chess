export interface Game {
    id: string,
    playedAt: Date,
    userId1: number,
    userId2: number
}

export interface ProfileType  {
    username: string,
    points: number,
    games: Game[]
}