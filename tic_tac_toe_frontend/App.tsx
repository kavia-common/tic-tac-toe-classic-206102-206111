import React, { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

type Player = 'X' | 'O';
type CellValue = Player | null;
type Winner = Player | null;

/**
 * Determine the winner for a 3x3 tic-tac-toe board.
 */
function getWinner(board: CellValue[]): Winner {
  const lines: Array<[number, number, number]> = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    const v = board[a];
    if (v && v === board[b] && v === board[c]) return v;
  }
  return null;
}

/**
 * Determine whether the game is a draw (board full with no winner).
 */
function isDraw(board: CellValue[], winner: Winner): boolean {
  if (winner) return false;
  return board.every((c) => c !== null);
}

/**
 * Retro-themed button.
 */
function RetroButton(props: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: 'primary' | 'neutral';
}) {
  const { label, onPress, disabled, tone = 'primary' } = props;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        tone === 'primary' ? styles.buttonPrimary : styles.buttonNeutral,
        disabled ? styles.buttonDisabled : null,
        pressed && !disabled ? styles.buttonPressed : null,
      ]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

function getStatusText(params: {
  winner: Winner;
  draw: boolean;
  currentPlayer: Player;
  gameOver: boolean;
}): string {
  const { winner, draw, currentPlayer, gameOver } = params;

  if (winner) return `Winner: ${winner}`;
  if (draw) return `Draw game`;
  if (gameOver) return `Game over`;
  return `Turn: ${currentPlayer}`;
}

