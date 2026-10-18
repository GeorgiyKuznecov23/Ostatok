import { router, Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { topics as demoTopics } from '../data/fixtures';
import { getCategoryLabel } from '../model/categories';
import { getErrorDetails, getErrorMessage } from '../model/errorMessages';
import { useSelection } from '../model/selection';
import type { Topic } from '../model/Topic';
import { parseTopicId } from '../model/topicId';
import { useTopic } from '../model/useTopic';
import { StockBadge } from './StockBadge';
import { LoadingView, MessageView } from './StatusView';
import { TestModePanel } from './TestModePanel';

// Назад к списку, а если истории нет (открыли по ссылке) — в каталог
function goToCatalog() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

export function TopicScreen() {
  const params = useLocalSearchParams<{ id?: string | string[]; demo?: string }>();
  const topicId = parseTopicId(params.id);
  const isDemo = params.demo === '1';

  // Hook вызывается до любых return. В демо-режиме и без корректного id запроса нет.
  const { state, retry } = useTopic(isDemo ? undefined : topicId);
  const selection = useSelection();
  // router.canGoBack() нельзя вызывать до первой отрисовки, поэтому берём навигацию экрана
  const navigation = useNavigation();

  const header = (
    <Stack.Screen
      options={{
        headerLeft: navigation.canGoBack()
          ? undefined
          : () => (
              <Pressable onPress={() => router.replace('/')} hitSlop={10}>
                <Text style={styles.headerLink}>В каталог</Text>
              </Pressable>
            ),
      }}
    />
  );

  const renderTopic = (topic: Topic, demo: boolean) => (
    <TopicInfo
      topic={topic}
      demo={demo}
      selected={selection.selectedIds.includes(topic.id)}
      onToggleSelect={selection.toggleSelected}
    />
  );

  const renderBody = () => {
    if (!topicId) {
      return (
        <MessageView
          title="Неверный номер товара"
          text="Номер товара в адресе должен быть целым числом больше нуля, например /topic/1."
          buttons={[{ label: 'В каталог', onPress: goToCatalog }]}
        />
      );
    }

    if (isDemo) {
      const demoTopic = demoTopics.find((topic) => topic.id === topicId);
      if (demoTopic) return renderTopic(demoTopic, true);
      return (
        <MessageView
          title="Товар не найден"
          text="В демо-данных нет товара с таким номером."
          buttons={[{ label: 'В каталог', onPress: goToCatalog }]}
        />
      );
    }

    if (state.status === 'loading') {
      return <LoadingView text="Загружаем карточку товара…" />;
    }
    if (state.status === 'not_found') {
      return (
        <MessageView
          title="Товар не найден"
          text="На сервере нет товара с таким номером. Возможно, его удалили."
          buttons={[{ label: 'В каталог', onPress: goToCatalog }]}
        />
      );
    }
    if (state.status === 'error') {
      return (
        <MessageView
          title="Не удалось загрузить карточку"
          text={getErrorMessage(state.error)}
          details={getErrorDetails(state.error)}
          buttons={[
            { label: 'Повторить', onPress: retry },
            { label: 'В каталог', onPress: goToCatalog },
          ]}
        />
      );
    }
    return renderTopic(state.topic, false);
  };

  return (
    <View style={styles.container}>
      {header}
      {__DEV__ && (
        <View style={styles.testPanel}>
          <TestModePanel />
        </View>
      )}
      {renderBody()}
    </View>
  );
}

type TopicInfoProps = {
  topic: Topic;
  demo: boolean;
  selected: boolean;
  onToggleSelect: (id: string) => void;
};

function TopicInfo({ topic, demo, selected, onToggleSelect }: TopicInfoProps) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      {demo && <Text style={styles.demo}>Демо-данные</Text>}

      {topic.imageUrl ? (
        <Image source={{ uri: topic.imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>Нет фото</Text>
        </View>
      )}

      <Text style={styles.title}>{topic.title}</Text>
      <Text style={styles.meta}>
        {topic.brand ?? 'Без бренда'} · {getCategoryLabel(topic.category)}
      </Text>

      <View style={styles.stockRow}>
        <Text style={styles.stock}>Остаток: {topic.stock} шт.</Text>
        <StockBadge stock={topic.stock} />
      </View>

      <Row label="Артикул" value={topic.sku} />
      <Row label="Цена" value={`$${topic.price.toFixed(2)}`} />
      <Row
        label="Мин. партия заказа"
        value={topic.minimumOrderQuantity ? `${topic.minimumOrderQuantity} шт.` : 'не указана'}
      />

      <Text style={styles.description}>{topic.description}</Text>

      <Pressable
        onPress={() => onToggleSelect(topic.id)}
        style={[styles.selectButton, selected && styles.selectButtonActive]}
      >
        <Text style={[styles.selectText, selected && styles.selectTextActive]}>
          {selected ? '✓ В дозаказе' : '+ В дозаказ'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  testPanel: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerLink: {
    marginHorizontal: 12,
    fontSize: 16,
    color: '#1565c0',
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  demo: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#fff3e0',
    color: '#e65100',
    fontSize: 12,
    fontWeight: '600',
  },
  image: {
    alignSelf: 'center',
    width: 180,
    height: 180,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 13,
    color: '#999',
  },
  title: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },
  meta: {
    marginTop: 4,
    fontSize: 14,
    color: '#777',
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 8,
  },
  stock: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9e9e9',
  },
  rowLabel: {
    fontSize: 14,
    color: '#777',
  },
  rowValue: {
    fontSize: 14,
    color: '#222',
    fontWeight: '600',
  },
  description: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },
  selectButton: {
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1565c0',
    alignItems: 'center',
  },
  selectButtonActive: {
    backgroundColor: '#1565c0',
  },
  selectText: {
    fontSize: 15,
    color: '#1565c0',
    fontWeight: '600',
  },
  selectTextActive: {
    color: '#fff',
  },
});
