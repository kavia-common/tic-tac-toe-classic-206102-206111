import React, { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { getGameStatus, makeMove, type Player, type Square } from '../src/game/ticTacToe';

const EMPTY_BOARD: Square[] = Array.from({ length: 9 }, () => null);

function playerLabel(p: Player) {
  return p === 'X' ? 'X' : 'O';
}

// PUBLIC_INTERFACE
export default function HomeScreen() {
  /** Main game screen: renders the board, turn indicator, winner/draw, and restart. */
  const [board, setBoard] = useState<Square[]>(EMPTY_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');

  const status = useMemo(() => getGameStatus(board), [board]);

  const canPlay = status.type === 'in_progress';

  const onPressSquare = (index: number) => {
    if (!canPlay) return;

    const next = makeMove(board, index, currentPlayer);
    if (!next) return;

    setBoard(next);
    setCurrentPlayer((p) => (p === 'X' ? 'O' : 'X'));
  };

  const onRestart = () => {
    setBoard(EMPTY_BOARD);
    setCurrentPlayer('X');
  };

  const headline = (() => {
    switch (status.type) {
      case 'in_progress':
        return `Turn: ${playerLabel(currentPlayer)}`;
      case 'winner':
        return `Winner: ${playerLabel(status.winner)}`;
      case 'draw':
        return 'Draw';
    }
  })();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text accessibilityRole="header" style={styles.title}>
          Tic Tac Toe
        </Text>

        <Text style={styles.subtitle} accessibilityLiveRegion="polite">
          {headline}
        </Text>

        <View style={styles.board} accessibilityRole="grid">
          {board.map((value, idx) => {
            const disabled = !canPlay || value !== null;
            return (
              <Pressable
                key={idx}
                accessibilityRole="button"
                accessibilityLabel={`Square ${idx + 1}`}
                accessibilityState={{ disabled }}
                onPress={() => onPressSquare(idx)}
                disabled={disabled}
                style={({ pressed }) => [
                  styles.square,
                  disabled ? styles.squareDisabled : null,
                  pressed && !disabled ? styles.squarePressed : null
                ]}
              >
                <Text style={styles.squareText}>{value ?? ''}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable accessibilityRole="button" onPress={onRestart} style={styles.restartBtn}>
          <Text style={styles.restartText}>Restart</Text>
        </Pressable>

        <Text style={styles.hint}>
          Two players on the same device. Tap an empty square to place your mark.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9fafb' },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 16
  },
  board: {
    width: 320,
    height: 320,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2
  },
  square: {
    width: '33.3333%',
    height: '33.3333%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  squarePressed: { backgroundColor: 'rgba(59,130,246,0.08)' },
  squareDisabled: { backgroundColor: '#f8fafc' },
  squareText: {
    fontSize: 56,
    fontWeight: '700',
    color: '#111827'
  },
  restartBtn: {
    marginTop: 18,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12
  },
  restartText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  hint: { marginTop: 12, fontSize: 12, color: '#64748b', textAlign: 'center' }
});
