import React, { useContext, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, BackHandler, Platform, StatusBar } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

// ─── Contexts ────────────────────────────────────────────────────────────────
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { AttendanceProvider } from './src/context/AttendanceContext';
import { NavigationContext } from './src/context/NavigationContext';

// ─── Screens ─────────────────────────────────────────────────────────────────
import HomeScreen from './src/screens/HomeScreen';
import AdminLoginScreen from './src/screens/admin/AdminLoginScreen';
import AdminPanelScreen from './src/screens/admin/AdminPanelScreen';
import AddCollegeScreen from './src/screens/admin/AddCollegeScreen';
import AddNgoScreen from './src/screens/admin/AddNgoScreen';
import RegisterAdminScreen from './src/screens/admin/RegisterAdminScreen';
import EntityDetailScreen from './src/screens/admin/EntityDetailScreen';

// ─── Route → Screen map ───────────────────────────────────────────────────────
function RootNavigator() {
  const { route, goBack, replace, history } = useContext(NavigationContext);
  const { loading, isAuthenticated } = useContext(AuthContext);
  const { darkMode, darkTheme, lightTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const colors = darkMode ? darkTheme : lightTheme;

  // ─── Redirect based on auth state once loading is done ───
  useEffect(() => {
    if (loading) return;
    if (isAuthenticated) {
      // If the user is already logged in, jump directly to AdminPanel
      // and clear history so they cannot go back to Home/Login
      replace('AdminPanel');
    } else {
      // If logged out, always land on Home
      replace('Home');
    }
  }, [loading, isAuthenticated]);

  // ─── Android Hardware Back Button Logic ───
  useEffect(() => {
    const onBackPress = () => {
      // When authenticated, only allow back if there is a real inner screen
      // (e.g. EntityDetail, AddCollege, etc.) — never go back to Login/Home
      if (isAuthenticated) {
        // AdminPanel is the "root" for authenticated users
        if (history.length > 1 && route.name !== 'AdminPanel') {
          goBack();
          return true;
        }
        return false; // At AdminPanel root → exit the app
      }
      // Unauthenticated: allow back if not at Home
      if (route.name !== 'Home') {
        goBack();
        return true;
      }
      return false;
    };

    if (Platform.OS === 'android') {
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }
  }, [route, goBack, isAuthenticated, history]);

  // Show a spinner while AsyncStorage hydrates auth state
  if (loading) {
    return (
      <View style={[styles.loader, { backgroundColor: colors.backgroundColors?.[0] || '#f0fdf4' }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  const { name, params = {} } = route;

  // Wrap all screens in a View with safe area top padding
  const renderScreen = () => {
    switch (name) {
      case 'AdminLogin':
        return <AdminLoginScreen />;
      case 'AdminPanel':
        return <AdminPanelScreen />;
      case 'AddCollege':
        return <AddCollegeScreen />;
      case 'AddNgo':
        return <AddNgoScreen />;
      case 'RegisterAdmin':
        return <RegisterAdminScreen />;
      case 'EntityDetail':
        return <EntityDetailScreen entity={params.entity} entityType={params.entityType} />;
      case 'Home':
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {renderScreen()}
    </View>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          {/* AttendanceProvider wraps NavigationProvider internally */}
          <AttendanceProvider>
            <RootNavigator />
            <Toast />
          </AttendanceProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
