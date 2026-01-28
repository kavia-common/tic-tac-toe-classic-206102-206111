import { getGameStatus, makeMove, type Square } from '../src/game/ticTacToe';

describe('ticTacToe game logic', () => {
  test('initial board is in progress', () => {
    const board: Square[] = Array.from({ length: 9 }, () => null);
    expect(getGameStatus(board)).toEqual({ type: 'in_progress' });
  });

  test('detects a winner row', () => {
    const board: Square[] = ['X', 'X', 'X', null, 'O', null, 'O', null, null];
    const status = getGameStatus(board);
    expect(status.type).toBe('winner');
    if (status.type === 'winner') {
      expect(status.winner).toBe('X');
      expect(status.line).toEqual([0, 1, 2]);
    }
  });

  test('detects draw', () => {
    const board: Square[] = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    expect(getGameStatus(board)).toEqual({ type: 'draw' });
  });

  test('makeMove rejects illegal moves', () => {
    const board: Square[] = ['X', null, null, null, null, null, null, null, null];
    expect(makeMove(board, 0, 'O')).toBeNull();
    expect(makeMove(board, 9, 'O')).toBeNull();
  });

  test('makeMove produces a new board', () => {
    const board: Square[] = Array.from({ length: 9 }, () => null);
    const next = makeMove(board, 4, 'X');
    expect(next).not.toBeNull();
    expect(next?.[4]).toBe('X');
    expect(board[4]).toBeNull();
  });
});
