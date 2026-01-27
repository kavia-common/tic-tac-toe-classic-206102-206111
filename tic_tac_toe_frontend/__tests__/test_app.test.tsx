import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import App from '../App';

function tapCell(getByA11yLabel: (label: string) => any, cellNumber1to9: number) {
  fireEvent.press(getByA11yLabel(`Cell ${cellNumber1to9}`));
}

describe('Tic Tac Toe App', () => {
  test('renders initial UI and starts with X turn', () => {
    const { getByRole, getByText } = render(<App />);

    // Title header
    expect(getByRole('header')).toHaveTextContent('TIC TAC TOE');

    // Initial status
    expect(getByText('Turn: X')).toBeTruthy();

    // CLEAR should be disabled when board is empty
    const clearButton = getByText('CLEAR');
    expect(clearButton.parent).toHaveProp('accessibilityState', { disabled: true });
  });

  test('places marks and switches turns X -> O -> X', () => {
    const { getByA11yLabel, getByText } = render(<App />);

    tapCell(getByA11yLabel, 1);
    expect(getByText('Turn: O')).toBeTruthy();

    tapCell(getByA11yLabel, 2);
    expect(getByText('Turn: X')).toBeTruthy();
  });

  test('does not allow overwriting an already selected cell', () => {
    const { getByA11yLabel, getByText } = render(<App />);

    // X plays cell 1
    tapCell(getByA11yLabel, 1);
    expect(getByText('Turn: O')).toBeTruthy();

    // Try to play cell 1 again (should do nothing; still O's turn)
    tapCell(getByA11yLabel, 1);
    expect(getByText('Turn: O')).toBeTruthy();
  });

  test('detects a win and prevents further moves', () => {
    const { getByA11yLabel, getByText, queryByText } = render(<App />);

    // X: 1, O: 4, X: 2, O: 5, X: 3 => X wins on top row
    tapCell(getByA11yLabel, 1);
    tapCell(getByA11yLabel, 4);
    tapCell(getByA11yLabel, 2);
    tapCell(getByA11yLabel, 5);
    tapCell(getByA11yLabel, 3);

    expect(getByText('Winner: X')).toBeTruthy();
    expect(getByText(/Victory!/)).toBeTruthy();

    // Attempt another move after win - should not change state to "Turn: O" etc.
    tapCell(getByA11yLabel, 6);

    // Status remains winner, not a turn indicator
    expect(getByText('Winner: X')).toBeTruthy();
    expect(queryByText(/^Turn:/)).toBeNull();
  });

  test('detects a draw when the board is full with no winner', () => {
    const { getByA11yLabel, getByText, queryByText } = render(<App />);

    // Fill board to a draw respecting turn alternation.
    // Final board:
    // X O X
    // X O O
    // O X X
    tapCell(getByA11yLabel, 1); // X
    tapCell(getByA11yLabel, 2); // O
    tapCell(getByA11yLabel, 3); // X
    tapCell(getByA11yLabel, 5); // O
    tapCell(getByA11yLabel, 4); // X
    tapCell(getByA11yLabel, 6); // O
    tapCell(getByA11yLabel, 8); // X
    tapCell(getByA11yLabel, 7); // O
    tapCell(getByA11yLabel, 9); // X

    expect(getByText('Draw game')).toBeTruthy();
    expect(getByText(/No moves left\./)).toBeTruthy();
    expect(queryByText(/^Winner:/)).toBeNull();
  });

  test('restart/clear resets board and current player to X', () => {
    const { getByA11yLabel, getByText, queryByText } = render(<App />);

    // Make at least one move so CLEAR becomes enabled
    tapCell(getByA11yLabel, 1);
    expect(getByText('Turn: O')).toBeTruthy();

    // CLEAR should now be enabled (accessibilityState.disabled should be false)
    const clearText = getByText('CLEAR');
    expect(clearText.parent).toHaveProp('accessibilityState', { disabled: false });

    // Use CLEAR (same handler as restart)
    fireEvent.press(clearText);

    expect(getByText('Turn: X')).toBeTruthy();
    // After clearing, turn indicator is back and no winner/draw present
    expect(queryByText(/^Winner:/)).toBeNull();
    expect(queryByText('Draw game')).toBeNull();

    // CLEAR should be disabled again on empty board
    const clearTextAfter = getByText('CLEAR');
    expect(clearTextAfter.parent).toHaveProp('accessibilityState', { disabled: true });
  });
});
