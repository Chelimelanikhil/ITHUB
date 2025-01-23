// onboard.js
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BasicInfoStep } from '../../components/CompanyOnboarding/BasicInfoStep';
import { AboutStep } from '../../components/CompanyOnboarding/AboutStep';

import { JobsStep } from '../../components/CompanyOnboarding/JobsStep';
import { ReviewsStep } from '../../components/CompanyOnboarding/ReviewsStep';

import { GalleryStep } from '../../components/CompanyOnboarding/GalleryStep';

import { NavigationButtons } from '../../components/CompanyOnboarding/NavigationButtons';
import { StepIndicator } from '../../components/CompanyOnboarding/StepIndicator';



import { PaymentStep } from '../../components/CompanyOnboarding/PaymentStep';


// Main Component
export default function CompanyOnboarding() {
  const router = useRouter();
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [companyProfile, setCompanyProfile] = useState({
    basicInfo: {
      name: '',
      logo: '',
      location: '',
      industry: '',
      founded: '',
      employees: '',
      email: '',
      rating: '',
      website: '',
      phone: '',
      headquarters: '',
      socialLinks: {
        linkedin: '',
        twitter: ''
      },
      openings: '',
      description: '',
      certifications: []
    },
    about: '',
    jobs: [],
    reviews: [],
    gallery: []
  });

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTransparent: false,
      headerTitle: "",
    });
  }, []);

  const handleNextStep = () => setCurrentStep(prev => prev + 1);
  const handlePreviousStep = () => setCurrentStep(prev => prev - 1);

  

  const handleSubmit = async () => {
    debugger
    console.log('Company Profile:', companyProfile);
    try {
      //const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ODlmZjdkOTZkOGM0ZWM1ZGY3NTFiZCIsImVtYWlsIjoiUHJhbmF0aGlAZ2FtaWwuY29tIiwiaWF0IjoxNzM3MzUxNzA0LCJleHAiOjE3MzgyMTU3MDR9.b1qCfSOIKvwwLBjymJx8hs9TiqKcR9dhnyvRCAsNskM";
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        'https://ithub-backend.onrender.com/api/companies/onboarding',
        companyProfile,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      router.replace('/company/company');
    } catch (error) {
      console.error('Onboarding submission error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StepIndicator currentStep={currentStep} styles={styles} />
        <KeyboardAvoidingView
          style={styles.contentContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formContainer}>
              {currentStep === 1 && (
                <BasicInfoStep
                  companyProfile={companyProfile}
                  setCompanyProfile={setCompanyProfile}
                  styles={styles}
                />
              )}
              {currentStep === 2 && (
                <AboutStep
                  companyProfile={companyProfile}
                  setCompanyProfile={setCompanyProfile}
                  styles={styles}
                />
              )}
              {currentStep === 3 && (
                <JobsStep
                  companyProfile={companyProfile}
                  setCompanyProfile={setCompanyProfile}
                  styles={styles}
                />
              )}
              {currentStep === 4 && (
                <ReviewsStep
                  companyProfile={companyProfile}
                  setCompanyProfile={setCompanyProfile}
                  styles={styles}
                />
              )}
              {currentStep === 5 && (
                <GalleryStep
                  companyProfile={companyProfile}
                  setCompanyProfile={setCompanyProfile}
                  styles={styles}
                />
              )}
              {currentStep === 6 && (
                <PaymentStep
                  companyProfile={companyProfile}
                  setCompanyProfile={setCompanyProfile}
                  styles={styles}
                />
              )}
              <NavigationButtons
                currentStep={currentStep}
                onBack={handlePreviousStep}
                onNext={currentStep === 6 ? handleSubmit : handleNextStep}
                isLastStep={currentStep === 6}
                styles={styles}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  contentContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  formContainer: {
    padding: 20,
  },

});