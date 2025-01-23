import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert,SafeAreaView  } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import SuccessAlert from '../../components/Alert/SuccessAlert';

const Profile = ({ userData, onClose, onUpdate }) => {
  const [localUserData, setLocalUserData] = useState(userData);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(userData?.name || '');
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);


  

  const scrollViewRef = useRef(null);

  const handleShowPasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
    
    // Scroll to password section
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  };

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
    
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        Alert.alert('Error', 'Authentication token not found. Please login again.');
        return;
      }
  
      const response = await axios.post(
        'https://ithub-backend.onrender.com/api/auth/profile/reset-password',
        {
          currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setShowSuccessAlert(true);
        setShowPasswordFields(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
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
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
  
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
  
    setIsSaving(true);
  
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found. Please login again.');
        return;
      }
  
      const response = await axios.put(
        'https://ithub-backend.onrender.com/api/auth/profile/update-profile',
        {
          name: newName,
          profilePic: newProfilePic?.uri || localUserData.profilePic,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.status === 200) {
        const updatedUserData = {
          ...localUserData,
          name: newName,
          profilePic: newProfilePic?.uri || localUserData.profilePic,
        };
        setLocalUserData(updatedUserData);
        
        if (onUpdate && typeof onUpdate === 'function') {
          await onUpdate();
        }
        
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      let errorMessage = 'An error occurred while updating the profile';
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
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
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                setShowPasswordFields(false);
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
                {isLoading ? 'Updating...' : 'Update'}
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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Settings</Text>
        {!isEditing && (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <MaterialCommunityIcons name="pencil" size={24} color="#2C3E50" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.profileSection}>
          <TouchableOpacity 
            onPress={isEditing ? handleImagePick : null}
            style={styles.profileImageContainer}
          >
            <Image
              source={newProfilePic ? { uri: newProfilePic.uri } : { uri: localUserData.profilePic }}
              style={styles.profileImage}
            />
            {isEditing && (
              <View style={styles.editImageOverlay}>
                <MaterialCommunityIcons name="camera" size={24} color="white" />
              </View>
            )}
          </TouchableOpacity>
          
          <Text style={styles.nameText}>
            {isEditing ? newName : localUserData.name}
          </Text>
          <Text style={styles.roleText}>{localUserData.role}</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[
                styles.input, 
                !isEditing && styles.disabledInput
              ]}
              value={isEditing ? newName : localUserData.name}
              onChangeText={setNewName}
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={localUserData.email}
              editable={false}
            />
          </View>

          {isEditing && (
            <View style={styles.actionButtonContainer}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => {
                  setIsEditing(false);
                  setNewName(localUserData.name);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleSave}
                disabled={isSaving}
              >
                <Text style={styles.buttonText}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.securityContainer}>
          <Text style={styles.sectionTitle}>Security</Text>
          <TouchableOpacity 
            style={styles.securityButton} 
            onPress={handleShowPasswordFields}
          >
            <MaterialCommunityIcons name="lock" size={24} color="#2C3E50" />
            <Text style={styles.securityButtonText}>
              {showPasswordFields ? 'Hide' : 'Change Password'}
            </Text>
          </TouchableOpacity>

          {showPasswordFields && (
            <View style={styles.passwordFieldsContainer}>
              <TextInput
                style={styles.input}
                placeholder="Current Password"
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity 
                style={styles.updatePasswordButton}
                onPress={handlePasswordReset}
              >
                <Text style={styles.buttonText}>Update Password</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <SuccessAlert
          visible={showSuccessAlert}
          message="Your password has been successfully changed. Please use your new password the next time you log in."
          onClose={() => setShowSuccessAlert(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  backButton: {
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 30,
    marginBottom: 15,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#3498DB',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  editImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 10,
    color: '#2C3E50',
  },
  roleText: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  formContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 5,
   
  },
  disabledInput: {
    backgroundColor: '#F5F5F5',
    color: '#7F8C8D',
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E74C3C',
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3498DB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  securityContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 15,
  },
  securityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 15,
    borderRadius: 8,
  },
  securityButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#2C3E50',
  },
  passwordFieldsContainer: {
    marginTop: 15,
  },
  updatePasswordButton: {
    backgroundColor: '#2C3E50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
});

export default Profile;