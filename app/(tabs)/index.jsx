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
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {useNavigation } from "expo-router";

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

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export default function IndexScreen() {
  const [companyData, setCompanyData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [selectedFilter, setSelectedFilter] = useState("All");

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
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);

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

    // Apply search query filter
    if (query) {
      filtered = filtered.filter((company) =>
        company.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply category filter
    if (filter !== "All") {
      filtered = filtered.filter((company) => company.industry === filter);
    }

    setFilteredData(filtered);
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
              <MaterialCommunityIcons
                name="map-marker"
                size={14}
                color="#666"
              />{" "}
              {item.location}
            </Text>
          </View>
        </View>

        <View style={styles.companyStats}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="account-group"
              size={16}
              color="#007AFF"
            />
            <Text style={styles.statText}>{item.employees}</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.statText}>{item.rating}</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="briefcase"
              size={16}
              color="#4CAF50"
            />
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

  const handleCompanyPress = (companyId, logoUrl,companyName,location) => {
    router.push({
      pathname: "/CompanyDetails/CompanyDetailScreen",
      params: { companyId, logoUrl,companyName,location },
    });
  };
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContent}>
        <View style={styles.profileContainer}>
          <View style={styles.profileImage}>
            <MaterialCommunityIcons
              name="account-circle"
              size={40}
              color="#007AFF"
            />
          </View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    justifyContent: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: "#666",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  notificationButton: {
    position: "relative",
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  filterContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
  },
  filterList: {
    paddingHorizontal: 15,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: "#007AFF",
  },
  filterText: {
    fontSize: 14,
    color: "#666",
  },
  filterTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  listContainer: {
    padding: 15,
    paddingBottom: 50,
  },
  companyCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  companyHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  companyLocation: {
    fontSize: 14,
    color: "#666",
  },
  companyStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#666",
  },
  industryTag: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  industryText: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "600",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
