import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity,ActivityIndicator, ToastAndroid, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "expo-router";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);

  const handleLogin = async () => {
    if (email && password) {
      setIsLoading(true);
      try {
        // Make the login request to the backend API
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email,
          password,
        });

        // Check if the response contains a token
        if (response.data.token) {
          // Store the token in AsyncStorage
          await AsyncStorage.setItem('token', response.data.token);
          await AsyncStorage.setItem('role', response.data.role); 
          // Show success message
          //ToastAndroid.show('Login successful', ToastAndroid.SHORT);
          if (response.data.role === 'user') {
            router.replace('/(tabs)');
          } else{
            router.replace('/company/company');
          } ;
          // Navigate to the main app or dashboard
        
        } else {
          //ToastAndroid.show('Invalid response from server', ToastAndroid.SHORT);
        }
      } catch (error) {
        // Handle errors
        if (error.response && error.response.data && error.response.data.message) {
          // Handle specific backend error messages like "Email already exists"
          //ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
        } else {
          // Network errors
          //ToastAndroid.show('Network error. Please try again later.', ToastAndroid.SHORT);
        }
      }
      finally {
        setIsLoading(false);  // Hide loader after registration process completes
      }
    } else {
      //ToastAndroid.show('Please enter both email and password', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
        <Text style={styles.buttonText}> {isLoading ? 'Signing In...' : 'Sign In'}</Text>
      </TouchableOpacity>
      
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => Alert('Forgot Password')}>
          <Text style={styles.footerText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/auth/register')}>
          <Text style={styles.footerText}>Don't have an account? Register</Text>
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
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#007bff',
    fontSize: 16,
    marginBottom: 10,
  },
});
