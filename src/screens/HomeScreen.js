import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { NavigationContext } from '../context/NavigationContext';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { navigate } = useContext(NavigationContext);
  const { darkMode, lightTheme, darkTheme, setTheme } = useTheme();
  const colors = darkMode ? darkTheme : lightTheme;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1628" />

      {/* ── Dark Hero Background ── */}
      <View style={styles.hero}>

        {/* Top bar */}
        <View style={styles.topBar}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>CZ</Text>
          </View>
          <TouchableOpacity
            onPress={() => setTheme(!darkMode)}
            style={styles.themeToggle}
          >
            <View style={styles.themeToggleDot} />
          </TouchableOpacity>
        </View>

        {/* Brand Block */}
        <View style={styles.brandBlock}>
          <Text style={styles.brandName}>CoderZhive</Text>
          <View style={styles.taglineRow}>
            <View style={styles.taglineAccent} />
            <Text style={styles.taglineText}>NGO Attendance Platform</Text>
          </View>
          <Text style={styles.brandDesc}>
            Streamline volunteer management, event attendance and internship
            tracking — all in one unified platform.
          </Text>
        </View>

        {/* Decorative grid dots */}
        <View style={styles.gridOverlay} pointerEvents="none">
          {Array.from({ length: 30 }).map((_, i) => (
            <View key={i} style={styles.dot} />
          ))}
        </View>
      </View>

      {/* ── Role Selection Panel ── */}
      <View style={[styles.panel, { backgroundColor: colors.backgroundColors?.[0] || '#f8fafc' }]}>
        <Text style={[styles.panelHeading, { color: colors.textSecondary }]}>
          SELECT YOUR ROLE
        </Text>

        {/* NGO Admin Card */}
        <TouchableOpacity
          style={[styles.roleCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          onPress={() => navigate('AdminLogin')}
          activeOpacity={0.88}
        >
          {/* Left accent bar */}
          <View style={[styles.roleAccentBar, { backgroundColor: '#0ea5e9' }]} />

          <View style={styles.roleIconBox}>
            <View style={[styles.roleIconInner, { backgroundColor: '#0ea5e910', borderColor: '#0ea5e930' }]}>
              {/* Shield icon made with views */}
              <View style={styles.shieldOuter}>
                <View style={styles.shieldInner} />
              </View>
            </View>
          </View>

          <View style={styles.roleContent}>
            <Text style={[styles.roleTitle, { color: colors.header }]}>NGO Admin</Text>
            <Text style={[styles.roleSubtitle, { color: colors.textSecondary }]}>
              Manage colleges, NGOs, events and reports
            </Text>
          </View>

          <View style={[styles.roleChevron, { borderColor: colors.border }]}>
            <View style={[styles.chevronLine, { borderColor: colors.textSecondary }]} />
          </View>
        </TouchableOpacity>

        {/* Coming Soon cards */}
        {['NGO Volunteer', 'College Coordinator', 'Student'].map((role) => (
          <View
            key={role}
            style={[styles.roleCard, styles.roleCardDisabled, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          >
            <View style={[styles.roleAccentBar, { backgroundColor: colors.border }]} />
            <View style={styles.roleContent}>
              <Text style={[styles.roleTitle, { color: colors.textSecondary, opacity: 0.5 }]}>{role}</Text>
              <Text style={[styles.roleSubtitle, { color: colors.textSecondary, opacity: 0.4 }]}>
                Coming soon
              </Text>
            </View>
            <View style={[styles.soonBadge, { backgroundColor: colors.border }]}>
              <Text style={[styles.soonText, { color: colors.textSecondary }]}>SOON</Text>
            </View>
          </View>
        ))}

        {/* Footer */}
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          CoderZhive Platform &nbsp;·&nbsp; v1.0.0
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a1628' },

  /* ── Hero ── */
  hero: {
    backgroundColor: '#0a1628',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    overflow: 'hidden',
    position: 'relative',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 36,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadgeText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  themeToggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#1e3a5f',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  themeToggleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0ea5e9',
    alignSelf: 'flex-end',
  },
  brandBlock: { marginBottom: 8 },
  brandName: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  taglineAccent: {
    width: 22,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#0ea5e9',
    marginRight: 10,
  },
  taglineText: {
    color: '#0ea5e9',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  brandDesc: {
    color: '#8899aa',
    fontSize: 14,
    lineHeight: 21,
    maxWidth: width * 0.85,
  },

  /* decorative dots */
  gridOverlay: {
    position: 'absolute',
    right: -10,
    top: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 120,
    opacity: 0.12,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0ea5e9',
    margin: 5,
  },

  /* ── Panel ── */
  panel: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  panelHeading: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 16,
  },

  /* ── Role Card ── */
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  roleCardDisabled: { opacity: 0.55 },
  roleAccentBar: { width: 4, alignSelf: 'stretch' },
  roleIconBox: { paddingLeft: 14, paddingVertical: 16 },
  roleIconInner: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /* custom shield icon */
  shieldOuter: {
    width: 20,
    height: 22,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    opacity: 0.9,
  },
  roleContent: { flex: 1, paddingHorizontal: 14, paddingVertical: 18 },
  roleTitle: { fontSize: 16, fontWeight: '800', marginBottom: 3 },
  roleSubtitle: { fontSize: 12, lineHeight: 17 },
  roleChevron: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  chevronLine: {
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#aaa',
    transform: [{ rotate: '45deg' }],
    marginLeft: -4,
  },
  soonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 14,
  },
  soonText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },

  /* footer */
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 'auto',
    paddingVertical: 20,
    opacity: 0.6,
  },
});
