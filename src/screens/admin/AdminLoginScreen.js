import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import logo from "../../../assets/coderzhive-dark.png";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContext } from '../../context/NavigationContext';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
const api = require('../../../apis/api');

export default function AdminLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const { navigate, goBack } = useContext(NavigationContext);
  const { loginUser, switchUserType } = useContext(AuthContext);
  const { darkMode, lightTheme, darkTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const colors = darkMode ? darkTheme : lightTheme;
  const isDark = darkMode;

  async function onLogin() {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    setIsLoggingIn(true);
    try {
      await switchUserType('admin');
      const response = await fetch(api.loginAPI, {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, userType: 'admin' }),
      });
      if (!response.ok) {
        let errMsg = `HTTP error! status: ${response.status}`;
        try {
          const errData = await response.json();
          if (errData?.message) errMsg = errData.message;
        } catch { }
        throw new Error(errMsg);
      }
      const data = await response.json();
      const responseData = data.data || data;
      const accessToken = responseData.accessToken || responseData.token;
      const refreshToken = responseData.refreshToken;
      const userData = responseData.user || { email };
      await loginUser(userData, accessToken, refreshToken, 'admin');
      navigate('AdminPanel');
    } catch (err) {
      alert('Login failed: ' + err.message);
    } finally {
      setIsLoggingIn(false);
    }
  }

  const inputStyle = (field) => [
    styles.input,
    {
      backgroundColor: isDark ? '#1a2a3a' : '#f1f5f9',
      borderColor: focusedField === field
        ? '#0ea5e9'
        : isDark ? '#2a3a4a' : '#e2e8f0',
      color: isDark ? '#e2e8f0' : '#1e293b',
    },
  ];

  return (
    <View style={[styles.root, { backgroundColor: isDark ? '#0a1628' : '#f8fafc' }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Seamless Status Bar Background */}
      <View style={{ height: insets.top, backgroundColor: '#0a1628' }} />

      {/* Top strip */}
      <View style={[styles.topStrip, { backgroundColor: '#0a1628' }]}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn} disabled={isLoggingIn}>
          <View style={styles.backArrow} />
          <Text style={styles.backLabel}>Home</Text>
        </TouchableOpacity>
        <View style={styles.brandContainer}>
          <Image source={logo} style={styles.officialLogo} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Card ── */}
          <View style={[styles.card, {
            backgroundColor: isDark ? '#111c2d' : '#ffffff',
            borderColor: isDark ? '#1e3a5f' : '#e2e8f0',
            shadowColor: isDark ? '#000' : '#94a3b8',
          }]}>

            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.cardIconWrap}>
                <View style={styles.cardIconShield}>
                  <View style={styles.cardIconDot} />
                </View>
              </View>
              <Text style={[styles.cardTitle, { color: isDark ? '#f1f5f9' : '#0f172a' }]}>
                Admin Login
              </Text>
              <Text style={[styles.cardSubtitle, { color: isDark ? '#64748b' : '#94a3b8' }]}>
                Sign in to the CoderZhive admin portal
              </Text>
            </View>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: isDark ? '#1e3a5f' : '#f1f5f9' }]} />

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: isDark ? '#94a3b8' : '#475569' }]}>
                EMAIL ADDRESS
              </Text>
              <TextInput
                style={inputStyle('email')}
                placeholder="admin@coderzhive.com"
                placeholderTextColor={isDark ? '#334a5e' : '#94a3b8'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoggingIn}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: isDark ? '#94a3b8' : '#475569' }]}>
                PASSWORD
              </Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[inputStyle('password'), { flex: 1, marginBottom: 0 }]}
                  placeholder="Enter your password"
                  placeholderTextColor={isDark ? '#334a5e' : '#94a3b8'}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!isLoggingIn}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                <TouchableOpacity
                  style={[styles.eyeBtn, { backgroundColor: isDark ? '#1a2a3a' : '#f1f5f9', borderColor: isDark ? '#2a3a4a' : '#e2e8f0' }]}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={{ color: '#0ea5e9', fontSize: 12, fontWeight: '700' }}>
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[
                styles.submitBtn,
                { opacity: isLoggingIn ? 0.7 : 1 },
              ]}
              onPress={onLogin}
              disabled={isLoggingIn}
              activeOpacity={0.85}
            >
              <View style={styles.submitBtnInner}>
                {isLoggingIn ? (
                  <>
                    <ActivityIndicator size="small" color="#fff" style={{ marginRight: 10 }} />
                    <Text style={styles.submitBtnText}>Authenticating...</Text>
                  </>
                ) : (
                  <Text style={styles.submitBtnText}>Sign In</Text>
                )}
              </View>
            </TouchableOpacity>

            {/* Security note */}
            <View style={[styles.securityNote, { backgroundColor: isDark ? '#0a1e30' : '#f0f9ff', borderColor: isDark ? '#1e3a5f' : '#bae6fd' }]}>
              <View style={[styles.securityNoteDot, { backgroundColor: '#0ea5e9' }]} />
              <Text style={[styles.securityNoteText, { color: isDark ? '#7cb9e8' : '#0369a1' }]}>
                Secure admin access. Your session is encrypted and time-limited.
              </Text>
            </View>
          </View>

          {/* Footer */}
          <Text style={[styles.footerText, { color: isDark ? '#2a3a4a' : '#cbd5e1' }]}>
            CoderZhive Platform · Admin Portal
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  /* top strip */
  topStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backArrow: {
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#64748b',
    transform: [{ rotate: '-45deg' }],
    marginRight: 8,
  },
  backLabel: { color: '#64748b', fontSize: 14, fontWeight: '600' },
  officialLogo: {
    width: 120,
    height: 40,
    resizeMode: "contain",
  },

  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },

  /* card */
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  },
  cardHeader: { alignItems: 'center', marginBottom: 24 },
  cardIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#0ea5e910',
    borderWidth: 1,
    borderColor: '#0ea5e930',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardIconShield: {
    width: 28,
    height: 30,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    opacity: 0.9,
  },
  cardTitle: { fontSize: 22, fontWeight: '900', letterSpacing: -0.3, marginBottom: 6 },
  cardSubtitle: { fontSize: 13, textAlign: 'center', lineHeight: 19 },

  divider: { height: 1, marginBottom: 24 },

  /* fields */
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 0,
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: {
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* submit */
  submitBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#0ea5e9',
    marginTop: 8,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  submitBtnInner: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },

  /* security note */
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  securityNoteDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
    marginRight: 10,
    flexShrink: 0,
  },
  securityNoteText: { fontSize: 12, lineHeight: 17, flex: 1, fontWeight: '500' },

  /* footer */
  footerText: { textAlign: 'center', fontSize: 12, marginTop: 24 },
});