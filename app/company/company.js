import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useNavigation } from "expo-router";
import axios from 'axios';

// Import the new components
import CompanyHeader from '../../components/companyScreen/CompanyHeader';
import SectionNavigation from '../../components/companyScreen/SectionNavigation';
import AboutSection from '../../components/companyScreen/AboutSection';
import JobsSection from '../../components/companyScreen/JobsSection';
import GallerySection from '../../components/companyScreen/GallerySection';
import ReviewsSection from '../../components/companyScreen/ReviewsSection';

const CompanyProfile = () => {
  const [companyData, setCompanyData] = useState(null);
  const [activeSection, setActiveSection] = useState('about');
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTransparent: false,
      headerTitle: "",
    });
  }, []);

  const fetchCompanyData = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('https://ithub-backend.onrender.com/api/companies/companydetails', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanyData(response.data);

      setEditableData(response.data);
    } catch (error) {
      await AsyncStorage.removeItem('token');
      console.error('Error fetching company data:', error);
      Alert.alert('Error', 'Could not fetch company details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const childcallback = async () => {
    // Refetch the entire company data when a new job is added
    await fetchCompanyData();
  };

  const renderContent = () => {
    if (!companyData) {
      return (
        <View style={styles.loadingContainer}>
          <Text>Loading company details...</Text>
        </View>
      );
    }

    switch (activeSection) {
      case 'about':
        return <AboutSection
          companyData={companyData}
          editableData={editableData}
          setCompanyData={setCompanyData}
          setEditableData={setEditableData}
        />;
      case 'jobs':
        return <JobsSection
          companyData={companyData}
          editableData={editableData}
          setEditableData={setEditableData}
          onJobAdded={childcallback} // Pass the callback to refetch data
          isLoading={isLoading} // Pass loading state to disable interactions
        />;
      case 'gallery':
        return <GallerySection
          companyData={companyData}
          editableData={editableData}
          onImageAdded={childcallback}
          setEditableData={setEditableData}
        />;
      case 'reviews':
        return <ReviewsSection
          companyData={companyData}
          editableData={editableData}
          setEditableData={setEditableData}
          onReviewAdded={childcallback}
        />;
      default:
        return <Text style={styles.sectionContent}>Content not available.</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <CompanyHeader
        companyData={companyData}
        onprofileupdate={childcallback}
        router={router}
      />
      <SectionNavigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContent: {
    padding: 15,
    backgroundColor: 'white',
  },
});

export default CompanyProfile;