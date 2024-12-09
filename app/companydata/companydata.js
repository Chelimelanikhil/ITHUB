import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRouter } from "expo-router";


export default function CompanyDetail({ route }) {
  const { companyId } = route.params; // Get companyId from navigation params
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/companies/allcompanies`);
        setCompany(response.data);
      } catch (error) {
        console.error('Error fetching company details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [companyId]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!company) {
    return <Text>Company not found</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{company.name}</Text>
      <Text>Email: {company.email}</Text>
      <Text>Industry: {company.industry}</Text>
      <Text>Address: {company.address}</Text>
      <Text>Phone: {company.phone}</Text>
      <Text>Location: {company.location}</Text>
      <Text>Employees: {company.employees}</Text>
      <Text>Rating: {company.rating}</Text>
      <Text>Openings: {company.openings}</Text>
      {company.image && <Image source={{ uri: company.image }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
});
