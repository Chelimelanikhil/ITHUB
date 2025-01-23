import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const PaymentForm = ({ onSubmit, amount }) => {
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    postalCode: ''
  });
  const [country, setCountry] = useState('United Kingdom');
  const [saveCard, setSaveCard] = useState(false);

  const handlePayment = () => {
    // Handle payment submission
    onSubmit(cardDetails);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.testModeBadge}>
          <Text style={styles.testModeText}>TEST MODE</Text>
        </View>
        <TouchableOpacity style={styles.closeButton}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Add your payment information</Text>

      <View style={styles.cardSection}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.sectionTitle}>Card information</Text>
          <TouchableOpacity style={styles.scanButton}>
            <Image 
              source={{ uri: '/api/placeholder/24/24' }}
              style={styles.scanIcon} 
            />
            <Text style={styles.scanText}>Scan card</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardInputContainer}>
          <TextInput
            style={styles.cardNumberInput}
            placeholder="Card number"
            value={cardDetails.number}
            onChangeText={(text) => setCardDetails({...cardDetails, number: text})}
            keyboardType="numeric"
          />
          <View style={styles.cardBrandIcons}>
            <Image source={{ uri: '/api/placeholder/24/16' }} style={styles.cardIcon} />
            <Image source={{ uri: '/api/placeholder/24/16' }} style={styles.cardIcon} />
            <Image source={{ uri: '/api/placeholder/24/16' }} style={styles.cardIcon} />
          </View>
        </View>

        <View style={styles.cardExtraRow}>
          <TextInput
            style={[styles.input, styles.expiryInput]}
            placeholder="MM / YY"
            value={cardDetails.expiry}
            onChangeText={(text) => setCardDetails({...cardDetails, expiry: text})}
            keyboardType="numeric"
          />
          <View style={styles.cvcContainer}>
            <TextInput
              style={[styles.input, styles.cvcInput]}
              placeholder="CVC"
              value={cardDetails.cvc}
              onChangeText={(text) => setCardDetails({...cardDetails, cvc: text})}
              keyboardType="numeric"
            />
            <Image 
              source={{ uri: '/api/placeholder/16/16' }}
              style={styles.cvcIcon} 
            />
          </View>
        </View>
      </View>

      <View style={styles.billingSection}>
        <Text style={styles.sectionTitle}>Billing address</Text>
        <View style={styles.countryPickerContainer}>
          <Picker
            selectedValue={country}
            onValueChange={(value) => setCountry(value)}
            style={styles.countryPicker}
          >
            <Picker.Item label="United Kingdom" value="United Kingdom" />
            <Picker.Item label="United States" value="United States" />
            <Picker.Item label="Canada" value="Canada" />
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Postal code"
          value={cardDetails.postalCode}
          onChangeText={(text) => setCardDetails({...cardDetails, postalCode: text})}
        />
      </View>

      <View style={styles.saveCardContainer}>
        <TouchableOpacity 
          style={styles.checkbox}
          onPress={() => setSaveCard(!saveCard)}
        >
          {saveCard && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
        <Text style={styles.saveCardText}>
          Save this card for future payments
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.payButton}
        onPress={handlePayment}
      >
        <Text style={styles.payButtonText}>Pay £6.00</Text>
        <Image 
          source={{ uri: '/api/placeholder/16/16' }}
          style={styles.lockIcon} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  testModeBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  testModeText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '500',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#6B7280',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
  },
  cardSection: {
    marginBottom: 24,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanIcon: {
    width: 24,
    height: 24,
    marginRight: 4,
  },
  scanText: {
    color: '#2563EB',
    fontSize: 14,
  },
  cardInputContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardNumberInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  cardBrandIcons: {
    flexDirection: 'row',
    paddingRight: 12,
  },
  cardIcon: {
    width: 24,
    height: 16,
    marginLeft: 4,
  },
  cardExtraRow: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  expiryInput: {
    flex: 1,
  },
  cvcContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
  },
  cvcInput: {
    flex: 1,
    borderWidth: 0,
  },
  cvcIcon: {
    width: 16,
    height: 16,
    marginRight: 12,
  },
  billingSection: {
    marginBottom: 24,
  },
  countryPickerContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    marginBottom: 12,
  },
  countryPicker: {
    height: 50,
  },
  saveCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#2563EB',
  },
  saveCardText: {
    fontSize: 14,
    color: '#374151',
  },
  payButton: {
    backgroundColor: '#2563EB',
    borderRadius: 6,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  lockIcon: {
    width: 16,
    height: 16,
  },
});

export default PaymentForm;