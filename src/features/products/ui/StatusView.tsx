/**
 * Экраны состояний: загрузка и сообщение (ошибка, «не найдено», неверный адрес).
 *
 * @module
 */

import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

/**
 * Индикатор загрузки по центру экрана с подписью.
 *
 * @param props - `text` — подпись под индикатором.
 * @returns Крутящийся индикатор и текст.
 */
export function LoadingView({ text }: { text: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1565c0" />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

/** Кнопка в сообщении. */
export type MessageButton = {
  /** Надпись на кнопке. */
  label: string;
  /** Что сделать при нажатии. */
  onPress: () => void;
};

/** Props сообщения. */
export type MessageViewProps = {
  /** Заголовок, например «Не удалось загрузить товары». */
  title: string;
  /** Пояснение для пользователя. */
  text: string;
  /** Технические подробности мелким шрифтом (код ошибки, номер запроса). Необязательно. */
  details?: string;
  /** Кнопки. Первая — главная (закрашенная), остальные — с рамкой. */
  buttons: MessageButton[];
};

/**
 * Сообщение по центру экрана: заголовок, текст, подробности и кнопки.
 * Используется для ошибок сети, «Товар не найден», «Неверный номер товара» и «Страница не найдена».
 *
 * @param props - Заголовок, текст, подробности и список кнопок.
 * @returns Блок сообщения.
 */
export function MessageView({ title, text, details, buttons }: MessageViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
      {details && <Text style={styles.details}>{details}</Text>}
      {buttons.map((button, index) => (
        <Pressable
          key={button.label}
          onPress={button.onPress}
          style={[styles.button, index > 0 && styles.buttonSecondary]}
        >
          <Text style={[styles.buttonText, index > 0 && styles.buttonTextSecondary]}>
            {button.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

/** Оформление экранов загрузки и сообщения. */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
  },
  text: {
    marginTop: 8,
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  details: {
    marginTop: 6,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
    minWidth: 220,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#1565c0',
    alignItems: 'center',
  },
  buttonSecondary: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1565c0',
  },
  buttonText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#1565c0',
  },
});
