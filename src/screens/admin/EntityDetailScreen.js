import React, { useContext } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    StatusBar,
    Dimensions,
} from "react-native";
import logo from "../../../assets/coderzhive-dark.png";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NavigationContext } from "../../context/NavigationContext";
import { useTheme } from "../../context/ThemeContext";

const { width } = Dimensions.get("window");

export default function EntityDetailScreen({ entity, entityType }) {
    const { goBack } = useContext(NavigationContext);
    const { darkMode, lightTheme, darkTheme } = useTheme();
    const insets = useSafeAreaInsets();
    const colors = darkMode ? darkTheme : lightTheme;
    const isDark = darkMode;

    const renderName = () => {
        if (typeof entity === "string") return entity;
        return entity?.name || entity?.title || entity?.email || "Unknown";
    };

    const getInitials = (name) => {
        if (!name) return "?";
        const words = name.trim().split(/\s+/);
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const name = renderName();
    const logoUrl = entity?.logo || entity?.logoUrl || entity?.profileImage;

    const renderField = (label, value) => {
        if (!value || value === "" || value === null || value === undefined) return null;

        return (
            <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: isDark ? "#64748b" : "#94a3b8" }]}>{label.toUpperCase()}</Text>
                <Text style={[styles.detailValue, { color: isDark ? "#e2e8f0" : "#1e293b" }]}>
                    {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                </Text>
            </View>
        );
    };

    return (
        <View style={[styles.root, { backgroundColor: isDark ? "#0a1628" : "#f8fafc" }]}>
            <StatusBar barStyle="light-content" />
            
            {/* Seamless Status Bar Background */}
            <View style={{ height: insets.top, backgroundColor: '#0a1628' }} />

            {/* Header / Profile Hero */}
            <View style={styles.hero}>
                <View style={styles.topNav}>
                    <TouchableOpacity onPress={goBack} style={styles.backBtn}>
                        <View style={styles.backArrow} />
                        <Text style={styles.backLabel}>Go Back</Text>
                    </TouchableOpacity>
                    <Image source={logo} style={styles.officialLogo} />
                </View>

                <View style={styles.profileSection}>
                    <View style={[styles.avatarWrap, { backgroundColor: "#0ea5e915", borderColor: "#0ea5e930" }]}>
                        {logoUrl ? (
                            <Image source={{ uri: logoUrl }} style={styles.avatarImage} />
                        ) : (
                            <Text style={styles.avatarText}>{getInitials(name)}</Text>
                        )}
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.entityName}>{name}</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{entityType.toUpperCase()}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={[styles.card, { backgroundColor: isDark ? "#111c2d" : "#fff", borderColor: isDark ? "#1e3a5f" : "#e2e8f0" }]}>
                    <Text style={[styles.sectionTitle, { color: isDark ? "#0ea5e9" : "#0369a1" }]}>IDENTIFICATION & CONTACT</Text>
                    
                    {renderField("Full Name", entity?.name)}
                    {renderField("Official Email", entity?.email)}
                    {renderField("Primary Contact", entity?.contact || entity?.phone || entity?.phoneNumber)}
                    {renderField("Registration Number", entity?.registrationNumber || entity?.regNo)}

                    <View style={styles.divider} />
                    
                    <Text style={[styles.sectionTitle, { color: isDark ? "#0ea5e9" : "#0369a1" }]}>LOCATION DETAILS</Text>
                    {renderField("Street Address", entity?.address)}
                    {renderField("City", entity?.city)}
                    {renderField("State", entity?.state)}
                    {renderField("Pincode", entity?.pincode || entity?.zipCode)}

                    <View style={styles.divider} />

                    <Text style={[styles.sectionTitle, { color: isDark ? "#0ea5e9" : "#0369a1" }]}>ORGANIZATION INFO</Text>
                    {renderField("Established", entity?.established || entity?.foundedYear)}
                    {renderField("Website", entity?.website)}
                    {renderField("Description", entity?.description || entity?.about)}

                    {entityType === 'college' && (
                        <>
                            <View style={styles.divider} />
                            <Text style={[styles.sectionTitle, { color: isDark ? "#0ea5e9" : "#0369a1" }]}>ACADEMIC STRUCTURE</Text>
                            {renderField("University", entity?.university)}
                            {renderField("Affiliation", entity?.affiliation)}
                            {renderField("Total Classes", entity?.classes?.length)}
                            
                            {entity?.classes && entity.classes.length > 0 && (
                                <View style={styles.classList}>
                                    {entity.classes.map((cls, index) => (
                                        <View key={cls._id || index} style={[styles.classItem, { backgroundColor: isDark ? "#1a2a3a" : "#f1f5f9", borderColor: isDark ? "#2a3a4a" : "#e2e8f0" }]}>
                                            <Text style={[styles.className, { color: isDark ? "#e2e8f0" : "#1e293b" }]}>{cls.className || cls.name}</Text>
                                            <Text style={[styles.classCount, { color: isDark ? "#64748b" : "#94a3b8" }]}>{cls.students?.length || 0} students enrolled</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </>
                    )}

                    {entityType === 'ngo' && (
                        <>
                            <View style={styles.divider} />
                            <Text style={[styles.sectionTitle, { color: isDark ? "#0ea5e9" : "#0369a1" }]}>OPERATIONAL DATA</Text>
                            {renderField("Registration Type", entity?.registrationType)}
                            {renderField("Primary Cause", entity?.cause || entity?.focus)}
                            {renderField("Member Count", entity?.members?.length || entity?.memberCount)}
                        </>
                    )}

                    <View style={styles.divider} />
                    <Text style={[styles.sectionTitle, { color: isDark ? "#64748b" : "#94a3b8" }]}>SYSTEM LOGS</Text>
                    {renderField("Profile Created", entity?.createdAt ? new Date(entity.createdAt).toLocaleDateString() : null)}
                    {renderField("Last Updated", entity?.updatedAt ? new Date(entity.updatedAt).toLocaleDateString() : null)}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    hero: {
        backgroundColor: "#0a1628",
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 32,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    topNav: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    officialLogo: {
        width: 100,
        height: 36,
        resizeMode: "contain",
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
    profileSection: { flexDirection: "row", alignItems: "center" },
    avatarWrap: {
        width: 72,
        height: 72,
        borderRadius: 20,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    avatarImage: { width: "100%", height: "100%", resizeMode: "cover" },
    avatarText: { color: "#0ea5e9", fontSize: 24, fontWeight: "900" },
    profileInfo: { marginLeft: 20, flex: 1 },
    entityName: { color: "#fff", fontSize: 22, fontWeight: "900", marginBottom: 6 },
    badge: {
        backgroundColor: "#0ea5e9",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: "flex-start",
    },
    badgeText: { color: "#fff", fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
    scroll: { padding: 20, paddingBottom: 40 },
    card: {
        borderRadius: 28,
        borderWidth: 1,
        padding: 24,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 6,
    },
    sectionTitle: { fontSize: 10, fontWeight: "900", letterSpacing: 1.5, marginBottom: 16 },
    detailRow: { marginBottom: 16 },
    detailLabel: { fontSize: 9, fontWeight: "700", marginBottom: 4 },
    detailValue: { fontSize: 15, fontWeight: "600", lineHeight: 22 },
    divider: { height: 1, backgroundColor: "#0ea5e915", marginVertical: 20 },
    classList: { marginTop: 8, gap: 10 },
    classItem: { padding: 14, borderRadius: 16, borderWidth: 1 },
    className: { fontSize: 14, fontWeight: "700", marginBottom: 2 },
    classCount: { fontSize: 11, fontWeight: "500" },
});
