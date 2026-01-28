export type Player = 'X' | 'O';
export type Square = Player | null;

export type GameStatus =
  | { type: 'in_progress' }
  | { type: 'winner'; winner: Player; line: [number, number, number] }
  | { type: 'draw' };

const WIN_LINES: ReadonlyArray<[number, number, number]> = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

/**
 * Determine the status of the game for a given board.
 *
 * Board indexes:
 * 0 1 2
 * 3 4 5
 * 6 7 8
 */
export function getGameStatus(board: Square[]): GameStatus {
  for (const [a, b, c] of WIN_LINES) {
    const v = board[a];
    if (v && v === board[b] && v === board[c]) {
      return { type: 'winner', winner: v, line: [a, b, c] };
    }
  }

  const isFull = board.every((sq) => sq !== null);
  if (isFull) return { type: 'draw' };

  return { type: 'in_progress' };
}

/**
 * Attempt to place player's mark on the given index.
 * Returns a new board if move is legal, otherwise null.
 */
export function makeMove(board: Square[], index: number, player: Player): Square[] | null {
  if (index < 0 || index >= board.length) return null;
  if (board[index] !== null) return null;

  const status = getGameStatus(board);
  if (status.type !== 'in_progress') return null;

  const next = board.slice();
  next[index] = player;
  return next;
}
