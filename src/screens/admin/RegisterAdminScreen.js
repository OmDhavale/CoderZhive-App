import React, { useState, useContext } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Platform,
    Alert,
    ActivityIndicator,
    StyleSheet,
    StatusBar,
    KeyboardAvoidingView,
    Image,
} from "react-native";
import logo from "../../../assets/coderzhive-dark.png";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NavigationContext } from "../../context/NavigationContext";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Toast from "react-native-toast-message";

const api = require("../../../apis/api");

export default function RegisterAdminScreen() {
    const { goBack } = useContext(NavigationContext);
    const { accessToken } = useContext(AuthContext);
    const { darkMode, lightTheme, darkTheme } = useTheme();
    const colors = darkMode ? darkTheme : lightTheme;
    const isDark = darkMode;
    const insets = useSafeAreaInsets();

    const [currentAdminPassword, setCurrentAdminPassword] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    async function onSubmit() {
        if (!currentAdminPassword.trim()) {
            const message = "Please confirm your admin password to proceed";
            if (Platform.OS === "web") window.alert(message);
            else Alert.alert("Security Verification Required", message);
            return;
        }

        if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            const message = "All fields are required";
            if (Platform.OS === "web") window.alert(message);
            else Alert.alert("Validation Error", message);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            const message = "Please enter a valid email address";
            if (Platform.OS === "web") window.alert(message);
            else Alert.alert("Validation Error", message);
            return;
        }

        if (password !== confirmPassword) {
            const message = "Passwords do not match";
            if (Platform.OS === "web") window.alert(message);
            else Alert.alert("Validation Error", message);
            return;
        }

        if (password.length < 6) {
            const message = "Password must be at least 6 characters long";
            if (Platform.OS === "web") window.alert(message);
            else Alert.alert("Validation Error", message);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(api.registerAdmin, {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    username: username.trim(),
                    email: email.trim(),
                    password: password,
                    currentAdminPassword: currentAdminPassword.trim(),
                }),
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message || `HTTP Status: ${response.status}`);
            }

            Toast.show({ type: "success", text1: "Success", text2: "Admin registered successfully" });

            if (Platform.OS === "web") {
                window.alert("Admin Registered Successfully");
                goBack();
            } else {
                Alert.alert("Success", "Admin Registered Successfully", [{ text: "OK", onPress: () => goBack() }]);
            }
        } catch (err) {
            Toast.show({ type: "error", text1: "Error", text2: err.message || "Failed to register admin" });
            if (Platform.OS === "web") window.alert("Failed: " + err.message);
            else Alert.alert("Error", err.message);
        } finally {
            setLoading(false);
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

            <View style={{ height: insets.top, backgroundColor: '#0a1628' }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => goBack()} style={styles.backBtn}>
                    <View style={styles.backArrow} />
                </TouchableOpacity>
                <Image source={logo} style={styles.officialLogo} />
                {/* <View style={styles.headerTextWrap}>
                    <Text style={styles.headerTitle}>New Administrator</Text>
                    <Text style={styles.headerSubtitle}>Authorized project manager for CoderZhive</Text>
                </View> */}
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                    <View style={[styles.infoBox, { backgroundColor: "#0ea5e910", borderColor: "#0ea5e930" }]}>
                        <Text style={styles.infoTitle}>SECURITY PROTOCOL</Text>
                        <Text style={[styles.infoText, { color: isDark ? "#7cb9e8" : "#0369a1" }]}>
                            Only authorized system administrators can create new admin accounts. Current admin authentication is mandatory.
                        </Text>
                    </View>

                    {/* Section 1: Identity Verification */}
                    <View style={[styles.card, { backgroundColor: isDark ? "#111c2d" : "#fff", borderColor: isDark ? "#1e3a5f" : "#e2e8f0" }]}>
                        <Text style={[styles.cardTitle, { color: isDark ? "#f1f5f9" : "#0f172a" }]}>Security Verification</Text>
                        <Text style={[styles.cardSubtitle, { color: isDark ? "#64748b" : "#94a3b8" }]}>Confirm your identity to proceed</Text>

                        <View style={styles.divider} />

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: isDark ? "#94a3b8" : "#475569" }]}>YOUR ADMIN PASSWORD</Text>
                            <TextInput
                                style={inputStyle('currentPass')}
                                placeholder="Verify current admin password"
                                placeholderTextColor={isDark ? "#334a5e" : "#94a3b8"}
                                value={currentAdminPassword}
                                onChangeText={setCurrentAdminPassword}
                                secureTextEntry
                                onFocus={() => setFocusedField('currentPass')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>
                    </View>

                    {/* Section 2: New Admin Details */}
                    <View style={[styles.card, { backgroundColor: isDark ? "#111c2d" : "#fff", borderColor: isDark ? "#1e3a5f" : "#e2e8f0", marginTop: 20 }]}>
                        <Text style={[styles.cardTitle, { color: isDark ? "#f1f5f9" : "#0f172a" }]}>New Account Details</Text>
                        <Text style={[styles.cardSubtitle, { color: isDark ? "#64748b" : "#94a3b8" }]}>Define credentials for the new administrator</Text>

                        <View style={styles.divider} />

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: isDark ? "#94a3b8" : "#475569" }]}>FULL USERNAME</Text>
                            <TextInput
                                style={inputStyle('username')}
                                placeholder="e.g. John Doe"
                                placeholderTextColor={isDark ? "#334a5e" : "#94a3b8"}
                                value={username}
                                onChangeText={setUsername}
                                onFocus={() => setFocusedField('username')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: isDark ? "#94a3b8" : "#475569" }]}>ADMIN EMAIL</Text>
                            <TextInput
                                style={inputStyle('email')}
                                placeholder="name@coderzhive.com"
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
                            <Text style={[styles.label, { color: isDark ? "#94a3b8" : "#475569" }]}>ACCESS PASSWORD</Text>
                            <TextInput
                                style={inputStyle('pass')}
                                placeholder="Min 6 characters"
                                placeholderTextColor={isDark ? "#334a5e" : "#94a3b8"}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                onFocus={() => setFocusedField('pass')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: isDark ? "#94a3b8" : "#475569" }]}>CONFIRM PASSWORD</Text>
                            <TextInput
                                style={inputStyle('confirm')}
                                placeholder="Repeat password"
                                placeholderTextColor={isDark ? "#334a5e" : "#94a3b8"}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                onFocus={() => setFocusedField('confirm')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.submitBtn, { opacity: loading ? 0.7 : 1 }]}
                            onPress={onSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.submitBtnText}>Authorise & Register</Text>
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
    scroll: { padding: 20, paddingBottom: 40 },
    infoBox: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 20,
    },
    infoTitle: {
        color: "#0ea5e9",
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 2,
        marginBottom: 6,
    },
    infoText: { fontSize: 12, lineHeight: 18, fontWeight: "500" },
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
