import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth, UserRole } from '../../context/AuthContext';

const ROLES: { label: string; value: UserRole }[] = [
  { label: 'Student', value: 'student' },
  { label: 'Parent', value: 'parent' },
  { label: 'Teacher', value: 'teacher' },
  { label: 'Admin', value: 'admin' },
];

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password, selectedRole);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Login failed. Please check your credentials.';
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Logo / Brand */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoInitials}>KVL</Text>
          </View>
          <Text style={styles.schoolName}>KVL International School</Text>
          <Text style={styles.tagline}>Empowering Minds, Shaping Futures</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign In</Text>

          {/* Role Selector */}
          <Text style={styles.label}>Login As</Text>
          <View style={styles.roleRow}>
            {ROLES.map((r) => (
              <TouchableOpacity
                key={r.value}
                style={[styles.roleBtn, selectedRole === r.value && styles.roleBtnActive]}
                onPress={() => setSelectedRole(r.value)}
              >
                <Text
                  style={[
                    styles.roleBtnText,
                    selectedRole === r.value && styles.roleBtnTextActive,
                  ]}
                >
                  {r.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Email */}
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="you@kvlschool.in"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Enter password"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPassword((v) => !v)}
            >
              <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginBtnText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.forgotText}>Forgot password? Contact your school admin.</Text>
        </View>

        <Text style={styles.footer}>KVL International School © 2025</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const NAVY = '#1e3a5f';
const GOLD = '#c9a84c';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NAVY },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },

  // Logo
  logoSection: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoInitials: { fontSize: 32, fontWeight: '800', color: NAVY },
  schoolName: { fontSize: 22, fontWeight: '700', color: '#fff', textAlign: 'center' },
  tagline: { fontSize: 13, color: '#93b4d4', marginTop: 4, textAlign: 'center' },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTitle: { fontSize: 20, fontWeight: '700', color: NAVY, marginBottom: 20 },

  // Role selector
  roleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  roleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  roleBtnActive: { borderColor: NAVY, backgroundColor: NAVY },
  roleBtnText: { fontSize: 13, color: '#6b7280', fontWeight: '500' },
  roleBtnTextActive: { color: '#fff' },

  // Inputs
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#f9fafb',
    marginBottom: 16,
  },
  passwordRow: { position: 'relative' },
  passwordInput: { paddingRight: 60, marginBottom: 16 },
  eyeBtn: { position: 'absolute', right: 14, top: 13 },
  eyeText: { fontSize: 13, color: NAVY, fontWeight: '600' },

  // Login button
  loginBtn: {
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  loginBtnDisabled: { opacity: 0.7 },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  forgotText: { textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 16 },

  footer: { textAlign: 'center', color: '#4a6a8f', fontSize: 12, marginTop: 32 },
});
