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
  Alert,
  Modal
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import CompanyInfo from "../../components/CompanyDetails/CompanyInfo";
import JobPostings from "../../components/CompanyDetails/JobPostings";
import Reviews from "../../components/CompanyDetails/Reviews";
import Gallery from "../../components/CompanyDetails/Gallery";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";


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
  const [isSaved, setIsSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const scrollY = useRef(new Animated.Value(0)).current;

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

  const checkIfSaved = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `https://ithub-backend.onrender.com/api/companies/saved-company/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsSaved(response.data.isSaved);
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
    checkIfSaved();
  }, [companyId]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${companyDetails.name} on our app!`,
        title: `${companyDetails.name} on ITHub`,
      });
    } catch (error) {
      console.error("Error sharing company details:", error);
      Alert.alert("Error", "Failed to share company details");
    }
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (isSaved) {
        await axios.delete(
          `https://ithub-backend.onrender.com/api/companies/saved-companies/${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsSaved(false);
        setModalMessage("Company removed from saved");
      } else {
        await axios.post(
          "https://ithub-backend.onrender.com/api/companies/save-company",
          {
            companyId,
            savedAt: new Date(),
            companyName: companyDetails.name,
            companyLogo: companyDetails.logo,
            companyLocation: companyDetails.location,
            companyEmployees: companyDetails.employees,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsSaved(true);
        setModalMessage("Company saved successfully");
      }
      setShowModal(true); // Show the success modal
    } catch (error) {
      console.error("Error saving company:", error);
      Alert.alert("Error", "Failed to update saved companies");
    }
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
            style={[
              styles.companyTitle,
              { transform: [{ scale: titleScale }] },
            ]}
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
          <TouchableOpacity
            onPress={handleShare}
            style={styles.actionButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="share" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            style={styles.actionButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons
              name={isSaved ? "bookmark" : "bookmark-border"}
              size={24}
              color="#fff"
            />
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
       <Modal
        visible={showModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <MaterialCommunityIcons
              name="check-circle"
              size={64}
              color="#27AE60"
            />
            <Text style={styles.modalTitle}>Success</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalButtonText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    top: 80,
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
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F6F9",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3498DB",
  },
  saveButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#3498DB",
    fontWeight: "600",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    marginVertical: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#27AE60",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
