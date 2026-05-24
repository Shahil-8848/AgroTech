import { AuthFormField } from '@/components/auth/AuthFormField';
import { ApiError } from '@/services/apiClient';
import * as authService from '@/services/authService';
import { roleLabel, toRegisterRole } from '@/lib/roles';
import { useAuthStore } from '@/store/authStore';
import type { AppRole } from '@/types/api';
import { router, useLocalSearchParams } from 'expo-router';
import { Lock, Mail, Phone, User } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
const PHONE_REGEX = /^(98|97)\d{8}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
const NAME_REGEX = /^[A-Za-z]+(?:\s[A-Za-z]+)+$/;

export default function RegisterScreen() {
  const { role: roleParam } = useLocalSearchParams<{ role?: string }>();
  const role = (roleParam as AppRole) || 'farmer';
  const applyAuthResponse = useAuthStore((s) => s.applyAuthResponse);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const roleTitle = useMemo(() => roleLabel(role), [role]);

  const validate = () => {
    const next: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 6) {
      next.fullName = 'Enter your full name (first and last)';
    } else if (!NAME_REGEX.test(fullName.trim())) {
      next.fullName = 'Use letters only, e.g. Ram Sharma';
    }

    if (!email.trim()) next.email = 'Email is required';

    if (!PHONE_REGEX.test(phoneNumber.trim())) {
      next.phoneNumber = 'Use Nepal format: 98xxxxxxxx or 97xxxxxxxx';
    }

    if (!PASSWORD_REGEX.test(password)) {
      next.password = 'Min 6 chars with at least one letter and one number';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authService.register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        phoneNumber: phoneNumber.trim(),
        role: toRegisterRole(role),
      });
      await applyAuthResponse(response);
      router.replace('/(app)/(tabs)');
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Registration failed. Please try again.';
      Alert.alert('Registration failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Registering as {roleTitle}</Text>

        <View style={styles.form}>
          <AuthFormField
            label="Full name *"
            icon={User}
            placeholder="Ram Sharma"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            error={errors.fullName}
          />
          <AuthFormField
            label="Email *"
            icon={Mail}
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          <AuthFormField
            label="Phone *"
            icon={Phone}
            placeholder="9812345678"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            maxLength={10}
            error={errors.phoneNumber}
          />
          <AuthFormField
            label="Password *"
            icon={Lock}
            placeholder="At least 6 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Create account</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.link}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 24, paddingTop: 56, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1F2937' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 8, marginBottom: 28 },
  form: { gap: 18 },
  button: {
    backgroundColor: '#A4D65E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  link: {
    textAlign: 'center',
    marginTop: 24,
    color: '#A16207',
    fontSize: 15,
    fontWeight: '500',
  },
});
