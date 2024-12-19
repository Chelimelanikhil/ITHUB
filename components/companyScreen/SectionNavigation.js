import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SectionNavigation = ({ activeSection, setActiveSection }) => {
  const sections = [
    { key: 'about', label: 'About', icon: 'information-circle' },
    { key: 'jobs', label: 'Jobs', icon: 'briefcase' },
    { key: 'gallery', label: 'Gallery', icon: 'images' },
    { key: 'reviews', label: 'Reviews', icon: 'star' },
  ];

  return (
    <View style={styles.sectionNavigation}>
      {sections.map(section => (
        <TouchableOpacity 
          key={section.key}
          style={[
            styles.sectionNavItem,
            activeSection === section.key && styles.activeSectionNavItem,
          ]}
          onPress={() => setActiveSection(section.key)}
        >
          <Ionicons 
            name={section.icon} 
            size={20} 
            color={activeSection === section.key ? '#4A90E2' : '#8E8E93'} 
          />
          <Text style={[
            styles.sectionNavText,
            activeSection === section.key && styles.activeSectionNavText,
          ]}>
            {section.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingVertical: 10,
  },
  sectionNavItem: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  activeSectionNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
  },
  sectionNavText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  activeSectionNavText: {
    color: '#4A90E2',
  },
});

export default SectionNavigation;