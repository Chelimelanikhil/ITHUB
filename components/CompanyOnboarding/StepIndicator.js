import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
 
} from 'react-native';

export const StepIndicator = ({ currentStep }) => (
  <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        {[1, 2, 3, 4, 5, 6].map(step => (
          <View key={step} style={styles.progressBarWrapper}>
            <View
              style={[
                styles.progressStep,
                currentStep >= step ? styles.activeProgressStep : {},
              ]}
            />
            <Text style={[
              styles.stepLabel,
              currentStep >= step ? styles.activeStepLabel : {}
            ]}>
              {step === 1 ? 'Basic Info' :
               step === 2 ? 'About' :
               step === 3 ? 'Jobs' :
               step === 4 ? 'Reviews' : 
              step === 5 ? 'Gallery' : 'Payment'}
            </Text>
          </View>
        ))}
      </View>
    </View>

);


const styles = StyleSheet.create({
 
  progressContainer: {
    backgroundColor: 'white',
    paddingTop: 50,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  progressStep: {
    width: '100%',
    height: 5,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 3,
    borderRadius: 3,
  },
  activeProgressStep: {
    backgroundColor: '#4299E1',
  },
  stepLabel: {
    marginTop: 10,
    fontSize: 13,
    color: '#718096',
    fontWeight: '600',
  },
  activeStepLabel: {
    color: '#2B6CB0',
    fontWeight: '700',
  },
  

});