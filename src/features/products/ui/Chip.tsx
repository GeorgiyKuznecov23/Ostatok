import { Pressable, StyleSheet, Text } from 'react-native';

type ChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export function Chip({ label, active, onPress }: ChipProps) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    backgroundColor: '#fff',
  },
  chipActive: {
    borderColor: '#1565c0',
    backgroundColor: '#1565c0',
  },
  text: {
    fontSize: 13,
    color: '#444',
  },
  textActive: {
    color: '#fff',
    fontWeight: '600',
  },
});
