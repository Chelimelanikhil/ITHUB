import React, { useEffect, useState, useRef } from "react";
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TextInput,
  Animated,
  Image,
  ToastAndroid,
  TouchableWithoutFeedback,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import Profile from "../../components/Profile/Profile";
import SavedJobs from "../../components/saved/SavedJobs";

const { width } = Dimensions.get("window");
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function IndexScreen() {
  const [companyData, setCompanyData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(-300)).current;
  const sidebarTranslateX = useRef(new Animated.Value(-width)).current;
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isSavedCompanyVisible, setIsSaveCompany] = useState(false);

  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const filters = ["All", "Technology", "Software", "AI & Machine Learning"];

  useEffect(() => {
    fetchUserData();
    fetchCompanyData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        "https://ithub-backend.onrender.com/api/users/userdetails",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching User data:", error);
    }
  };
  const fetchCompanyData = async () => {
    try {
      const response = await fetch(
        "https://ithub-backend.onrender.com/api/companies/allcompanies"
      );
      const data = await response.json();
      setCompanyData(data);
      setFilteredData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching company data:", error);
      setLoading(false);
    }
  };

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTransparent: false,
      headerTitle: "",
    });
  }, []);

  const handleLogout = async () => {
    try {
      // Clear the user token from AsyncStorage
      await AsyncStorage.removeItem("token");

      // Show a success message
      ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT);

      // Redirect to the SignIn screen
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      //ToastAndroid.show('Error logging out. Please try again.', ToastAndroid.LONG);
    }
  };

  const toggleSidebar = () => {
    const toValue = isSidebarVisible ? -width : 0;
    const overlayToValue = isSidebarVisible ? 0 : 0.5;

    Animated.parallel([
      Animated.spring(sidebarTranslateX, {
        toValue,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }),
      Animated.timing(overlayOpacity, {
        toValue: overlayToValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleProfileNavigation = () => {
    setIsProfileVisible(true);
  };

  const handleProfileUpdate = () => {
    fetchUserData();
  };

  const handleProfileClose = () => {
    toggleSidebar();
    setIsProfileVisible(false);
  };

  const handleCompaniesNavigation = () => {
    setIsSaveCompany(true);
  };

  const handleSaveJObsClose = () => {
    toggleSidebar();
    setIsSaveCompany(false);
  };

  const renderSidebar = () => (
    <>
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayOpacity,
            display: isSidebarVisible ? "flex" : "none",
          },
        ]}
      >
        <TouchableWithoutFeedback onPress={toggleSidebar}>
          <View style={styles.overlayTouchable} />
        </TouchableWithoutFeedback>
      </Animated.View>

      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: sidebarTranslateX }],
          },
        ]}
      >
        <LinearGradient
          colors={["#2C3E50", "#3498DB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.sidebarGradient}
        >
          <View style={styles.sidebarHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleSidebar}
            >
              <MaterialCommunityIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.userInfoSection}>
            <Image
              source={{
                uri:
                  userData.profilePic ||
                  "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid",
              }}
              style={styles.sidebarProfileImage}
            />
            <Text style={styles.sidebarUsername}>{userData.name}</Text>
            <Text style={styles.sidebarEmail}>{userData.email}</Text>
            <View style={styles.userStats}>
              <View style={styles.userStatItem}>
                <Text style={styles.statNumber}>28</Text>
                <Text style={styles.statLabel}>Applications</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.userStatItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Interviews</Text>
              </View>
            </View>
          </View>

          <View style={styles.sidebarContent}>
            <TouchableOpacity
              style={styles.sidebarItem}
              onPress={handleProfileNavigation}
            >
              <MaterialCommunityIcons
                name="account-outline"
                size={24}
                color="#fff"
              />
              <Text style={styles.sidebarItemText}>My Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem}>
              <MaterialCommunityIcons
                name="briefcase-outline"
                size={24}
                color="#fff"
              />
              <Text style={styles.sidebarItemText}>My Applications</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sidebarItem}
              onPress={handleCompaniesNavigation}
            >
              <MaterialCommunityIcons
                name="bookmark-outline"
                size={24}
                color="#fff"
              />
              <Text style={styles.sidebarItemText}>Saved Companies</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebarItem}>
              <MaterialCommunityIcons
                name="bell-outline"
                size={24}
                color="#fff"
              />
              <Text style={styles.sidebarItemText}>Notifications</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebarItem}>
              <MaterialCommunityIcons
                name="cog-outline"
                size={24}
                color="#fff"
              />
              <Text style={styles.sidebarItemText}>Settings</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={24} color="#E74C3C" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    </>
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterData(query, selectedFilter);
  };

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    filterData(searchQuery, filter);
  };

  const filterData = (query, filter) => {
    let filtered = companyData;

    if (query) {
      filtered = filtered.filter((company) =>
        company.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filter !== "All") {
      filtered = filtered.filter((company) => company.industry === filter);
    }

    setFilteredData(filtered);
  };

  const handleCompanyPress = (companyId) => {
    router.push({
      pathname: "/CompanyDetails/CompanyDetailScreen",
      params: { companyId },
    });
  };

  const renderCompanyItem = ({ item, index }) => {
    const scale = scrollY.interpolate({
      inputRange: [-1, 0, index * 350, (index + 1) * 350],
      outputRange: [1, 1, 1, 0.98],
      extrapolate: "clamp",
    });

    const opacity = scrollY.interpolate({
      inputRange: [-1, 0, index * 350, (index + 1) * 350],
      outputRange: [1, 1, 1, 0.7],
      extrapolate: "clamp",
    });

    return (
      <AnimatedTouchableOpacity
        onPress={() => handleCompanyPress(item._id)}
        style={[
          styles.companyCard,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        <LinearGradient
          colors={["#f0f4f8", "#ffffff"]}
          style={styles.cardGradient}
        >
          <View style={styles.companyHeader}>
            <Image source={{ uri: item.logo }} style={styles.companyLogo} />
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{item.name}</Text>
              <View style={styles.locationContainer}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={16}
                  color="#4A90E2"
                />
                <Text style={styles.companyLocation}>{item.location}</Text>
              </View>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="#4A90E2"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.companyStats}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="account-group"
                size={18}
                color="#4A90E2"
              />
              <Text style={styles.statText}>{item.employees} employees</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="star" size={18} color="#FFD700" />
              <Text style={styles.statText}>{item.rating} rating</Text>
            </View>

            <View
              style={[
                styles.openingsContainer,
                {
                  opacity: item.openings > 0 ? 1 : 0,
                  width: item.openings > 0 ? "auto" : 50,
                },
              ]}
            >
              {item.openings > 0 && (
                <>
                  <MaterialCommunityIcons
                    name="briefcase"
                    size={18}
                    color="#4CAF50"
                  />
                  <Text style={styles.openingsText}>{item.openings}</Text>
                </>
              )}
            </View>
          </View>
        </LinearGradient>
      </AnimatedTouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading companies...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {isProfileVisible ? (
        <Profile
          userData={userData}
          onClose={handleProfileClose}
          onUpdate={handleProfileUpdate}
        />
      ) : isSavedCompanyVisible ? (
        // Add your SaveJobs component here
        <SavedJobs onClose={handleSaveJObsClose} />
      ) : (
        <>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={toggleSidebar}
              style={styles.profileButton}
            >
              <Image
                source={{
                  uri:
                    userData.profilePic ||
                    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid",
                }}
                style={styles.profileImage}
              />
              <View style={styles.headerTextContainer}>
                <Text style={styles.welcomeText}>Welcome back</Text>
                <Text style={styles.profileName}>{userData.name}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.notificationButton}>
              <MaterialCommunityIcons
                name="bell-outline"
                size={28}
                color="#2C3E50"
              />

              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>

          {sidebarVisible && (
            <TouchableWithoutFeedback onPress={toggleSidebar}>
              <View style={styles.sidebarOverlay}>
                <TouchableWithoutFeedback>
                  <Animated.View
                    style={[
                      styles.sidebarContent,
                      { transform: [{ translateX: sidebarAnimation }] },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={toggleSidebar}
                      style={styles.closeButton}
                    >
                      <MaterialCommunityIcons
                        name="close"
                        size={28}
                        color="#fff"
                      />
                    </TouchableOpacity>

                    {/* Profile Image */}
                    <View style={styles.profileSection}>
                      <Image
                        source={{
                          uri:
                            userData.profilePic ||
                            "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid",
                        }}
                        style={styles.profilePic}
                      />
                      <Text style={styles.sidebarProfileName}>
                        {userData.name}
                      </Text>
                      <Text style={styles.sidebarProfileEmail}>
                        {userData.email}
                      </Text>
                    </View>

                    {/* Sidebar Options */}
                    <View style={styles.sidebarOptions}>
                      <TouchableOpacity style={styles.sidebarOption}>
                        <MaterialCommunityIcons
                          name="account-edit"
                          size={24}
                          color="#007AFF"
                        />
                        <Text style={styles.sidebarOptionText}>
                          Edit Profile
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.sidebarOption}>
                        <MaterialCommunityIcons
                          name="cog"
                          size={24}
                          color="#007AFF"
                        />
                        <Text style={styles.sidebarOptionText}>Settings</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.sidebarOption}>
                        <MaterialCommunityIcons
                          name="help-circle"
                          size={24}
                          color="#007AFF"
                        />
                        <Text style={styles.sidebarOptionText}>Help</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Logout Button at Bottom */}
                    <View style={styles.logoutContainer}>
                      <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                      >
                        <MaterialCommunityIcons
                          name="logout"
                          size={24}
                          color="#fff"
                        />
                        <Text style={styles.logoutText}>Log Out</Text>
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          )}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <MaterialCommunityIcons name="magnify" size={24} color="#666" />
              <TextInput
                value={searchQuery}
                onChangeText={handleSearch}
                placeholder="Search companies..."
                placeholderTextColor="#666"
                style={styles.searchInput}
              />
            </View>
          </View>

          <View style={styles.filterContainer}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={filters}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    selectedFilter === item && styles.filterButtonActive,
                  ]}
                  onPress={() => handleFilterSelect(item)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedFilter === item && styles.filterTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.filterList}
            />
          </View>

          <Animated.FlatList
            data={filteredData}
            keyExtractor={(item) => item._id.toString()} // Ensure `_id` is unique for each item
            renderItem={renderCompanyItem}
            contentContainerStyle={styles.listContainer}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={48}
                  color="#666"
                />
                <Text style={styles.emptyText}>No companies found</Text>
                <Text style={styles.emptySubtext}>
                  Try adjusting your search or filters
                </Text>
              </View>
            )}
          />
          {renderSidebar()}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 45,
    height: 45,
    marginRight: 12,
    borderRadius: 45,
  },
  headerTextContainer: {
    justifyContent: "center",
  },
  welcomeText: {
    color: "#95A5A6",
    fontSize: 14,
    fontWeight: "500",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
  },
  notificationButton: {
    padding: 8,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#E74C3C",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#ffffff",
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#2C3E50",
  },
  filterContainer: {
    marginBottom: 15,
  },
  filterList: {
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: "#F5F6FA",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  filterButtonActive: {
    backgroundColor: "#4A90E2",
    borderColor: "#4A90E2",
  },
  filterText: {
    color: "#7F8C8D",
    fontSize: 14,
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#ffffff",
  },
  listContainer: {
    padding: 15,
  },
  companyCard: {
    marginBottom: 15,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardGradient: {
    borderRadius: 16,
    padding: 16,
  },
  companyHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 15,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  companyLocation: {
    color: "#7F8C8D",
    marginLeft: 4,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 12,
  },
  companyStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    marginLeft: 6,
    color: "#7F8C8D",
    fontSize: 14,
    fontWeight: "500",
  },
  openingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  openingsText: {
    marginLeft: 6,
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    marginTop: 12,
  },
  emptySubtext: {
    color: "#95A5A6",
    marginTop: 4,
    fontSize: 14,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    zIndex: 1000,
  },
  overlayTouchable: {
    flex: 1,
  },
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.8,
    zIndex: 1001,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sidebarGradient: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  sidebarHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
  },
  closeButton: {
    padding: 8,
  },
  userInfoSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  sidebarProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 16,
  },
  sidebarUsername: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  sidebarEmail: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginBottom: 20,
  },
  userStats: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
  },
  userStatItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  statLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 15,
  },
  sidebarContent: {
    flex: 1,
    paddingTop: 20,
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  sidebarItemText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 16,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 16,
    borderRadius: 12,
  },
  logoutText: {
    color: "#E74C3C",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#007AFF",
  },
});
