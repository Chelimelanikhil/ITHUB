import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export const CompanyDetails = ({ company }) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {/* Company Logo (Left side) */}
        <Image
          source={{ uri: company.logoUrl }} // Replace with the URL or local path of the logo
          style={styles.logo}
        />
        
        {/* Company Details (Right side) */}
        <View style={styles.textContainer}>
          <Text style={styles.name}>{company.name}</Text>
          <Text style={styles.employees}>Employees: {company.employees}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  row: {
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Vertically center the items
  },
  logo: {
    width: 50, // Set a fixed width for the logo
    height: 50, // Set a fixed height for the logo
    marginRight: 15, // Space between logo and text
    borderRadius: 5, // Optional: rounded corners for the logo
  },
  textContainer: {
    flex: 1, // Take up remaining space to the right of the logo
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  employees: {
    fontSize: 14,
    marginTop: 4,
    color: '#555',
  },
});
