import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Alert,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import logo from "../../../assets/coderzhive-dark.png";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { NavigationContext } from "../../context/NavigationContext";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const api = require("../../../apis/api");

export default function AddNgoScreen() {
  const { goBack } = useContext(NavigationContext);
  const { accessToken } = useContext(AuthContext);
  const { darkMode, lightTheme, darkTheme } = useTheme();
  const colors = darkMode ? darkTheme : lightTheme;
  const isDark = darkMode;
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [reg, setReg] = useState("");
  const [logo, setLogo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Sorry, we need camera roll permissions!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setLogo(result.assets[0].uri);
    }
  };

  async function onSubmit() {
    if (!logo) {
      Alert.alert("Validation Error", "Please upload an NGO Logo.");
      return;
    }
    if (!name || !email || !password) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("password", password);
    formData.append("mobile", mobile);
    formData.append("registrationNumber", reg);

    let filename = logo.split('/').pop();
    if (!filename || filename.indexOf('.') === -1) {
        filename = "ngo-logo.jpg";
    }

    if (Platform.OS === "web") {
      try {
        const res = await fetch(logo); 
        const blob = await res.blob(); 
        formData.append("logo", blob, filename);
      } catch (error) {
        console.error("Error converting image on web:", error);
        setIsSubmitting(false);
        return;
      }
    } else {
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append("logo", {
        uri: Platform.OS === "android" ? logo : logo.replace("file://", ""),
        name: filename,
        type: type,
      });
    }

    try {
      const response = await fetch(api.addNgoAPI, {
        method: "POST",
        credentials: "include",
        headers: { 
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || `HTTP Status: ${response.status}`);
      }

      if (Platform.OS === 'web') {
        window.alert("NGO Added Successfully");
        goBack();
      } else {
        Alert.alert("Success", "NGO Added Successfully", [{ text: "OK", onPress: () => goBack() }]);
      }
    } catch (err) {
      if (Platform.OS === 'web') window.alert("Upload Failed: " + err.message);
      else Alert.alert("Upload Failed", err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputStyle = (field) => [
    styles.input,
    {
      backgroundColor: isDark ? "#1a2a3a" : "#f1f5f9",
      borderColor: focusedField === field ? "#0ea5e9" : isDark ? "#2a3a4a" : "#e2e8f0",
      color: isDark ? "#e2e8f0" : "#1e293b",
    },
  ];

  return (
    <View style={[styles.root, { backgroundColor: isDark ? "#0a1628" : "#f8fafc" }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Seamless Status Bar Background */}
      <View style={{ height: insets.top, backgroundColor: '#0a1628' }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <View style={styles.backArrow} />
        </TouchableOpacity>
        <Image source={logo} style={styles.officialLogo} />
        <View style={styles.logoBadgePlaceholder} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={[styles.card, { backgroundColor: isDark ? "#111c2d" : "#fff", borderColor: isDark ? "#1e3a5f" : "#e2e8f0" }]}>
            <Text style={[styles.cardTitle, { color: isDark ? "#f1f5f9" : "#0f172a" }]}>Add New NGO</Text>
            <Text style={[styles.cardSubtitle, { color: isDark ? "#64748b" : "#94a3b8" }]}>Register a new humanitarian partner</Text>

            <View style={styles.divider} />

            {/* Logo Picker */}
            <View style={styles.logoPickerContainer}>
              <TouchableOpacity onPress={pickImage} style={[styles.logoBtn, { borderColor: logo ? "#0ea5e9" : isDark ? "#2a3a4a" : "#e2e8f0" }]}>
                {logo ? (
                  <Image source={{ uri: logo }} style={styles.logoImage} />
                ) : (
                  <View style={styles.logoPlaceholder}>
                    <View style={styles.plusIcon} />
                    <Text style={[styles.logoText, { color: isDark ? "#64748b" : "#94a3b8" }]}>Add Logo</Text>
                  </View>
                )}
              </TouchableOpacity>
              {logo && <Text style={styles.changeLogoText}>Tap to change logo</Text>}
            </View>

            {/* Form Fields */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: isDark ? "#94a3b8" : "#475569" }]}>NGO NAME</Text>
              <TextInput
                style={inputStyle('name')}
                placeholder="Enter NGO name"
                placeholderTextColor={isDark ? "#334a5e" : "#94a3b8"}
                value={name}
                onChangeText={setName}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: isDark ? "#94a3b8" : "#475569" }]}>OFFICIAL EMAIL</Text>
              <TextInput
                style={inputStyle('email')}
                placeholder="ngo@organization.org"
                placeholderTextColor={isDark ? "#334a5e" : "#94a3b8"}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: isDark ? "#94a3b8" : "#475569" }]}>HEAD OFFICE ADDRESS</Text>
              <TextInput
                style={inputStyle('address')}
                placeholder="Full operational address"
                placeholderTextColor={isDark ? "#334a5e" : "#94a3b8"}
                value={address}
                onChangeText={setAddress}
                onFocus={() => setFocusedField('address')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: isDark ? "#94a3b8" : "#475569" }]}>CONTACT NUMBER</Text>
              <TextInput
                style={inputStyle('mobile')}
                placeholder="Operational mobile / landline"
                placeholderTextColor={isDark ? "#334a5e" : "#94a3b8"}
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
                onFocus={() => setFocusedField('mobile')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: isDark ? "#94a3b8" : "#475569" }]}>REGISTRATION NUMBER</Text>
              <TextInput
                style={inputStyle('reg')}
                placeholder="Government reg id"
                placeholderTextColor={isDark ? "#334a5e" : "#94a3b8"}
                value={reg}
                onChangeText={setReg}
                onFocus={() => setFocusedField('reg')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: isDark ? "#94a3b8" : "#475569" }]}>PORTAL PASSWORD</Text>
              <TextInput
                style={inputStyle('password')}
                placeholder="Create access password"
                placeholderTextColor={isDark ? "#334a5e" : "#94a3b8"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, { opacity: isSubmitting ? 0.7 : 1 }]}
              onPress={onSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>Create NGO Profile</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    backgroundColor: "#0a1628",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backBtn: { flexDirection: "row", alignItems: "center" },
  backArrow: {
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: "#64748b",
    transform: [{ rotate: "-45deg" }],
    marginRight: 8,
  },
  backLabel: { color: "#64748b", fontSize: 14, fontWeight: "600" },
  officialLogo: {
    width: 100,
    height: 36,
    resizeMode: "contain",
  },
  logoBadgePlaceholder: { width: 36 },
  scroll: { padding: 20, paddingBottom: 40 },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardTitle: { fontSize: 20, fontWeight: "900", marginBottom: 4 },
  cardSubtitle: { fontSize: 13, marginBottom: 20 },
  divider: { height: 1, backgroundColor: "#0ea5e920", marginBottom: 24 },
  logoPickerContainer: { alignItems: "center", marginBottom: 24 },
  logoBtn: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logoImage: { width: "100%", height: "100%", resizeMode: "cover" },
  logoPlaceholder: { alignItems: "center" },
  plusIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#0ea5e920",
    marginBottom: 6,
  },
  logoText: { fontSize: 11, fontWeight: "700" },
  changeLogoText: { fontSize: 10, color: "#0ea5e9", marginTop: 8, fontWeight: "600" },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 10, fontWeight: "800", letterSpacing: 1.5, marginBottom: 8 },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: "500",
  },
  submitBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: "#0ea5e9",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});