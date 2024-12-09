import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid, ActivityIndicator, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isCompany, setIsCompany] = useState(false); // Track if the user is a company or not
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
    });
  }, []);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      ToastAndroid.show('Please fill in all fields', ToastAndroid.SHORT);
      return;
    }

    if (password !== confirmPassword) {
      ToastAndroid.show('Passwords do not match', ToastAndroid.SHORT);
      return;
    }

    setIsLoading(true);  // Show loader while the registration process is in progress

    try {
      // Call the backend API to register the user
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        role: isCompany ? 'company' : 'user', 
      });
    
      // Check if registration was successful
      if (response.data.message === 'User registered successfully') {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('role', response.data.role); 
        // If the role is company, navigate to the onboarding screen
        if (response.data.role === 'company') {
          router.replace('/onboard/onboard'); // Navigate to the onboarding screen
        } else {
          // Otherwise, navigate to the login page
          router.replace('/auth/login'); // Navigate to the login page
        }
    
        // You can show a success message here, for example:
        // ToastAndroid.show('Registration successful', ToastAndroid.SHORT);
      } else {
        // Show the error message from the backend
        // ToastAndroid.show(response.data.message || 'Registration failed', ToastAndroid.SHORT);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        // Handle specific backend error messages like "Email already exists"
        // ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
      } else {
        // Handle general network error
        // ToastAndroid.show('Network error. Please try again later.', ToastAndroid.SHORT);
      }
    } finally {
      setIsLoading(false);  // Hide loader after registration process completes
    }    
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

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
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock" size={24} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
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
});
