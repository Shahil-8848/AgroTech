import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

interface AuthFormFieldProps extends TextInputProps {
  label: string;
  icon: LucideIcon;
  error?: string;
}

export function AuthFormField({
  label,
  icon: Icon,
  error,
  ...inputProps
}: AuthFormFieldProps) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        <Icon size={20} color="#6B7280" />
        <TextInput
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          {...inputProps}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  error: {
    fontSize: 13,
    color: '#EF4444',
  },
});
