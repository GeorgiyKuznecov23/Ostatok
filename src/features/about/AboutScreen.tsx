/**
 * Экран «О приложении»: что это за приложение, откуда данные и как устроены ссылки на товары.
 *
 * @module
 */

import Constants from 'expo-constants';
import { ScrollView, StyleSheet, Text } from 'react-native';

/**
 * Экран «О приложении». Только текст, данных с сервера здесь нет.
 *
 * @returns Прокручиваемый экран с описанием приложения.
 */
export function AboutScreen() {
  /** Версия приложения из `app.json`. Если прочитать не получилось — прочерк. */
  const version = Constants.expoConfig?.version ?? '—';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Остаток</Text>
      <Text style={styles.version}>Версия {version}</Text>

      <Text style={styles.text}>
        Справочник товаров и складских остатков для продавцов и товароведов. Найдите товар по
        названию или артикулу, откройте карточку и посмотрите остаток. Товары, которые
        заканчиваются, можно отметить для дозаказа.
      </Text>

      <Text style={styles.heading}>Данные</Text>
      <Text style={styles.text}>
        Товары загружаются из открытого API DummyJSON (dummyjson.com). Это учебные данные, остатки
        не настоящие и не меняются из приложения.
      </Text>

      <Text style={styles.heading}>Ссылка на товар</Text>
      <Text style={styles.text}>
        У каждой карточки есть свой адрес: /topic/номер, например /topic/1. Карточка откроется по
        такой ссылке, даже если каталог ещё не загружен.
      </Text>

      <Text style={styles.footer}>Учебный проект, дисциплина «Разработка мобильных приложений».</Text>
    </ScrollView>
  );
}

/** Оформление экрана: отступы, размеры и цвета текста. */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
  },
  version: {
    marginTop: 2,
    fontSize: 13,
    color: '#999',
  },
  heading: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  text: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },
  footer: {
    marginTop: 24,
    fontSize: 12,
    color: '#999',
  },
});
