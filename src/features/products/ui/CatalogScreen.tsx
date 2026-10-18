import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ListRenderItem,
} from 'react-native';

import { getCategoryLabel } from '../model/categories';
import { getErrorDetails, getErrorMessage } from '../model/errorMessages';
import type { Topic } from '../model/Topic';
import { useCatalog } from '../model/useCatalog';
import { Chip } from './Chip';
import { LoadingView, MessageView } from './StatusView';
import { TestModePanel } from './TestModePanel';
import { TopicCard } from './TopicCard';

// В Hermes есть глобальный объект HermesInternal
const usesHermes = 'HermesInternal' in globalThis;

export function CatalogScreen() {
  const catalog = useCatalog();

  // Защита от двойного нажатия: пока открывается карточка, второй переход не делаем
  const opening = useRef(false);
  useFocusEffect(
    useCallback(() => {
      opening.current = false;
    }, []),
  );

  const openTopic = (id: string) => {
    if (opening.current) return;
    opening.current = true;
    router.push({
      pathname: '/topic/[id]',
      params: catalog.source === 'demo' ? { id, demo: '1' } : { id },
    });
  };

  const renderItem: ListRenderItem<Topic> = ({ item }) => (
    <TopicCard
      topic={item}
      onPress={openTopic}
      selected={catalog.selectedIds.includes(item.id)}
      onToggleSelect={catalog.toggleSelected}
    />
  );

  const renderBody = () => {
    if (catalog.status === 'loading') {
      return <LoadingView text="Загружаем товары с сервера…" />;
    }

    if (catalog.status === 'error' && catalog.error) {
      return (
        <MessageView
          title="Не удалось загрузить товары"
          text={getErrorMessage(catalog.error)}
          details={getErrorDetails(catalog.error)}
          buttons={[
            { label: 'Повторить', onPress: catalog.reload },
            { label: 'Показать демо-данные', onPress: catalog.showDemo },
          ]}
        />
      );
    }

    return (
      <FlatList
        data={catalog.items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        onEndReached={catalog.showMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Ничего не найдено</Text>
            <Text style={styles.emptyText}>
              Нет товаров, подходящих под запрос и фильтры. Проверьте название или сбросьте
              фильтры.
            </Text>
            <Pressable onPress={catalog.resetFilters}>
              <Text style={styles.link}>Сбросить поиск и фильтры</Text>
            </Pressable>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            {catalog.hasMore && (
              <Pressable onPress={catalog.showMore}>
                <Text style={styles.link}>Показать ещё</Text>
              </Pressable>
            )}
            {catalog.foundCount > 0 && (
              <Text style={styles.footerText}>
                Показано {catalog.items.length} из {catalog.foundCount}
              </Text>
            )}
            <Text style={styles.engine}>JS-движок: {usesHermes ? 'Hermes' : 'не Hermes'}</Text>
          </View>
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {__DEV__ && <TestModePanel />}

        {catalog.source === 'demo' && (
          <View style={styles.demoBanner}>
            <Text style={styles.demoText}>
              Демо-данные: сервер недоступен, показаны тестовые товары.
            </Text>
            <Pressable onPress={catalog.reload}>
              <Text style={styles.link}>Вернуться к сети</Text>
            </Pressable>
          </View>
        )}

        <TextInput
          value={catalog.query}
          onChangeText={catalog.setQuery}
          placeholder="Поиск по названию или артикулу"
          placeholderTextColor="#999"
          autoCorrect={false}
          style={styles.search}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={styles.chips}
        >
          <Chip
            label="Все"
            active={catalog.category === null}
            onPress={() => catalog.setCategory(null)}
          />
          {catalog.categories.map((category) => (
            <Chip
              key={category}
              label={getCategoryLabel(category)}
              active={catalog.category === category}
              onPress={() => catalog.setCategory(category)}
            />
          ))}
        </ScrollView>

        <View style={styles.row}>
          <Chip
            label="Только заканчивающиеся"
            active={catalog.lowOnly}
            onPress={catalog.toggleLowOnly}
          />
          {catalog.hasFilters && (
            <Pressable onPress={catalog.resetFilters}>
              <Text style={styles.link}>Сбросить</Text>
            </Pressable>
          )}
        </View>

        {catalog.status === 'success' && (
          <View style={[styles.row, styles.summary]}>
            <Text style={styles.subheading}>
              Найдено: {catalog.foundCount} из {catalog.topics.length}
            </Text>
            {catalog.source === 'network' && (
              <Pressable onPress={catalog.reload}>
                <Text style={styles.link}>Обновить</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>

      {renderBody()}

      <View style={styles.selectionBar}>
        <Text style={styles.selectionText}>
          Отмечено для дозаказа: {catalog.selectedIds.length}
        </Text>
        {catalog.selectedIds.length > 0 && (
          <Pressable onPress={catalog.clearSelected}>
            <Text style={styles.link}>Очистить</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  demoBanner: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff3e0',
  },
  demoText: {
    marginBottom: 4,
    fontSize: 13,
    color: '#e65100',
  },
  search: {
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    backgroundColor: '#fff',
    fontSize: 15,
    color: '#222',
  },
  chips: {
    marginTop: 10,
    flexGrow: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  summary: {
    justifyContent: 'space-between',
  },
  subheading: {
    fontSize: 14,
    color: '#777',
  },
  link: {
    fontSize: 14,
    color: '#1565c0',
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
  },
  emptyText: {
    marginTop: 6,
    marginBottom: 12,
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  footerText: {
    marginTop: 6,
    fontSize: 13,
    color: '#777',
  },
  engine: {
    marginTop: 8,
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
  },
  selectionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e3e3e3',
    backgroundColor: '#fff',
  },
  selectionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
});
