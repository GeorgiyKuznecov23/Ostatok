import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

export function LoadingView({ text }: { text: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1565c0" />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

type MessageButton = {
  label: string;
  onPress: () => void;
};

type MessageViewProps = {
  title: string;
  text: string;
  details?: string;
  buttons: MessageButton[];
};

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
