import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';

const PaymentSection = ({ onSubmit, onBack }) => {
  const { confirmPayment, handleCardAction } = useStripe();
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
  });

  const handlePayment = async () => {
    try {
      setLoading(true);

      if (!cardDetails?.complete) {
        Alert.alert('Error', 'Please enter complete card details');
        return;
      }

      // Replace with your backend API endpoint
      const response = await fetch('https://your-backend-url/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 2000, // Amount in cents
          currency: 'usd',
        }),
      });

      const { clientSecret } = await response.json();

      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails,
        },
      });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      if (paymentIntent.status === 'Succeeded') {
        Alert.alert('Success', 'Payment successful!');
        onSubmit(paymentIntent);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Payment Information</Text>
      
      <View style={styles.pricingContainer}>
        <Text style={styles.pricingTitle}>Premium Company Profile</Text>
        <Text style={styles.price}>$20.00</Text>
        <Text style={styles.pricingDescription}>
          Get featured listing, advanced analytics, and priority support
        </Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>Billing Information</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={billingDetails.name}
          onChangeText={(text) => setBillingDetails({ ...billingDetails, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={billingDetails.email}
          onChangeText={(text) => setBillingDetails({ ...billingDetails, email: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={billingDetails.phone}
          onChangeText={(text) => setBillingDetails({ ...billingDetails, phone: text })}
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>Billing Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Street Address"
          value={billingDetails.address.line1}
          onChangeText={(text) => setBillingDetails({
            ...billingDetails,
            address: { ...billingDetails.address, line1: text }
          })}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="City"
            value={billingDetails.address.city}
            onChangeText={(text) => setBillingDetails({
              ...billingDetails,
              address: { ...billingDetails.address, city: text }
            })}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="State"
            value={billingDetails.address.state}
            onChangeText={(text) => setBillingDetails({
              ...billingDetails,
              address: { ...billingDetails.address, state: text }
            })}
          />
        </View>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Postal Code"
            value={billingDetails.address.postalCode}
            onChangeText={(text) => setBillingDetails({
              ...billingDetails,
              address: { ...billingDetails.address, postalCode: text }
            })}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Country"
            value={billingDetails.address.country}
            onChangeText={(text) => setBillingDetails({
              ...billingDetails,
              address: { ...billingDetails.address, country: text }
            })}
          />
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>Card Details</Text>
        <CardField
          postalCodeEnabled={false}
          style={styles.cardField}
          cardStyle={{
            backgroundColor: '#FFFFFF',
            textColor: '#1A1A1A',
          }}
          onCardChange={(cardDetails) => setCardDetails(cardDetails)}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.payButton, loading && styles.disabledButton]}
          onPress={handlePayment}
          disabled={loading}
        >
          <Text style={styles.payButtonText}>
            {loading ? 'Processing...' : 'Pay $20.00'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 24,
    textAlign: 'center',
  },
  pricingContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pricingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4299E1',
    marginBottom: 8,
  },
  pricingDescription: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  backButton: {
    backgroundColor: '#EDF2F7',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    marginRight: 12,
  },
  backButtonText: {
    color: '#4A5568',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  payButton: {
    backgroundColor: '#48BB78',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 2,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  }
});

export default PaymentSection;