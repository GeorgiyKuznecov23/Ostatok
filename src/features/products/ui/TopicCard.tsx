/**
 * Карточка одного товара в списке каталога.
 *
 * @module
 */

import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Topic } from '../model/Topic';
import { getCategoryLabel } from '../model/categories';
import { StockBadge } from './StockBadge';

/** Props карточки — всё, что она получает снаружи. */
export type TopicCardProps = {
  /** Товар, который нужно показать. Обязательный. */
  topic: Topic;
  /** Что сделать при нажатии на карточку. Получает номер товара. Обязательный. */
  onPress: (id: string) => void;
  /** Показывать ли описание. Необязательный, по умолчанию `true`. */
  showDescription?: boolean;
  /** Отмечен ли товар «в дозаказ». По умолчанию `false`. */
  selected?: boolean;
  /** Что сделать при нажатии «В дозаказ». Если не передан, кнопки нет. */
  onToggleSelect?: (id: string) => void;
};

/**
 * Переиспользуемая карточка товара: картинка или заглушка, название, категория, артикул,
 * описание, остаток, цена, цветная метка статуса и кнопка «В дозаказ».
 *
 * Карточка ничего не знает о том, откуда взялся товар: всё приходит через props.
 * При нажатии отдаёт наружу только номер товара, а что с ним делать, решает экран.
 *
 * @param props - Товар и обработчики нажатий.
 * @returns Нажимаемую карточку.
 */
export function TopicCard({
  topic,
  onPress,
  showDescription = true,
  selected = false,
  onToggleSelect,
}: TopicCardProps) {
  return (
    <Pressable
      onPress={() => onPress(topic.id)}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        pressed && styles.cardPressed,
      ]}
    >
      {topic.imageUrl ? (
        <Image source={{ uri: topic.imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>Нет фото</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {topic.title}
        </Text>
        <Text style={styles.meta}>
          {getCategoryLabel(topic.category)} · {topic.sku}
        </Text>

        {showDescription && (
          <Text style={styles.description} numberOfLines={2}>
            {topic.description}
          </Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.stock}>{topic.stock} шт.</Text>
          <Text style={styles.price}>${topic.price.toFixed(2)}</Text>
          <View style={styles.badge}>
            <StockBadge stock={topic.stock} />
          </View>
        </View>

        {onToggleSelect && (
          <Pressable
            onPress={() => onToggleSelect(topic.id)}
            style={[styles.selectButton, selected && styles.selectButtonActive]}
          >
            <Text style={[styles.selectText, selected && styles.selectTextActive]}>
              {selected ? '✓ В дозаказе' : '+ В дозаказ'}
            </Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

/** Оформление карточки: обычный, отмеченный и нажатый вид. */
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e3e3e3',
  },
  cardSelected: {
    borderColor: '#1565c0',
    backgroundColor: '#f1f6fd',
  },
  cardPressed: {
    opacity: 0.7,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 11,
    color: '#999',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  meta: {
    marginTop: 2,
    fontSize: 12,
    color: '#777',
  },
  description: {
    marginTop: 6,
    fontSize: 13,
    color: '#555',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  stock: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },
  price: {
    marginLeft: 10,
    fontSize: 13,
    color: '#777',
  },
  badge: {
    marginLeft: 'auto',
  },
  selectButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1565c0',
  },
  selectButtonActive: {
    backgroundColor: '#1565c0',
  },
  selectText: {
    fontSize: 13,
    color: '#1565c0',
    fontWeight: '600',
  },
  selectTextActive: {
    color: '#fff',
  },
});