// PUBLIC_INTERFACE
export default function App() {
  /** Main entry point for the Expo Tic Tac Toe app. Renders board UI and manages game state. */
  const { width } = useWindowDimensions();

  const [board, setBoard] = useState<CellValue[]>(Array.from({ length: 9 }, () => null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');

  const winner = useMemo(() => getWinner(board), [board]);
  const draw = useMemo(() => isDraw(board, winner), [board, winner]);
  const gameOver = winner !== null || draw;

  const boardSize = Math.min(width - 48, 360);
  const cellSize = Math.floor(boardSize / 3);

  const statusText = getStatusText({ winner, draw, currentPlayer, gameOver });

  const onPressCell = (index: number) => {
    if (gameOver) return;
    if (board[index] !== null) return;

    setBoard((prev) => {
      const next = [...prev];
      next[index] = currentPlayer;
      return next;
    });

    setCurrentPlayer((p) => (p === 'X' ? 'O' : 'X'));
  };

  const restart = () => {
    setBoard(Array.from({ length: 9 }, () => null));
    setCurrentPlayer('X');
  };

  const cellValueColor = (v: CellValue) => {
    if (v === 'X') return styles.cellValueX;
    if (v === 'O') return styles.cellValueO;
    return undefined;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text accessibilityRole="header" style={styles.title}>
            TIC TAC TOE
          </Text>
          <Text style={styles.subtitle}>Retro Classic • Local 2P</Text>
        </View>

        <View style={styles.statusCard} accessibilityLiveRegion="polite">
          <View style={styles.statusRow}>
            <View style={styles.statusDotOuter}>
              <View
                style={[
                  styles.statusDotInner,
                  winner ? styles.dotWinner : draw ? styles.dotDraw : styles.dotPlaying,
                ]}
              />
            </View>

            <Text style={styles.statusText}>{statusText}</Text>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>3×3</Text>
            </View>
          </View>

          {!gameOver ? (
            <Text style={styles.statusHint}>Tap an empty tile to place your mark.</Text>
          ) : (
            <Text style={styles.statusHint}>
              {winner ? 'Victory!' : 'No moves left.'} Press restart to play again.
            </Text>
          )}
        </View>

        <View
          style={[
            styles.boardFrame,
            { width: boardSize, height: boardSize, padding: 8 },
            gameOver ? styles.boardFrameOver : null,
          ]}
        >
          <View style={[styles.board, { width: boardSize - 16, height: boardSize - 16 }]}>
            {board.map((value, idx) => {
              const disabled = gameOver || value !== null;
              return (
                <Pressable
                  key={idx}
                  onPress={() => onPressCell(idx)}
                  disabled={disabled}
                  accessibilityRole="button"
                  accessibilityLabel={`Cell ${idx + 1}`}
                  accessibilityHint={disabled ? 'Unavailable' : 'Place your mark'}
                  accessibilityState={{ disabled, selected: value !== null }}
                  style={({ pressed }) => [
                    styles.cell,
                    { width: cellSize - 8, height: cellSize - 8 },
                    pressed && !disabled ? styles.cellPressed : null,
                    disabled && value === null ? styles.cellDisabled : null,
                  ]}
                >
                  <Text style={[styles.cellValue, cellValueColor(value)]}>{value ?? ''}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.controls}>
          <RetroButton
            label={gameOver ? 'RESTART' : 'RESTART'}
            onPress={restart}
            tone="primary"
          />
          <RetroButton
            label="CLEAR"
            onPress={restart}
            tone="neutral"
            disabled={board.every((c) => c === null)}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Accents: <Text style={styles.accentPrimary}>#3b82f6</Text> &{' '}
            <Text style={styles.accentSuccess}>#06b6d4</Text>
          </Text>
        </View>

        <StatusBar style="dark" />
      </View>
    </SafeAreaView>
  );
}

const THEME = {
  bg: '#f9fafb',
  surface: '#ffffff',
  text: '#111827',
  secondary: '#64748b',
  primary: '#3b82f6',
  success: '#06b6d4',
  error: '#EF4444',
  // Retro-ish ink + shadow
  ink: '#0f172a',
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: THEME.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    alignItems: 'center',
    gap: 14,
    backgroundColor: THEME.bg,
  },

  header: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 8,
    gap: 4,
  },
  title: {
    color: THEME.text,
    fontSize: 28,
    letterSpacing: 3,
    fontWeight: '900',
  },
  subtitle: {
    color: THEME.secondary,
    fontSize: 12,
    letterSpacing: 1.2,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  statusCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: THEME.surface,
    borderWidth: 2,
    borderColor: THEME.ink,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    shadowColor: THEME.ink,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    gap: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusDotOuter: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: THEME.ink,
    backgroundColor: THEME.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDotInner: {
    width: 9,
    height: 9,
    borderRadius: 3,
  },
  dotPlaying: { backgroundColor: THEME.primary },
  dotWinner: { backgroundColor: THEME.success },
  dotDraw: { backgroundColor: THEME.secondary },

  statusText: {
    flex: 1,
    color: THEME.text,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  statusHint: {
    color: THEME.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: THEME.ink,
    backgroundColor: '#ffffff',
  },
  badgeText: {
    color: THEME.text,
    fontWeight: '900',
    letterSpacing: 1,
    fontSize: 11,
  },

  boardFrame: {
    borderWidth: 3,
    borderColor: THEME.ink,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    shadowColor: THEME.ink,
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  boardFrameOver: {
    borderColor: THEME.secondary,
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cell: {
    borderWidth: 2,
    borderColor: THEME.ink,
    borderRadius: 14,
    backgroundColor: THEME.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellPressed: {
    transform: [{ translateY: 1 }],
    backgroundColor: '#e5efff',
  },
  cellDisabled: {
    opacity: 0.6,
  },

  cellValue: {
    fontSize: 44,
    fontWeight: '900',
    color: THEME.text,
    letterSpacing: 2,
    lineHeight: 52,
  },
  cellValueX: {
    color: THEME.primary,
  },
  cellValueO: {
    color: THEME.success,
  },

  controls: {
    width: '100%',
    maxWidth: 420,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: THEME.ink,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.ink,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  buttonPrimary: {
    backgroundColor: THEME.primary,
  },
  buttonNeutral: {
    backgroundColor: THEME.surface,
  },
  buttonPressed: {
    transform: [{ translateY: 1 }],
    shadowOpacity: 0.06,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: THEME.text,
    fontWeight: '900',
    letterSpacing: 2,
  },

  footer: {
    marginTop: 'auto',
    paddingBottom: 12,
  },
  footerText: {
    color: THEME.secondary,
    fontSize: 11,
    fontWeight: '600',
  },
  accentPrimary: {
    color: THEME.primary,
    fontWeight: '900',
  },
  accentSuccess: {
    color: THEME.success,
    fontWeight: '900',
  },
});
