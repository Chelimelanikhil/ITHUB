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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useNavigation } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockCompanyData = [
  {
    id: "1",
    name: "Brio Technology",
    logoUrl: "https://media.licdn.com/dms/image/v2/D560BAQHTymg_NyJrwg/company-logo_200_200/company-logo_200_200/0/1712632817168/brio_technologies_private_limited_logo?e=2147483647&v=beta&t=5kq8-2uUpleI6zuMyAo2SmRG6iiph3Jr_xguvasp4ds",
    employees: "2,500+",
    industry: "Technology",
    location: "San Francisco, CA",
    rating: 4.5,
    openPositions: 12,
  },
  {
    id: "2",
    name: "Devlats",
    logoUrl: "https://media.licdn.com/dms/image/v2/C4E0BAQFyk_AKHV1xuQ/company-logo_200_200/company-logo_200_200/0/1670997991914?e=2147483647&v=beta&t=w-OZv7VVU72Zau6sVsWglugRuvF4i6FWI47wzPgE-EE",
    employees: "1,800+",
    industry: "Software",
    location: "New York, NY",
    rating: 4.8,
    openPositions: 8,
  },
  {
    id: "3",
    name: "HRH",
    logoUrl: "https://media.licdn.com/dms/image/v2/D560BAQGmg0DmYXr91g/company-logo_200_200/company-logo_200_200/0/1701960694233/hrh_next_services_limited_logo?e=2147483647&v=beta&t=mGc9IUHdx9vwgyBJPBVf1SmSiQd3n-iQhGxeBPPhVhw",
    employees: "3,200+",
    industry: "AI & Machine Learning",
    location: "Austin, TX",
    rating: 4.6,
    openPositions: 15,
  },
  {
    id: "4",
    name: "ScoutBetter",
    logoUrl: "https://media.licdn.com/dms/image/v2/D560BAQFBw_MRI4Bbeg/company-logo_200_200/company-logo_200_200/0/1724181515065/scoutbetter_logo?e=2147483647&v=beta&t=ozowCOBCb6yEnRtLbfiFXO6J8P8v7F4V49XXbyOF-lU",
    employees: "3,200+",
    industry: "AI & Machine Learning",
    location: "Austin, TX",
    rating: 4.6,
    openPositions: 15,
  },
  {
    id: "5",
    name: "Darani",
    logoUrl: "https://media.licdn.com/dms/image/v2/D560BAQGGR2mWHw-QYw/company-logo_200_200/company-logo_200_200/0/1716447748057/dharani_geospatial_technologies_llp_logo?e=2147483647&v=beta&t=X-UXx-HbB527KLpHZJUiT7poHXEZWez2SjYTzKCk_1A",
    employees: "3,200+",
    industry: "AI & Machine Learning",
    location: "Austin, TX",
    rating: 4.6,
    openPositions: 15,
  },
  {
    id: "6",
    name: "Pranathi",
    logoUrl: "https://media.licdn.com/dms/image/v2/D4D0BAQEO6b0DY2AKOg/company-logo_200_200/company-logo_200_200/0/1705583481963/pranathi_software_services_pvt_ltdd_logo?e=2147483647&v=beta&t=5u4dsibStF4u83oWZFgtcrNJM1jphlqQ9BKpT-fpRcQ",
    employees: "3,200+",
    industry: "AI & Machine Learning",
    location: "Austin, TX",
    rating: 4.6,
    openPositions: 15,
  },
];

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function IndexScreen() {
  const [companyData, setCompanyData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(-300)).current;

  const filters = ["All", "Technology", "Software", "AI & Machine Learning"];

  useEffect(() => {
    setTimeout(() => {
      setCompanyData(mockCompanyData);
      setFilteredData(mockCompanyData);
      setLoading(false);
    }, 2000);
  }, []);

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTransparent: false,
      headerTitle: "",
    });
  }, []);

  const toggleSidebar = () => {
    const toValue = sidebarVisible ? -300 : 0;
    Animated.timing(sidebarAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSidebarVisible(!sidebarVisible);
    });
  };

  const handleLogout = async () => {
    try {
      // Clear the user token from AsyncStorage
      await AsyncStorage.removeItem('token');
      
      // Show a success message
      //ToastAndroid.show('Logged out successfully', ToastAndroid.SHORT);
  
      // Redirect to the SignIn screen
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      //ToastAndroid.show('Error logging out. Please try again.', ToastAndroid.LONG);
    }
  };

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

  const handleCompanyPress = (companyId, logoUrl, companyName, location) => {
    router.push({
      pathname: "/CompanyDetails/CompanyDetailScreen",
      params: { companyId, logoUrl, companyName, location },
    });
  };

  const renderCompanyItem = ({ item, index }) => {
    const scale = scrollY.interpolate({
      inputRange: [-1, 0, index * 350, (index + 1) * 350],
      outputRange: [1, 1, 1, 0.9],
      extrapolate: "clamp",
    });

    return (
      <AnimatedTouchableOpacity
        onPress={() => handleCompanyPress(item.id, item.logoUrl, item.name, item.location)}
        style={[styles.companyCard, { transform: [{ scale }] }]}
      >
        <View style={styles.companyHeader}>
          <Image source={{ uri: item.logoUrl }} style={styles.companyLogo} />
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{item.name}</Text>
            <Text style={styles.companyLocation}>
              <MaterialCommunityIcons name="map-marker" size={14} color="#666" />{" "}
              {item.location}
            </Text>
          </View>
        </View>

        <View style={styles.companyStats}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="account-group" size={16} color="#007AFF" />
            <Text style={styles.statText}>{item.employees}</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.statText}>{item.rating}</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="briefcase" size={16} color="#4CAF50" />
            <Text style={styles.statText}>{item.openPositions} open roles</Text>
          </View>
        </View>
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
      <View style={styles.headerContent}>
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={toggleSidebar}>
            <View style={styles.profileImage}>
              <MaterialCommunityIcons name="account-circle" size={40} color="#007AFF" />
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.profileName}>John Doe</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
          <MaterialCommunityIcons name="bell" size={28} color="#333" />
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
              <TouchableOpacity onPress={toggleSidebar} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={28} color="#fff" />
              </TouchableOpacity>

              {/* Profile Image */}
              <View style={styles.profileSection}>
                <Image
                  source={{ uri: "https://via.placeholder.com/100" }}
                  style={styles.profilePic}
                />
                <Text style={styles.sidebarProfileName}>John Doe</Text>
                <Text style={styles.sidebarProfileEmail}>johndoe@example.com</Text>
              </View>

              {/* Sidebar Options */}
              <View style={styles.sidebarOptions}>
                <TouchableOpacity style={styles.sidebarOption}>
                  <MaterialCommunityIcons
                    name="account-edit"
                    size={24}
                    color="#007AFF"
                  />
                  <Text style={styles.sidebarOptionText}>Edit Profile</Text>
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
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                  <MaterialCommunityIcons name="logout" size={24} color="#fff" />
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
        keyExtractor={(item) => item.id}
        renderItem={renderCompanyItem}
        contentContainerStyle={styles.listContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#666" />
            <Text style={styles.emptyText}>No companies found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    marginRight: 10,
  },
  welcomeText: {
    color: '#666',
    fontSize: 14,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
  },
  searchContainer: {
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    height: 50,
    marginLeft: 10,
  },
  filterContainer: {
    paddingVertical: 10,
  },
  filterList: {
    paddingHorizontal: 15,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: '#666',
  },
  filterTextActive: {
    color: 'white',
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  companyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  companyLocation: {
    color: '#666',
    marginTop: 5,
  },
  companyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 5,
    color: '#666',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#007AFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  emptySubtext: {
    color: '#666',
    marginTop: 5,
  },
  sidebarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "105%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Darker overlay for better focus
    zIndex: 1000,
  },
  sidebarContent: {
    width: 250,
    height: "100%",
    backgroundColor: "#2E4057", // Dark, professional gradient start
    padding: 20,
    paddingTop: 50,
    zIndex: 1001,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderColor: "#5DADE2", // Modern blue highlight
    borderWidth: 3,
  },
  sidebarProfileName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FDFEFE", // Pure white
    marginBottom: 5,
  },
  sidebarProfileEmail: {
    fontSize: 14,
    color: "#D5D8DC", // Subtle gray
  },
  divider: {
    height: 1,
    backgroundColor: "#566573", // Thin, subtle divider
    marginVertical: 20,
  },
  sidebarOptions: {
    flex: 1,
  },
  sidebarOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  sidebarOptionText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#FDFEFE", // White for text
    fontWeight: "500",
  },
  sidebarOptionActive: {
    backgroundColor: "#34495E", // Highlighted background for active items
  },
  logoutContainer: {
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#E74C3C", // Vivid red for logout
    borderRadius: 10,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#FDFEFE", // White text
    fontWeight: "600",
  },
});