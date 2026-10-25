/**
 * Цветная метка статуса остатка: «В наличии» (зелёная), «Мало» (оранжевая), «Нет» (красная).
 *
 * @module
 */

import { StyleSheet, Text, View } from 'react-native';

import { getStockStatus, type StockStatus } from '../model/stock';

/** Надпись для каждого статуса. */
const statusLabels: Record<StockStatus, string> = {
  in_stock: 'В наличии',
  low_stock: 'Мало',
  out_of_stock: 'Нет',
};

/** Цвет для каждого статуса. */
const statusColors: Record<StockStatus, string> = {
  in_stock: '#2e7d32',
  low_stock: '#ef6c00',
  out_of_stock: '#c62828',
};

/**
 * Метка статуса. Статус считает `getStockStatus` по количеству штук.
 *
 * @param props - `stock` — остаток в штуках.
 * @returns Цветную плашку с надписью.
 */
export function StockBadge({ stock }: { stock: number }) {
  const status = getStockStatus(stock);

  return (
    <View style={[styles.badge, { backgroundColor: statusColors[status] }]}>
      <Text style={styles.text}>{statusLabels[status]}</Text>
    </View>
  );
}

/** Оформление метки. */
const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  text: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
});
