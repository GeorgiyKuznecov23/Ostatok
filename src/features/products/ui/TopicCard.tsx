import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Topic } from '../model/Topic';
import { getCategoryLabel } from '../model/categories';
import { StockBadge } from './StockBadge';

export type TopicCardProps = {
  topic: Topic;
  onPress: (id: string) => void;
  showDescription?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
};

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
