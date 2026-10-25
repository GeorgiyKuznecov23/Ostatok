/**
 * Кнопка-«таблетка» для фильтров (категории, «Только заканчивающиеся», тестовый режим).
 *
 * @module
 */

import { Pressable, StyleSheet, Text } from 'react-native';

/** Props чипа. */
export type ChipProps = {
  /** Надпись на чипе. */
  label: string;
  /** Выбран ли чип. Выбранный закрашивается синим. */
  active: boolean;
  /** Что сделать при нажатии. */
  onPress: () => void;
};

/**
 * Чип фильтра. Сам ничего не помнит: выбран он или нет, решает тот, кто его рисует.
 *
 * @param props - Надпись, выбран ли чип и обработчик нажатия.
 * @returns Нажимаемую «таблетку» с текстом.
 */
export function Chip({ label, active, onPress }: ChipProps) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </Pressable>
  );
}

/** Оформление чипа: обычный и выбранный вид. */
const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    backgroundColor: '#fff',
  },
  chipActive: {
    borderColor: '#1565c0',
    backgroundColor: '#1565c0',
  },
  text: {
    fontSize: 13,
    color: '#444',
  },
  textActive: {
    color: '#fff',
    fontWeight: '600',
  },
});
