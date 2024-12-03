import React, { useState, useRef ,useEffect} from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Modal,ScrollView, TouchableOpacity, Animated } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Link, useNavigation } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute } from "@react-navigation/native";


const initialLayout = { width: Dimensions.get('window').width };
const HEADER_MAX_HEIGHT = 250;
const HEADER_MIN_HEIGHT = 120;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function CompanyDetailScreen() {
  const route = useRoute();
  const { logoUrl , companyName,location} = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'info', title: 'About' },
    { key: 'jobs', title: 'Jobs' },
    { key: 'reviews', title: 'Reviews' },
    { key: 'gallery', title: 'Gallery' },
  ]);

  const navigation = useNavigation();

 
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.8, 0.7],
    extrapolate: 'clamp',
  });

 
  const handleImageClick = (imageUri) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };
  
  const renderTabBar = props => (
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
          <Text style={[styles.tabLabel, focused ? styles.activeTabLabel : styles.inactiveTabLabel]}>
            {route.title}
          </Text>
        )}
      />
    </Animated.View>
  );

  const CompanyInfo = () => (
    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.tabContentContainer}
      scrollEventThrottle={16}
     
    >
      <View style={styles.infoContainer}>
        <View style={styles.statsContainer}>
          <StatBox icon="people" label="Employees" value="5000+" color="#4A90E2" />
          <StatBox icon="location-on" label="Locations" value="25" color="#50E3C2" />
          <StatBox icon="star" label="Rating" value="4.5" color="#F5A623" />
        </View>

        <Section title="About Us" icon="business" color="#4A90E2">
          <Text style={styles.description}>
            We are a leading technology company specializing in innovative solutions
            for enterprise clients. Our mission is to transform businesses through
            cutting-edge technology and exceptional service.
          </Text>
          <View style={styles.chipContainer}>
            <Chip icon="trending-up" text="Fast Growing" />
            <Chip icon="public" text="Global" />
            <Chip icon="psychology" text="Innovation Driven" />
          </View>
        </Section>

        <Section title="Benefits" icon="card-giftcard" color="#50E3C2">
  <View style={styles.benefitsGrid}>
    <View style={styles.benefitCard}>
      <MaterialCommunityIcons name="medical-bag" size={28} color="#2E7D32" />
      <Text style={styles.benefitTitle}>Premium Health Insurance</Text>
      <Text style={styles.benefitDescription}>
        Comprehensive health coverage for you and your family.
      </Text>
    </View>
    <View style={styles.benefitCard}>
      <MaterialCommunityIcons name="clock-outline" size={28} color="#2E7D32" />
      <Text style={styles.benefitTitle}>Flexible Hours</Text>
      <Text style={styles.benefitDescription}>
        Work-life balance with adaptable scheduling.
      </Text>
    </View>
    <View style={styles.benefitCard}>
      <MaterialCommunityIcons name="school-outline" size={28} color="#2E7D32" />
      <Text style={styles.benefitTitle}>$5000 Learning Budget</Text>
      <Text style={styles.benefitDescription}>
        Invest in your professional growth with generous funding.
      </Text>
    </View>
    <View style={styles.benefitCard}>
      <MaterialCommunityIcons name="airplane" size={28} color="#2E7D32" />
      <Text style={styles.benefitTitle}>Annual Retreats</Text>
      <Text style={styles.benefitDescription}>
        Relax and recharge with company-sponsored getaways.
      </Text>
    </View>
  </View>
