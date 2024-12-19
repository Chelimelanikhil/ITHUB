import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

const HEADER_MAX_HEIGHT = 250;
const COLORS = {
  primary: '#4A90E2',
  secondary: '#50E3C2',
  background: '#F4F7F9',
  text: '#2C3E50',
  white: '#FFFFFF',
  gray: '#7F8C8D',
};

const StatCard = ({ icon, label, value, iconColor }) => (
  <View style={styles.statCard}>
    <View style={styles.statIconContainer}>
      <MaterialIcons name={icon} size={28} color={iconColor} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const SectionHeader = ({ title, icon }) => (
  <View style={styles.sectionHeader}>
    <Ionicons name={icon} size={24} color={COLORS.primary} style={styles.sectionHeaderIcon} />
    <Text style={styles.sectionHeaderText}>{title}</Text>
  </View>
);

const SocialButton = ({ platform, url, icon }) => {
  const openLink = () => {
    if (url) Linking.openURL(url);
  };

  return (
    <TouchableOpacity style={styles.socialButton} onPress={openLink}>
      <FontAwesome5 name={icon} size={20} color={COLORS.white} />
    </TouchableOpacity>
  );
};

const CompanyInfo = ({ companyData }) => {
  const {
    name,
    logo,
    email,
    description,
    industry,
    phone,
    location,
    foundedYear,
    headquarters,
    employees,
    rating,
    website,
    socialLinks = {},
    about
  } = companyData;

  const socialPlatforms = {
    linkedin: 'linkedin',
    twitter: 'twitter',
    facebook: 'facebook',
    instagram: 'instagram',
    github: 'github'
  };

  return (
    <ScrollView style={styles.tabContent} contentContainerStyle={styles.tabContentContainer} scrollEventThrottle={16}>
      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <StatCard
          icon="people"
          label="Employees"
          value={`${employees}+`}
          iconColor="#4A90E2"
        />
        <StatCard
          icon="location-on"
          label="Headquarters"
          value={headquarters}
          iconColor="#50E3C2"
        />
        <StatCard
          icon="star"
          label="Rating"
          value={rating.toFixed(1)}
          iconColor="#F5A623"
        />
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <SectionHeader title="About Company" icon="information-circle-outline" />
        <Text style={styles.descriptionText}>
          {about || description || "No description available."}
        </Text>
      </View>

      {/* Company Details */}
      <View style={styles.section}>
        <SectionHeader title="Company Details" icon="business-outline" />
        <View style={styles.detailsContainer}>
          <TouchableOpacity
            style={styles.detailRow}
            onPress={() => Linking.openURL(`${website}`)}

            disabled={!website}
          >
            <Ionicons
              name="globe-outline"
              size={20}
              color={website ? COLORS.primary : COLORS.gray}
            />
            <Text
              style={[
                styles.detailText,
                !website && styles.disabledText
              ]}
            >
              {website || 'No website available'}
            </Text>
          </TouchableOpacity>
          <View style={styles.detailRow}>
            <TouchableOpacity
              style={styles.detailRow}
              onPress={() => Linking.openURL(`mailto:${email}`)}
            >
              <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
              <Text style={styles.detailText}>{email}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.detailRow}>
            <TouchableOpacity
              style={styles.detailRow}
              onPress={() => Linking.openURL(`tel:${phone}`)}
            >
              <Ionicons name="call-outline" size={20} color={COLORS.primary} />
              <Text style={styles.detailText}>{phone}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={20} color={COLORS.primary} />
            <Text style={styles.detailText}>{location}</Text>
          </View>
        </View>
      </View>

      {/* Social Links */}
      {Object.keys(socialLinks).length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Connect With Us" icon="share-social-outline" />
          <View style={styles.socialContainer}>
            {Object.entries(socialLinks)
              .filter(([platform]) => socialPlatforms[platform.toLowerCase()])
              .map(([platform, url]) => (
                <SocialButton
                  key={platform}
                  platform={platform}
                  url={url}
                  icon={socialPlatforms[platform.toLowerCase()]}
                />
              ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabContentContainer: {
    paddingTop: HEADER_MAX_HEIGHT + 48, // Header height + TabBar height
    minHeight: Dimensions.get('window').height + HEADER_MAX_HEIGHT,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  companyLogo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  companyTagline: {
    fontSize: 16,
    color: COLORS.gray,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: COLORS.white,
    marginVertical: 15,
    borderRadius: 15,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCard: {
    alignItems: 'center',
    width: '30%',
  },
  statIconContainer: {
    backgroundColor: '#F0F4F8',
    borderRadius: 25,
    padding: 10,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  section: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionHeaderIcon: {
    marginRight: 10,
  },
  sectionHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
  },
  detailsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.text,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingVertical: 15,
  },
  socialButton: {
    backgroundColor: COLORS.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});

export default CompanyInfo;