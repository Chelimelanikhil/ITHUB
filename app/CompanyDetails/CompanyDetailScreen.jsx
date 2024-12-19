import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Share,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import CompanyInfo from "../../components/CompanyDetails/CompanyInfo";
import JobPostings from "../../components/CompanyDetails/JobPostings";
import Reviews from "../../components/CompanyDetails/Reviews";
import Gallery from "../../components/CompanyDetails/Gallery";
import axios from 'axios';

const initialLayout = { width: Dimensions.get("window").width };
const HEADER_MAX_HEIGHT = 250;
const HEADER_MIN_HEIGHT = 120;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function CompanyDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { companyId } = route.params;

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "info", title: "About" },
    { key: "jobs", title: "Jobs" },
    { key: "reviews", title: "Reviews" },
    { key: "gallery", title: "Gallery" },
  ]);

  const [companyDetails, setCompanyDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });

    const fetchCompanyDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://ithub-backend.onrender.com/api/companies/companydetails/${companyId}`
        );
        setCompanyDetails(response.data);
       
   
      } catch (error) {
        console.error("Error fetching company details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [companyId]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${companyDetails.name} on our app!`,
      });
    } catch (error) {
      console.error("Error sharing company details:", error);
    }
  };

  const handleSave = () => {
    // Implement save functionality (e.g., save to local storage or database)
    console.log("Company saved:", companyDetails.name);
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.8, 0.7],
    extrapolate: "clamp",
  });

  const renderTabBar = (props) => (
    <Animated.View style={[styles.tabBarContainer, { top: headerHeight }]}>
      <TabBar
        {...props}
        style={styles.tabBar}
        indicatorStyle={styles.indicator}
        labelStyle={styles.tabLabel}
        activeColor="#007AFF"
        inactiveColor="#666"
        pressColor="transparent"
        renderLabel={({ route, focused }) => (
          <Text
            style={[
              styles.tabLabel,
              focused ? styles.activeTabLabel : styles.inactiveTabLabel,
            ]}
          >
            {route.title}
          </Text>
        )}
      />
    </Animated.View>
  );

  const renderScene = ({ route }) => {
    if (!companyDetails) return null;

    switch (route.key) {
      case "info":
        return <CompanyInfo companyData={companyDetails} />;
      case "jobs":
        return <JobPostings jobs={companyDetails.jobs} />;
      case "reviews":
        return <Reviews reviews={companyDetails.reviews} />;
      case "gallery":
        return <Gallery gallery={companyDetails.gallery} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!companyDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load company details.</Text>
      </View>
    );
  }

  const { logo, name, location } = companyDetails;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.Image
          source={{ uri: logo }}
          style={[styles.headerImage, { opacity: imageOpacity }]}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.headerGradient}
        />
        <View style={styles.headerContent}>
          <View style={styles.companyLogoContainer}>
            <Image source={{ uri: logo }} style={styles.companyLogo} />
          </View>
          <Animated.Text
            style={[styles.companyTitle, { transform: [{ scale: titleScale }] }]}
          >
            {name}
          </Animated.Text>
          <Text style={styles.companyTagline}>Innovating for Tomorrow</Text>
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={16} color="#fff" />
            <Text style={styles.locationText}>{location}</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
            <MaterialIcons name="share" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={styles.actionButton}>
            <MaterialIcons name="bookmark" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    zIndex: 2,
  },
  tabBarContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: "#fff",
    elevation: 4,
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerContent: {
    position: "absolute",
    bottom: 20,
    left: 20,
    zIndex: 2,
  },
  companyLogoContainer: {
    marginBottom: 10,
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  companyTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  companyTagline: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 5,
    opacity: 0.9,
  },
  headerActions: {
    position: "absolute",
    top: 50,
    right: 20,
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 15,
  },
  tabBar: {
    backgroundColor: "#fff",
    elevation: 0,
  },
  indicator: {
    backgroundColor: "#007AFF",
  },
  tabLabel: {
    fontSize: 14,
  },
  activeTabLabel: {
    fontWeight: "bold",
    color: "#007AFF",
  },
  inactiveTabLabel: {
    color: "#666",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

