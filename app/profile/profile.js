import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ProfileScreen() {
  const route = useRoute();
  const { name, email, role, profilePic } = route.params || {};
  const userData = { name, email, role, profilePic };
    
  const [localUserData, setLocalUserData] = useState(userData);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(userData?.name || '');
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant access to your photo library to change profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setNewProfilePic(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handlePasswordReset = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    

    setIsLoading(true);
    setError(null);

    try {
      //const token = await AsyncStorage.getItem('token');
      const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NjkwNmUyMWQxOGY3MWMwODJjMzU5MCIsImVtYWlsIjoibmlraGlsQGdtYWlsLmNvbSIsImlhdCI6MTczNDkzNzMwNCwiZXhwIjoxNzM0OTczMzA0fQ.EFnkRFliPyBCv91XFe-3mWfg8Rn0NytQpSkUwT6NHPQ";
      
      if (!token) {
        Alert.alert('Error', 'Authentication token not found. Please login again.');
        // Add navigation to login screen if needed
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/auth/profile/reset-password',
        {
          currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Password updated successfully');
        setShowPasswordFields(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(response.data.message || 'Failed to update password');
        Alert.alert('Error', response.data.message || 'Failed to update password');
      }
    } catch (error) {
      let errorMessage = 'An error occurred while updating password';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Current password is incorrect';
        } else if (error.response.status === 403) {
          await AsyncStorage.removeItem('token');
          errorMessage = 'Session expired. Please login again.';
          // Add navigation to login screen if needed
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }

      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (newName === localUserData.name && !newProfilePic) {
      Alert.alert('No Changes', 'No changes to save');
      return;
    }

    setLocalUserData(prev => ({
      ...prev,
      name: newName,
      profilePic: newProfilePic ? newProfilePic.uri : prev.profilePic
    }));

    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const renderPasswordSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Security</Text>
      {showPasswordFields ? (
        <>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Current Password"
            secureTextEntry
            placeholderTextColor="#A0A0A0"
            editable={!isLoading}
          />
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New Password"
            secureTextEntry
            placeholderTextColor="#A0A0A0"
            editable={!isLoading}
          />
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm New Password"
            secureTextEntry
            placeholderTextColor="#A0A0A0"
            editable={!isLoading}
          />
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              onPress={() => {
                setShowPasswordFields(false);
                setError(null);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }} 
              style={[styles.button, styles.cancelButton]}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handlePasswordReset} 
              style={[
                styles.button, 
                styles.saveButton,
                isLoading && styles.disabledButton
              ]}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Updating...' : 'Update Password'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <TouchableOpacity 
          onPress={() => setShowPasswordFields(true)}
          style={[styles.button, styles.securityButton]}
        >
          <MaterialCommunityIcons name="lock-reset" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (!localUserData) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>No user data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} bounces={false}>
      <LinearGradient
        colors={['#2C3E50', '#3498DB', '#2980B9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.profilePicWrapper}>
            <TouchableOpacity 
              onPress={isEditing ? handleImagePick : null} 
              style={styles.profilePicContainer}
            >
              {localUserData.profilePic || newProfilePic ? (
                <Image 
                  source={{ 
                    uri: newProfilePic ? newProfilePic.uri : localUserData.profilePic 
                  }} 
                  style={styles.profilePic} 
                />
              ) : (
                <MaterialCommunityIcons name="account-circle" size={132} color="white" />
              )}
              {isEditing && (
                <View style={styles.editOverlay}>
                  <MaterialCommunityIcons name="camera" size={28} color="white" />
                </View>
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.headerName}>
            {isEditing ? newName : localUserData.name}
          </Text>
          <View style={styles.roleContainer}>
            <MaterialCommunityIcons name="badge-account" size={20} color="white" />
            <Text style={styles.headerRole}>{localUserData.role}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={isEditing ? newName : localUserData.name}
              onChangeText={setNewName}
              editable={isEditing}
              placeholder="Enter your name"
              placeholderTextColor="#A0A0A0"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={localUserData.email}
              editable={false}
              placeholder="Email"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Role</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={localUserData.role}
              editable={false}
              placeholder="Role"
            />
          </View>

          {isEditing ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                onPress={() => {
                  setIsEditing(false);
                  setNewName(localUserData.name);
                  setNewProfilePic(null);
                }} 
                style={[styles.button, styles.cancelButton]}
              >
                <MaterialCommunityIcons name="close" size={20} color="white" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleSave} 
                style={[styles.button, styles.saveButton]}
              >
                <MaterialCommunityIcons name="check" size={20} color="white" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              onPress={() => setIsEditing(true)} 
              style={[styles.button, styles.editButton]}
            >
              <MaterialCommunityIcons name="account-edit" size={24} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {renderPasswordSection()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerContent: {
    alignItems: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#F8F9FF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  profilePicWrapper: {
    padding: 3,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  profilePicContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: 'white',
  },
  profilePic: {
    width: '100%',
    height: '100%',
  },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  headerRole: {
    fontSize: 16,
    color: 'white',
    marginLeft: 6,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 10,
  },
  disabledInput: {
    backgroundColor: '#F5F6FF',
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#3498DB',
  },
  editButton: {
    backgroundColor: '#3498DB',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#E74C3C',
  },
  securityButton: {
    backgroundColor: '#2C3E50',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});