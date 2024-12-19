import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const HEADER_MAX_HEIGHT = 250;

const JobCard = ({ title, department, location, type, salary }) => (
  <TouchableOpacity style={styles.jobCard}>
    <View style={styles.jobHeader}>
      <Text style={styles.jobTitle}>{title}</Text>
      <MaterialIcons name="arrow-forward-ios" size={20} color="#666" />
    </View>
    <View style={styles.jobDetails}>
      <View style={styles.jobDetailItem}>
        <MaterialIcons name="business" size={16} color="#666" />
        <Text style={styles.jobDetailText}>{department}</Text>
      </View>
      <View style={styles.jobDetailItem}>
        <MaterialIcons name="location-on" size={16} color="#666" />
        <Text style={styles.jobDetailText}>{location}</Text>
      </View>
      <View style={styles.jobDetailItem}>
        <MaterialIcons name="work" size={16} color="#666" />
        <Text style={styles.jobDetailText}>{type}</Text>
      </View>
      <View style={styles.jobDetailItem}>
        <MaterialIcons name="attach-money" size={16} color="#666" />
        <Text style={styles.jobDetailText}>{salary}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const JobPostings = ({ jobs }) => (
  <ScrollView
    style={styles.tabContent}
    contentContainerStyle={styles.tabContentContainer}
    scrollEventThrottle={16}
  >
    {jobs && jobs.length > 0 ? (
      jobs.map((job, index) => (
        <JobCard
          key={index}
          title={job.title}
          department={job.department}
          location={job.location}
          type={job.type}
          salary={job.salary}
        />
      ))
    ) : (
      <Text style={styles.noJobsText}>No job postings available</Text>
    )}
  </ScrollView>
);

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabContentContainer: {
    paddingTop: HEADER_MAX_HEIGHT + 48, // Header height + TabBar height
    minHeight: Dimensions.get('window').height + HEADER_MAX_HEIGHT,
  },
  jobCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  jobDetails: {
    marginTop: 10,
  },
  jobDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  jobDetailText: {
    marginLeft: 10,
    color: '#666',
    fontSize: 14,
  },
  noJobsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});

export default JobPostings;
