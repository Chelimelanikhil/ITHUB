import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Set as null initially
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const role = await AsyncStorage.getItem('role'); 
       

        if (token) {
          if (role === 'user') {
            setIsAuthenticated('user'); // If role is 'user', authenticated as 'user'
          } else if (role === 'company') {
            setIsAuthenticated('company'); // If role is 'company', authenticated as 'company'
          } else {
            setIsAuthenticated(false); // Invalid or missing role
          }
        } else {
          setIsAuthenticated(false); // No token, not authenticated
        }
      } catch (error) {
        console.error('Error reading authToken:', error);
        setIsAuthenticated(false); // In case of any error, mark as not authenticated
      } finally {
        setIsLoading(false); // After the check, set loading to false
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoading) return; // If loading, don't navigate yet

    // Navigate based on the role
    if (isAuthenticated === 'user') {
      router.replace('/(tabs)'); // Navigate to tabs for user
      //router.replace('/onboard/onboard');
    } else if (isAuthenticated === 'company') {
      router.replace('/company/company'); // Navigate to company-specific screen
    } else {
      router.replace('/auth/login'); // Navigate to login screen
    }
  }, [isAuthenticated, isLoading, router]);

  // While loading, render a loading indicator or just an empty view
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return <View style={styles.container} />; // Optionally render an empty view when navigation happens
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
