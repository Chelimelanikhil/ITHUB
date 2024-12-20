import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import axios from 'axios';
import { useRoute } from "@react-navigation/native";
import { useRouter } from 'expo-router';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const route = useRoute();
  const { email } = route.params; // Get the email from navigation params
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordReset = async () => {
    if (!password || !confirmPassword || !resetCode) {
      ToastAndroid.show('Please fill in all fields', ToastAndroid.SHORT);
      return;
    }

    if (password !== confirmPassword) {
      ToastAndroid.show('Passwords do not match', ToastAndroid.SHORT);
      return;
    }

    setIsSubmitting(true);
    try {
      // Call the backend API to reset the password
      const response = await axios.post('https://ithub-backend.onrender.com/api/auth/reset-password', {
        email, // You can pass the email here since it's available
        resetCode,
        newPassword: password,
      });

      if (response.status === 200) {
        ToastAndroid.show('Password reset successful', ToastAndroid.SHORT);
        router.replace('/auth/login'); // Navigate to Login page after reset
      } else {
        ToastAndroid.show(response.data.message || 'Failed to reset password', ToastAndroid.SHORT);
      }
    } catch (error) {
      if (error.response) {
        // Error from backend (e.g., invalid code, expired code)
        ToastAndroid.show(error.response.data.message || 'Error resetting password', ToastAndroid.SHORT);
      } else {
        // Network or other unknown errors
        ToastAndroid.show('Network error. Please try again later.', ToastAndroid.SHORT);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.description}>Enter the reset code sent to your email and your new password.</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Reset Code"
          keyboardType="numeric"
          value={resetCode}
          onChangeText={setResetCode}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePasswordReset} disabled={isSubmitting}>
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Submitting...' : 'Reset Password'}
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
