import { createContext, useContext, useState, type ReactNode } from 'react';

type Selection = {
  selectedIds: string[];
  toggleSelected: (id: string) => void;
  clearSelected: () => void;
};

const SelectionContext = createContext<Selection | null>(null);

// Отметки для дозаказа нужны и в каталоге, и в карточке. Это разные экраны,
// поэтому state хранится в Provider над навигацией.
export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const clearSelected = () => setSelectedIds([]);

  return (
    <SelectionContext.Provider value={{ selectedIds, toggleSelected, clearSelected }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection(): Selection {
  const selection = useContext(SelectionContext);
  if (!selection) throw new Error('useSelection must be used inside SelectionProvider');
  return selection;
}
