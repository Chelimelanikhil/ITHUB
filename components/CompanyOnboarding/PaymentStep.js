import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const PaymentStep = ({ companyProfile, setCompanyProfile, styles }) => {
  const [paymentInfo, setPaymentInfo] = useState({
    cardDetails: {
      cardNumber: '',
      lastFourDigits: '',
      expiryDate: '',
      cvv: '',
      cardType: ''
    },
    billingAddress: {
      country: 'United States',
      postalCode: ''
    },
    saveCard: false
  });

  const detectCardType = (number) => {
    // Basic card type detection
    const cardPatterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/
    };

    for (const [type, pattern] of Object.entries(cardPatterns)) {
      if (pattern.test(number.replace(/\s/g, ''))) {
        return type;
      }
    }
    return '';
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;
    let updatedPaymentInfo = { ...paymentInfo };

    if (field === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().substr(0, 19);
      const cardType = detectCardType(formattedValue);
      const lastFourDigits = formattedValue.replace(/\s/g, '').slice(-4);
      
      updatedPaymentInfo.cardDetails = {
        ...updatedPaymentInfo.cardDetails,
        cardNumber: formattedValue,
        lastFourDigits,
        cardType
      };
    } else if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '')
        .replace(/(\d{2})(\d{0,2})/, '$1/$2')
        .substr(0, 5);
      updatedPaymentInfo.cardDetails.expiryDate = formattedValue;
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substr(0, 3);
      updatedPaymentInfo.cardDetails.cvv = formattedValue;
    } else if (field === 'postalCode') {
      updatedPaymentInfo.billingAddress.postalCode = value;
    } else if (field === 'country') {
      updatedPaymentInfo.billingAddress.country = value;
    }

    setPaymentInfo(updatedPaymentInfo);
    setCompanyProfile(prev => ({
      ...prev,
      payment: updatedPaymentInfo
    }));
  };

  return (
    <View style={localStyles.container}>
      <View style={localStyles.header}>
        <Text style={localStyles.title}>Add your payment information</Text>
        <TouchableOpacity>
          <MaterialIcons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={localStyles.cardSection}>
        <View style={localStyles.cardHeaderRow}>
          <Text style={localStyles.sectionTitle}>Card information</Text>
          <TouchableOpacity style={localStyles.scanButton}>
            <MaterialIcons name="photo-camera" size={18} color="#1a73e8" />
            <Text style={localStyles.scanText}>Scan card</Text>
          </TouchableOpacity>
        </View>

        <View style={localStyles.cardInputContainer}>
          <TextInput
            style={localStyles.cardNumberInput}
            placeholder="Card number"
            placeholderTextColor="#aaa" // Added this line
            value={paymentInfo.cardNumber}
            onChangeText={(text) => handleInputChange('cardNumber', text)}
            keyboardType="numeric"
          />

          <View style={localStyles.cardBrands}>
            <Image
              source={{ uri: 'https://w7.pngwing.com/pngs/20/987/png-transparent-logo-visa-credit-card-business-visa-text-trademark-payment-thumbnail.png' }}
              style={localStyles.cardIcon}
            />
            <Image
              source={{ uri: 'https://e7.pngegg.com/pngimages/910/492/png-clipart-mastercard-logo-credit-card-visa-brand-mastercard-text-label-thumbnail.png' }}
              style={localStyles.cardIcon}
            />
            <Image
              source={{ uri: 'https://w7.pngwing.com/pngs/662/383/png-transparent-amex-payment-method-icon-thumbnail.png' }}
              style={localStyles.cardIcon}
            />

          </View>
        </View>

        <View style={localStyles.cardDetailsRow}>
          <TextInput
            style={[localStyles.input, localStyles.halfInput]}
            placeholder="MM / YY"
            placeholderTextColor="#aaa"
            value={paymentInfo.expiryDate}
            onChangeText={(text) => handleInputChange('expiryDate', text)}
            keyboardType="numeric"
          />
          <View style={localStyles.separator} />
          <TextInput
            style={[localStyles.input, localStyles.halfInput]}
            placeholder="CVC"
            placeholderTextColor="#aaa"
            value={paymentInfo.cvv}
            onChangeText={(text) => handleInputChange('cvv', text)}
            keyboardType="numeric"
            secureTextEntry
          />
        </View>
      </View>

      <View style={localStyles.billingSection}>
        <Text style={localStyles.sectionTitle}>Billing address</Text>
        <TouchableOpacity style={localStyles.countrySelector}>
          <Text style={localStyles.countryText}>{paymentInfo.country}</Text>
          <MaterialIcons name="keyboard-arrow-down" size={24} color="#666" />
        </TouchableOpacity>
        <TextInput
          style={localStyles.input}
          placeholder="Postal code"
          placeholderTextColor="#aaa"
          value={paymentInfo.postalCode}
          onChangeText={(text) => handleInputChange('postalCode', text)}
        />
      </View>

      <TouchableOpacity style={localStyles.saveCardRow}>
        <MaterialIcons
          name={paymentInfo.saveCard ? "check-box" : "check-box-outline-blank"}
          size={24}
          color="#1a73e8"
          onPress={() => handleInputChange('saveCard', !paymentInfo.saveCard)}
        />
        <Text style={localStyles.saveCardText}>
          Save this card for future payments
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={localStyles.payButton}>
        <Text style={localStyles.payButtonText}>Pay $15.00</Text>
        <MaterialIcons name="lock" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202124',
  },
  cardSection: {
    marginBottom: 24,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#202124',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanText: {
    color: '#1a73e8',
    marginLeft: 4,
    fontSize: 14,
  },
  cardInputContainer: {
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: 4,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  cardNumberInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  cardBrands: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardIcon: {
    width: 32,
    height: 20,
    resizeMode: 'contain',
  },
  cardDetailsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  halfInput: {
    flex: 1,
  },
  separator: {
    width: 12,
  },
  billingSection: {
    marginBottom: 24,
  },
  countrySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: 4,
    padding: 12,
    marginVertical: 12,
  },
  countryText: {
    fontSize: 16,
    color: '#202124',
  },
  saveCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  saveCardText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#202124',
  },
  payButton: {
    backgroundColor: '#1a73e8',
    borderRadius: 4,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});