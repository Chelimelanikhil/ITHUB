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
        const token = await AsyncStorage.getItem('authToken');
        console.log(token);
        if (token) {
          setIsAuthenticated(false); // If token exists, authenticated
        } else {
          setIsAuthenticated(false); // No token, not authenticated
        }
      } catch (error) {
        console.error('Error reading authToken:', error);
      } finally {
        setIsLoading(false); // After the check, set loading to false
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoading) return; // If loading, don't navigate yet

    if (isAuthenticated) {
      router.replace('/(tabs)'); // Navigate to tabs
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
