/**
 * Панель тестового режима сети. Видна только при разработке (в Expo Go), в собранном приложении её нет.
 *
 * @module
 */

import { useState, useSyncExternalStore } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  getTestScenario,
  setTestScenario,
  subscribeTestScenario,
  testScenarios,
} from '../../../shared/api/testMode';
import { Chip } from './Chip';

/**
 * Панель выбора тестового сценария: медленный ответ, задержка 12 с, 404, нет сети, битый JSON, битый DTO.
 * Нужна, чтобы показать обработку ошибок без отключения интернета.
 * Сама подмена ответов происходит в `testMode.ts`, панель только выбирает сценарий.
 *
 * @returns Сворачиваемую панель с чипами сценариев.
 */
export function TestModePanel() {
  /** Раскрыта ли панель (state). */
  const [open, setOpen] = useState(false);
  /**
   * Текущий сценарий. `useSyncExternalStore` подписывается на изменения в `testMode.ts`,
   * поэтому панели в каталоге и в карточке всегда показывают одно и то же.
   */
  const scenario = useSyncExternalStore(subscribeTestScenario, getTestScenario);

  /** Русское название текущего сценария для заголовка панели. */
  const currentLabel = testScenarios.find((item) => item.id === scenario)?.label ?? scenario;
  /** Включена ли подмена. Если да — панель красная. */
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

/** Оформление панели: обычный и «включённый» (красный) вид. */
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
