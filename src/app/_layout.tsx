import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { SelectionProvider } from '../features/products/model/selection';

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
