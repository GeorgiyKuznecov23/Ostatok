/**
 * Общие отметки «в дозаказ».
 * Каталог и карточка — разные экраны, у каждого свой state.
 * Чтобы отметка из карточки была видна в каталоге, список хранится в Provider над навигацией.
 *
 * @module
 */

import { createContext, useContext, useState, type ReactNode } from 'react';

/** Что Provider даёт экранам: список отмеченных и функции для его изменения. */
export type Selection = {
  /** Номера отмеченных товаров. */
  selectedIds: string[];
  /** Отметить товар или снять отметку, если он уже отмечен. */
  toggleSelected: (id: string) => void;
  /** Снять все отметки. */
  clearSelected: () => void;
};

/**
 * Context React — «канал», через который Provider передаёт данные вложенным экранам.
 * Пока Provider не подключён, значение `null`.
 */
const SelectionContext = createContext<Selection | null>(null);

/**
 * Хранит отметки «в дозаказ» и раздаёт их всем экранам внутри себя.
 * Подключён в корневом `_layout.tsx`, поэтому доступен везде.
 *
 * @param props - `children` — всё приложение, которое оборачивает Provider.
 * @returns Provider с отметками.
 */
export function SelectionProvider({ children }: { children: ReactNode }) {
  /** Список номеров отмеченных товаров (state). */
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  /**
   * Отметить или снять отметку.
   * State не меняется напрямую: всегда создаётся новый массив — без этого номера (`filter`) или с ним (`[...prev, id]`).
   * React замечает изменение только по новому массиву. Проверка `includes` не даёт отметить товар дважды.
   */
  const toggleSelected = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  /** Снять все отметки: кладём новый пустой массив. */
  const clearSelected = () => setSelectedIds([]);

  return (
    <SelectionContext.Provider value={{ selectedIds, toggleSelected, clearSelected }}>
      {children}
    </SelectionContext.Provider>
  );
}

/**
 * Хук для экранов: достаёт отметки из Provider.
 *
 * @returns Список отметок и функции для их изменения.
 * @throws Ошибку, если экран оказался вне `SelectionProvider` — так проще сразу заметить ошибку в разметке.
 */
export function useSelection(): Selection {
  const selection = useContext(SelectionContext);
  if (!selection) throw new Error('useSelection must be used inside SelectionProvider');
  return selection;
}
