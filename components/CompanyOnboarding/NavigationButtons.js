import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
 
} from 'react-native';

export const NavigationButtons = ({ currentStep, onBack, onNext, isLastStep }) => (
  <View style={styles.navigationContainer}>
    {currentStep > 1 && (
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBack}
        activeOpacity={0.8}
      >
        <View style={styles.buttonInner}>
          <Text style={styles.backButtonIcon}>←</Text>
          <Text style={styles.backButtonText}>Previous</Text>
        </View>
      </TouchableOpacity>
    )}
    
    <TouchableOpacity 
      style={[
        styles.nextButton,
        currentStep === 1 && styles.fullWidthButton,
        isLastStep && styles.submitButton
      ]}
      onPress={onNext}
      activeOpacity={0.8}
    >
      <View style={styles.buttonInner}>
        <Text style={styles.nextButtonText}>
          {isLastStep ? 'Complete Profile' : 'Continue'}
        </Text>
        {!isLastStep && <Text style={styles.nextButtonIcon}>→</Text>}
      </View>
    </TouchableOpacity>
  </View>
);



const styles = StyleSheet.create({
 
  
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: 24,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#EDF2F7',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#4299E1',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
 
  submitButton: {
    backgroundColor: '#48BB78',
  },
  fullWidthButton: {
    flex: 2,
    marginLeft: 0,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#2D3748',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  backButtonIcon: {
    color: '#2D3748',
    fontSize: 20,
    marginRight: 8,
    fontWeight: '600',
  },
  nextButtonIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    marginLeft: 8,
    fontWeight: '600',
  }

});