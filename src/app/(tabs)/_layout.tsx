/**
 * Нижние вкладки приложения: «Каталог» и «О приложении».
 * Скобки в имени папки `(tabs)` значат группу: в адрес она не попадает.
 *
 * @module
 */

import { Tabs } from 'expo-router';
import { Text, type ColorValue } from 'react-native';

/**
 * Иконка вкладки. Вместо картинки обычный символ, цвет меняется у активной вкладки.
 *
 * @param props - `symbol` — какой символ нарисовать, `color` — цвет, который передаёт навигатор вкладок.
 * @returns Текст с символом.
 */
function TabIcon({ symbol, color }: { symbol: string; color: ColorValue }) {
  return <Text style={{ fontSize: 18, color }}>{symbol}</Text>;
}

/**
 * Навигатор вкладок. Вкладка `index` — каталог (адрес `/`), вкладка `about` — «О приложении» (адрес `/about`).
 *
 * @returns Нижнюю панель вкладок.
 */
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#1565c0' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Остаток',
          tabBarLabel: 'Каталог',
          tabBarIcon: ({ color }) => <TabIcon symbol="☰" color={color} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'О приложении',
          tabBarIcon: ({ color }) => <TabIcon symbol="ℹ" color={color} />,
        }}
      />
    </Tabs>
  );
}
