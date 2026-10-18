import { useState, useSyncExternalStore } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  getTestScenario,
  setTestScenario,
  subscribeTestScenario,
  testScenarios,
} from '../../../shared/api/testMode';
import { Chip } from './Chip';

// Панель для проверки ошибок сети. Показывается только в режиме разработки.
export function TestModePanel() {
  const [open, setOpen] = useState(false);
  const scenario = useSyncExternalStore(subscribeTestScenario, getTestScenario);

  const currentLabel = testScenarios.find((item) => item.id === scenario)?.label ?? scenario;
  const active = scenario !== 'off';

  return (
    <View style={[styles.panel, active && styles.panelActive]}>
      <Pressable onPress={() => setOpen((prev) => !prev)}>
        <Text style={[styles.title, active && styles.titleActive]}>
          Тестовый режим сети: {currentLabel} {open ? '▾' : '▸'}
        </Text>
      </Pressable>

      {open && (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
            {testScenarios.map((item) => (
              <Chip
                key={item.id}
                label={item.label}
                active={scenario === item.id}
                onPress={() => setTestScenario(item.id)}
              />
            ))}
          </ScrollView>
          <Text style={styles.hint}>
            Ответы сервера подменяются. Чтобы проверить, нажмите «Обновить», «Повторить» или откройте карточку.
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    marginBottom: 10,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#bbb',
  },
  panelActive: {
    borderColor: '#c62828',
    backgroundColor: '#fdecea',
  },
  title: {
    fontSize: 12,
    color: '#777',
  },
  titleActive: {
    color: '#c62828',
    fontWeight: '600',
  },
  chips: {
    marginTop: 8,
    flexGrow: 0,
  },
  hint: {
    marginTop: 6,
    fontSize: 11,
    color: '#777',
  },
});
