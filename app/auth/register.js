import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid, ActivityIndicator, Switch, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isCompany, setIsCompany] = useState(false); // Track if the user is a company or not
  const [profilePic, setProfilePic] = useState(null);
  const navigation = useNavigation();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);


  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
    });
  }, []);




  const validateInputs = () => {
    if (!name || !email || !password) {
      ToastAndroid.show('Please fill in all fields.', ToastAndroid.SHORT);
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      ToastAndroid.show('Please enter a valid email.', ToastAndroid.SHORT);
      return false;
    }
    if (password !== confirmPassword) {
      ToastAndroid.show('Passwords do not match', ToastAndroid.SHORT);
      return false;
    }

    return true;
  };
  const handleRegister = async () => {

    if (!validateInputs()) return;


    setIsLoading(true);

    try {
      const formData = {
        name,
        email,
        password,
        role: isCompany ? 'company' : 'user',
        profilePic: profilePic ? profilePic.uri : null, // Include profilePic if selected
      };

      const response = await axios.post('https://ithub-backend.onrender.com/api/auth/register', formData);


      if (response.data.message === 'User registered successfully') {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('role', response.data.role);

        router.replace(response.data.role === 'company' ? '/onboard/onboard' : '/auth/login');

        ToastAndroid.show('Registration successful', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(response.data.message || 'Registration failed', ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show(
        error.response?.data?.message || 'Network error. Please try again later.',
        ToastAndroid.SHORT
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleImagePick = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      ToastAndroid.show('Permission to access the media library is required!', ToastAndroid.SHORT);
      return;
    }

    // Open the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      // Validate the image
      if (selectedImage.uri && selectedImage.type === 'image') {
        setProfilePic(selectedImage);
      } else {
        ToastAndroid.show('Invalid image selected', ToastAndroid.SHORT);
      }
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TouchableOpacity onPress={handleImagePick} style={styles.profilePicContainer}>
        {profilePic ? (
          <Image source={{ uri: profilePic.uri }} style={styles.profilePic} />
        ) : (
          <MaterialCommunityIcons name="account-circle" size={80} color="gray" />
        )}
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="account" size={24} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="email" size={24} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock" size={24} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!isPasswordVisible} // Toggle based on visibility state
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)}>
          <MaterialCommunityIcons
            name={isPasswordVisible ? "eye-off" : "eye"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock" size={24} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={!isConfirmPasswordVisible} // Toggle based on visibility state
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setConfirmPasswordVisible(!isConfirmPasswordVisible)}>
          <MaterialCommunityIcons
            name={isConfirmPasswordVisible ? "eye-off" : "eye"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      {/* Toggle for selecting Role */}
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText}>Are you a company?</Text>
        <Switch
          value={isCompany}
          onValueChange={setIsCompany}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isCompany ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
        <Text style={styles.buttonText}> {isLoading ? 'Signing Up...' : 'Sign Up'} </Text>
      </TouchableOpacity>



      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.replace('/auth/login')}>
          <Text style={styles.footerText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#007bff',
    fontSize: 16,
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleText: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  profilePicContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    width: 100,
    height: 100,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
