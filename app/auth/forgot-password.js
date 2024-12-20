import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
const router = useRouter();
  const handlePasswordReset = async () => {
    if (!email) {
      ToastAndroid.show('Please enter your email address', ToastAndroid.SHORT);
      return;
    }

    setIsSubmitting(true);
    try {
      // Call the backend API to request a password reset
      const response = await axios.post('https://ithub-backend.onrender.com/api/auth/forgot-password', { email });
    
      if (response.status === 200) {
        ToastAndroid.show('Password Reset Code sent successfully', ToastAndroid.SHORT);
        //router.replace('/auth/reset-password', { email });
        router.push({
            pathname: "/auth/reset-password",
            params: { email },
          });
      } else {
        ToastAndroid.show('Failed to send password reset email', ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show('Error sending password reset request', ToastAndroid.SHORT);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.description}>Enter your email to receive a password reset Code.</Text>

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

      <TouchableOpacity style={styles.button} onPress={handlePasswordReset} disabled={isSubmitting}>
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Submitting...' : 'Send Reset Code'}
        </Text>
      </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
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
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