</Section>


        <Section title="Culture" icon="mood" color="#F5A623">
  <View style={styles.cultureGrid}>
    <View style={styles.cultureCard}>
      <MaterialCommunityIcons name="lightbulb-on" size={30} color="#FFA500" />
      <Text style={styles.cultureTitle}>Innovation</Text>
      <Text style={styles.cultureScore}>Score: 90%</Text>
      <Text style={styles.cultureDescription}>Leading edge technology</Text>
    </View>
    <View style={styles.cultureCard}>
      <MaterialCommunityIcons name="clock-check-outline" size={30} color="#FFA500" />
      <Text style={styles.cultureTitle}>Work-Life Balance</Text>
      <Text style={styles.cultureScore}>Score: 85%</Text>
      <Text style={styles.cultureDescription}>Flexible scheduling</Text>
    </View>
    <View style={styles.cultureCard}>
      <MaterialCommunityIcons name="chart-line" size={30} color="#FFA500" />
      <Text style={styles.cultureTitle}>Growth</Text>
      <Text style={styles.cultureScore}>Score: 95%</Text>
      <Text style={styles.cultureDescription}>Career development</Text>
    </View>
  </View>
</Section>

      </View>
    </ScrollView>
  );

  const JobPostings = () => (
    <ScrollView 
      style={styles.tabContent}
      contentContainerStyle={styles.tabContentContainer}
      scrollEventThrottle={16}
   
    >
      {[1, 2, 3].map((job) => (
        <JobCard
          key={job}
          title={`Senior Software Engineer ${job}`}
          department="Engineering"
          location="San Francisco, CA"
          type="Full-time"
          salary="$120k - $180k"
        />
      ))}
    </ScrollView>
  );

  const Reviews = () => (
    <ScrollView 
      style={styles.tabContent}
      contentContainerStyle={styles.tabContentContainer}
      scrollEventThrottle={16}
     
    >
      {[1, 2, 3].map((review) => (
        <ReviewCard
          key={review}
          rating={4.5}
          title="Great place to work!"
          content="Amazing culture and opportunities for growth."
          author="Software Engineer"
          date="March 2024"
        />
      ))}
    </ScrollView>
  );

  const Gallery = () => (
    <ScrollView
    style={styles.tabContent}
    contentContainerStyle={styles.tabContentContainer}
    scrollEventThrottle={16}
  >
    <View style={styles.galleryGrid}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <TouchableOpacity key={item} onPress={() => handleImageClick(`https://picsum.photos/200/200?random=${item}`)}>
          <Image
            source={{ uri: `https://picsum.photos/200/200?random=${item}` }}
            style={styles.galleryImage}
          />
        </TouchableOpacity>
      ))}
    </View>

    {/* Modal for Full Image View */}
    {selectedImage && (
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseModal}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
          <Image source={{ uri: selectedImage }} style={styles.modalImage} />
        </View>
      </Modal>
    )}
  </ScrollView>
  );

  const renderScene = SceneMap({
    info: CompanyInfo,
    jobs: JobPostings,
    reviews: Reviews,
    gallery: Gallery,
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.Image
          source={{ uri: logoUrl}}
          style={[styles.headerImage, { opacity: imageOpacity }]}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.headerGradient}
        />
        <View style={styles.headerContent}>
          <View style={styles.companyLogoContainer}>
          <Image source={{ uri: logoUrl }} style={styles.companyLogo} />
          </View>
          <Animated.Text style={[styles.companyTitle, { transform: [{ scale: titleScale }] }]}>
            {companyName}
          </Animated.Text>
          <Text style={styles.companyTagline}>Innovating for Tomorrow</Text>
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={16} color="#fff" />
            <Text style={styles.locationText}>{location}</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="share" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="bookmark-border" size={24} color="white" />
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

const StatBox = ({ icon, label, value }) => (
  <View style={styles.statBox}>
    <MaterialIcons name={icon} size={24} color="#333" />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const BenefitItem = ({ icon, text }) => (
  <View style={styles.benefitItem}>
    <MaterialIcons name={icon} size={24} color="#666" />
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

const JobCard = ({ title, department, location, type, salary }) => (
  <TouchableOpacity style={styles.jobCard}>
    <View style={styles.jobHeader}>
      <Text style={styles.jobTitle}>{title}</Text>
      <MaterialIcons name="arrow-forward-ios" size={20} color="#666" />
    </View>
    <View style={styles.jobDetails}>
      <View style={styles.jobDetailItem}>
        <MaterialIcons name="business" size={16} color="#666" />
        <Text style={styles.jobDetailText}>{department}</Text>
      </View>
      <View style={styles.jobDetailItem}>
        <MaterialIcons name="location-on" size={16} color="#666" />
        <Text style={styles.jobDetailText}>{location}</Text>
      </View>
      <View style={styles.jobDetailItem}>
        <MaterialIcons name="work" size={16} color="#666" />
        <Text style={styles.jobDetailText}>{type}</Text>
      </View>
      <View style={styles.jobDetailItem}>
        <MaterialIcons name="attach-money" size={16} color="#666" />
        <Text style={styles.jobDetailText}>{salary}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const ReviewCard = ({ rating, title, content, author, date }) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesome
            key={star}
            name={star <= rating ? 'star' : 'star-o'}
            size={16}
            color="#FFD700"
          />
        ))}
      </View>
      <Text style={styles.reviewDate}>{date}</Text>
    </View>
    <Text style={styles.reviewTitle}>{title}</Text>
    <Text style={styles.reviewContent}>{content}</Text>
    <Text style={styles.reviewAuthor}>{author}</Text>
  </View>
);
const Chip = ({ icon, text }) => (
  <View style={styles.chip}>
    <MaterialIcons name={icon} size={16} color="#666" />
    <Text style={styles.chipText}>{text}</Text>
  </View>
);




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 2,
  },
  tabBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  headerActions: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 15,
  },
  companyTitle: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },

  tabBar: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    height: 48,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  activeTabLabel: {
    color: '#007AFF',
  },
  inactiveTabLabel: {
    color: '#666',
  },
  indicator: {
    backgroundColor: '#007AFF',
    height: 3,
  },
  tabContent: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabContentContainer: {
    paddingTop: HEADER_MAX_HEIGHT + 48, // Header height + TabBar height
    minHeight: Dimensions.get('window').height + HEADER_MAX_HEIGHT,
  },
  infoContainer: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minWidth: 100,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  benefitText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#444',
  },
  cultureTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cultureTag: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 5,
  },
  cultureTagText: {
    color: '#495057',
    fontSize: 14,
  },
  jobCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  jobDetails: {
    marginTop: 10,
  },
  jobDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  jobDetailText: {
    marginLeft: 10,
    color: '#666',
    fontSize: 14,
  },
  reviewCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewDate: {
    color: '#666',
    fontSize: 12,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  reviewContent: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 10,
  },
  reviewAuthor: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
  },
  galleryImage: {
    width: Dimensions.get('window').width / 2 - 15,
    height: Dimensions.get('window').width / 2 - 15,
    margin: 5,
    borderRadius: 10,
  },
  // New styles for enhanced features
  companyTagline: {
    position: 'absolute',
    bottom: 55,
    left: 20,
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  locationContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
    opacity: 0.9,
  },
  followButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginTop: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  chip: {
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipText: {
    fontSize: 12,
    color: '#444',
    marginLeft: 4,
  },
  cultureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 15,
   
  },
  cultureCard: {
    flexBasis: '48%', // Ensures two cards per row
    backgroundColor: '#F9F9F9', // Subtle off-white background
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginTop:10
  },
  cultureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  cultureScore: {
    fontSize: 14,
    color: '#555',
    marginVertical: 4,
  },
  cultureDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 15,
   
  },
  benefitCard: {
    flexBasis: '48%', // Ensures two cards per row
    backgroundColor: '#F9F9F9', // Subtle off-white background
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginTop:10
  },
  benefitTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#1B1B1B',
    textAlign: 'center',
  },
  benefitDescription: {
    marginTop: 6,
    fontSize: 13,
    color: '#4A4A4A',
    textAlign: 'center',
    lineHeight: 18,
  },
  
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  galleryImage: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalImage: {
    width: '90%',
    height: '80%',
    borderRadius: 10,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 10,
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },


});