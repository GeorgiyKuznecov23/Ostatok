import { Tabs } from 'expo-router';
import { Text, type ColorValue } from 'react-native';

function TabIcon({ symbol, color }: { symbol: string; color: ColorValue }) {
  return <Text style={{ fontSize: 18, color }}>{symbol}</Text>;
}

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
