/**
 * Корневой layout приложения: самый верхний уровень навигации.
 * Отсюда Expo Router начинает строить все экраны.
 *
 * @module
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { SelectionProvider } from '../features/products/model/selection';

/**
 * Корневой Stack — навигация «стопкой»: новый экран кладётся сверху, «Назад» снимает его.
 *
 * В стопке три экрана: группа вкладок `(tabs)` (каталог и «О приложении»),
 * карточка товара `topic/[id]` и экран неизвестного адреса `+not-found`.
 * Всё обёрнуто в `SelectionProvider`, чтобы отметки «в дозаказ» были общими для всех экранов.
 *
 * @returns Разметку навигации приложения.
 */
export default function RootLayout() {
  return (
    <SelectionProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="topic/[id]" options={{ title: 'Карточка' }} />
        <Stack.Screen name="+not-found" options={{ title: 'Не найдено' }} />
      </Stack>
      <StatusBar style="dark" />
    </SelectionProvider>
  );
}
