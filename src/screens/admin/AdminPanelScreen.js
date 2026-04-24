import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Image,
  Platform,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { AttendanceContext } from "../../context/AttendanceContext";
import { NavigationContext } from "../../context/NavigationContext";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Toast from "react-native-toast-message";
import * as api from "../../../apis/api";

const { width } = Dimensions.get("window");

export default function AdminPanelScreen() {
  const { addCollege, addNgo } = useContext(AttendanceContext);
  const { navigate } = useContext(NavigationContext);
  const { logout } = useContext(AuthContext);
  const { darkMode, lightTheme, darkTheme } = useTheme();
  const colors = darkMode ? darkTheme : lightTheme;
  const isDark = darkMode;

  const [collegesList, setCollegesList] = useState([]);
  const [ngosList, setNgosList] = useState([]);
  const [loadingColleges, setLoadingColleges] = useState(true);
  const [loadingNgos, setLoadingNgos] = useState(true);
  const [collegeSearch, setCollegeSearch] = useState("");
  const [ngoSearch, setNgoSearch] = useState("");
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [entityType, setEntityType] = useState(null);

  useEffect(() => {
    fetchNgos();
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      setLoadingColleges(true);
      const response = await fetch(api.getAllCollegeAPI, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const collegesArray = data?.data?.colleges || [];
      setCollegesList(Array.isArray(collegesArray) ? collegesArray : []);
    } catch (err) {
      console.error("Error fetching Colleges: ", err);
    } finally {
      setLoadingColleges(false);
    }
  };

  const fetchNgos = async () => {
    try {
      setLoadingNgos(true);
      const response = await fetch(api.getAllNgoAPI, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const ngosArray = data.statusCode || data.ngos || data.data || [];
      setNgosList(Array.isArray(ngosArray) ? ngosArray : []);
    } catch (err) {
      console.error("Error fetching NGOs:", err);
    } finally {
      setLoadingNgos(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("Home");
  };

  const handleEditComingSoon = (type) => {
    const message = `Coming Soon! \n\nEdit ${type} feature will be available in the next update.`;
    if (Platform.OS === "web") {
      window.alert(message);
    } else {
      Toast.show({
        type: "info",
        text1: "Coming Soon!",
        text2: `Edit ${type} feature will be available soon`,
        position: "top",
      });
    }
  };

  const renderItemName = (item) => {
    if (!item) return "Unknown";
    if (typeof item === "string") return item;
    return item.name || item.title || item.email || "Unknown Entity";
  };

  const filteredColleges = collegesList.filter((college) => {
    if (!collegeSearch.trim()) return true;
    const name = renderItemName(college)?.toLowerCase() || "";
    return name.includes(collegeSearch.toLowerCase());
  });

  const filteredNgos = ngosList.filter((ngo) => {
    if (!ngoSearch.trim()) return true;
    const name = renderItemName(ngo)?.toLowerCase() || "";
    return name.includes(ngoSearch.toLowerCase());
  });

  const getInitials = (name) => {
    if (!name) return "?";
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleEntityClick = (entity, type) => {
    setSelectedEntity(entity);
    setEntityType(type);
    navigate("EntityDetail", { entity, entityType: type });
  };

  if (selectedEntity && entityType) {
    const EntityDetailScreen = require("./EntityDetailScreen").default;
    return <EntityDetailScreen entity={selectedEntity} entityType={entityType} />;
  }

  const renderEntityItem = (item, type) => {
    const itemName = renderItemName(item);
    const logoUrl = item?.logo || item?.logoUrl || item?.profileImage;

    return (
      <TouchableOpacity
        key={item._id || item.id || Math.random()}
        onPress={() => handleEntityClick(item, type)}
        style={[styles.entityItem, { backgroundColor: isDark ? "#1a2a3a" : "#fff", borderColor: isDark ? "#2a3a4a" : "#e2e8f0" }]}
      >
        <View style={[styles.avatar, { backgroundColor: "#0ea5e915" }]}>
          {logoUrl ? (
            <Image source={{ uri: logoUrl }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{getInitials(itemName)}</Text>
          )}
        </View>
        <View style={styles.entityInfo}>
          <Text style={[styles.entityName, { color: isDark ? "#e2e8f0" : "#1e293b" }]} numberOfLines={1}>
            {itemName}
          </Text>
          <Text style={[styles.entityType, { color: isDark ? "#64748b" : "#94a3b8" }]}>
            {type.toUpperCase()}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleEditComingSoon(type)}
          style={[styles.editBtn, { borderColor: "#0ea5e930" }]}
        >
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
        <View style={styles.chevron} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: isDark ? "#0a1628" : "#f8fafc" }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1628" />

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>CZ</Text>
          </View>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Admin Panel</Text>
            <Text style={styles.headerSubtitle}>System Governance</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutBtnText}>Exit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>COLLEGES</Text>
            <Text style={styles.statsValue}>{collegesList.length}</Text>
          </View>
          <View style={[styles.statsCard, { borderLeftWidth: 1, borderColor: "#ffffff20" }]}>
            <Text style={styles.statsLabel}>NGOs</Text>
            <Text style={styles.statsValue}>{ngosList.length}</Text>
          </View>
          <TouchableOpacity 
            onPress={() => navigate("RegisterAdmin")}
            style={styles.addAdminBtn}
          >
            <Text style={styles.addAdminBtnText}>+ Admin</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Colleges Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? "#94a3b8" : "#475569" }]}>COLLEGES</Text>
            <TouchableOpacity 
              onPress={() => navigate("AddCollege")}
              style={styles.addBtn}
            >
              <Text style={styles.addBtnText}>+ Add New</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.searchWrap, { backgroundColor: isDark ? "#111c2d" : "#fff", borderColor: isDark ? "#1e3a5f" : "#e2e8f0" }]}>
            <TextInput
              style={[styles.searchInput, { color: isDark ? "#fff" : "#1e293b" }]}
              placeholder="Search by name..."
              placeholderTextColor={isDark ? "#334a5e" : "#94a3b8"}
              value={collegeSearch}
              onChangeText={setCollegeSearch}
            />
          </View>

          {loadingColleges ? (
            <ActivityIndicator color="#0ea5e9" style={{ marginVertical: 20 }} />
          ) : filteredColleges.length > 0 ? (
            <View style={styles.entityList}>
              {filteredColleges.map((item) => renderEntityItem(item, "college"))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No colleges found</Text>
            </View>
          )}
        </View>

        {/* NGOs Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? "#94a3b8" : "#475569" }]}>NGOs</Text>
            <TouchableOpacity 
              onPress={() => navigate("AddNgo")}
              style={styles.addBtn}
            >
              <Text style={styles.addBtnText}>+ Add New</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.searchWrap, { backgroundColor: isDark ? "#111c2d" : "#fff", borderColor: isDark ? "#1e3a5f" : "#e2e8f0" }]}>
            <TextInput
              style={[styles.searchInput, { color: isDark ? "#fff" : "#1e293b" }]}
              placeholder="Search by name..."
              placeholderTextColor={isDark ? "#334a5e" : "#94a3b8"}
              value={ngoSearch}
              onChangeText={setNgoSearch}
            />
          </View>

          {loadingNgos ? (
            <ActivityIndicator color="#0ea5e9" style={{ marginVertical: 20 }} />
          ) : filteredNgos.length > 0 ? (
            <View style={styles.entityList}>
              {filteredNgos.map((item) => renderEntityItem(item, "ngo"))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No NGOs found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    backgroundColor: "#0a1628",
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#0ea5e9",
    alignItems: "center",
    justifyContent: "center",
  },
  logoBadgeText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
  },
  headerSubtitle: {
    color: "#0ea5e9",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  logoutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ef444450",
  },
  logoutBtnText: {
    color: "#ef4444",
    fontSize: 12,
    fontWeight: "700",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111c2d",
    borderRadius: 16,
    padding: 16,
  },
  statsCard: {
    flex: 1,
    alignItems: "center",
  },
  statsLabel: {
    color: "#64748b",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 4,
  },
  statsValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  addAdminBtn: {
    backgroundColor: "#0ea5e9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 10,
  },
  addAdminBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  addBtn: {
    backgroundColor: "#0ea5e915",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#0ea5e930",
  },
  addBtnText: {
    color: "#0ea5e9",
    fontSize: 11,
    fontWeight: "700",
  },
  searchWrap: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 12,
    justifyContent: "center",
  },
  searchInput: {
    fontSize: 14,
    fontWeight: "500",
  },
  entityList: {
    gap: 8,
  },
  entityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  avatarText: {
    color: "#0ea5e9",
    fontWeight: "800",
    fontSize: 14,
  },
  entityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  entityName: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  entityType: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  editBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 8,
  },
  editBtnText: {
    color: "#0ea5e9",
    fontSize: 11,
    fontWeight: "600",
  },
  chevron: {
    width: 6,
    height: 6,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: "#64748b",
    transform: [{ rotate: "45deg" }],
    opacity: 0.5,
  },
  emptyState: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#64748b",
    fontSize: 13,
    fontStyle: "italic",
  },
});