import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const CompanyHeader = ({ companyData, setCompanyData, router, onprofileupdate }) => {
  const [isUploading, setIsUploading] = useState(false);


  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error logging out. Please try again.');
    }
  };

  const pickLogo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      uploadImage(localUri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      setIsUploading(true);
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('token');

      const response = await axios.post(
        'https://ithub-backend.onrender.com/api/companies/update-company-profile-pic',
        {
          companyId: companyData._id,
          image: uri
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.status === 200) {
        if (onprofileupdate) {
          await onprofileupdate();
          Alert.alert('Success', 'Logo updated successfully!');
        }


      } else {
        throw new Error(response.data.message || 'Failed to upload image.');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!companyData) {
    return (
      <View style={[styles.headerContainer, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={pickLogo} disabled={isUploading}>
        {isUploading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : companyData.logo ? (
          <Image source={{ uri: companyData.logo }} style={styles.companyLogo} />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Ionicons name="camera" size={24} color="#4A5568" />
            <Text style={styles.logoPlaceholderText}>Add Logo</Text>
          </View>
        )}
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <Text style={styles.companyName}>{companyData.name}</Text>
        <Text style={styles.companySubtitle}>
          {companyData.industry} • Founded {companyData.founded}
        </Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#FF4D4D" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  loadingContainer: {
    justifyContent: 'center',
  },
  companyLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  headerContent: {
    alignItems: 'center',
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  companySubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  logoutButton: {
    position: 'absolute',
    right: 15,
    top: 20,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoPlaceholderText: {
    fontSize: 12,
    color: '#7F8C8D',
  },
});

export default CompanyHeader;
