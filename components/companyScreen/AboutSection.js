import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import {
  Ionicons,
  FontAwesome5,
  MaterialIcons
} from '@expo/vector-icons';
import { Linking } from 'react-native';

const CompanyProfileScreen = ({
  companyData,
  editableData,
  setCompanyData,
  setEditableData
}) => {
  // State for tracking which section is being edited
  const [editingSection, setEditingSection] = useState(null);

  // Open social media links
  const openSocialLink = (platform, username) => {
    const urls = {
      linkedin: `https://linkedin.com/company/${username}`,
      twitter: `https://twitter.com/${username.replace('@', '')}`
    };

    Linking.openURL(urls[platform]).catch(err =>
      Alert.alert('Error', 'Could not open link')
    );
  };


  // Generic modal handler for editing different sections
  const renderEditModal = () => {
    if (!editingSection) return null;

    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={!!editingSection}
        onRequestClose={() => setEditingSection(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            {renderModalContent()}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  // Render specific modal content based on editing section
  const renderModalContent = () => {
    switch (editingSection) {
      case 'companyDetails':
        return (
          <View>
            <Text style={styles.modalTitle}>Edit Company Details</Text>
            <TextInput
              style={styles.modalInput}
              value={editableData.foundedYear ? editableData.foundedYear.toString() : ''}
              onChangeText={(text) => setEditableData(prev => ({
                ...prev,
                foundedYear: parseInt(text) || null
              }))}
              placeholder="Founded Year"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.modalInput}
              value={editableData.headquarters || ''}
              onChangeText={(text) => setEditableData(prev => ({
                ...prev,
                headquarters: text
              }))}
              placeholder="Headquarters Location"
            />
            <TextInput
              style={styles.modalInput}
              value={editableData.employees ? editableData.employees.toString() : ''}
              onChangeText={(text) => setEditableData(prev => ({
                ...prev,
                employees: parseInt(text) || null
              }))}
              placeholder="Number of Employees"
              keyboardType="numeric"
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setCompanyData(editableData);
                  setEditingSection(null);
                }}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditingSection(null)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'contactInfo':
        return (
          <View>
            <Text style={styles.modalTitle}>Edit Contact Information</Text>
            <TextInput
              style={styles.modalInput}
              value={editableData.email || ''}
              onChangeText={(text) => setEditableData(prev => ({
                ...prev,
                email: text
              }))}
              placeholder="Contact Email"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.modalInput}
              value={editableData.phone || ''}
              onChangeText={(text) => setEditableData(prev => ({
                ...prev,
                phone: text
              }))}
              placeholder="Contact Phone"
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.modalInput}
              value={editableData.website || ''}
              onChangeText={(text) => setEditableData(prev => ({
                ...prev,
                website: text
              }))}
              placeholder="Company Website"
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setCompanyData(editableData);
                  setEditingSection(null);
                }}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditingSection(null)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'socialLinks':
        return (
          <View>
            <Text style={styles.modalTitle}>Edit Social Media Links</Text>
            <TextInput
              style={styles.modalInput}
              value={editableData.socialLinks?.linkedin || ''}
              onChangeText={(text) => setEditableData(prev => ({
                ...prev,
                socialLinks: {
                  ...prev.socialLinks,
                  linkedin: text
                }
              }))}
              placeholder="LinkedIn Username"
            />
            <TextInput
              style={styles.modalInput}
              value={editableData.socialLinks?.twitter || ''}
              onChangeText={(text) => setEditableData(prev => ({
                ...prev,
                socialLinks: {
                  ...prev.socialLinks,
                  twitter: text
                }
              }))}
              placeholder="Twitter Handle"
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setCompanyData(editableData);
                  setEditingSection(null);
                }}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditingSection(null)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'certifications':
        return (
          <View>
            <Text style={styles.modalTitle}>Edit Certifications</Text>
            {editableData.certifications?.map((cert, index) => (
              <View key={index} style={styles.certEditRow}>
                <TextInput
                  style={[styles.modalInput, styles.certInput]}
                  value={cert}
                  onChangeText={(text) => {
                    const newCerts = [...(editableData.certifications || [])];
                    newCerts[index] = text;
                    setEditableData(prev => ({
                      ...prev,
                      certifications: newCerts
                    }));
                  }}
                  placeholder="Certification"
                />
                <TouchableOpacity
                  onPress={() => {
                    const newCerts = (editableData.certifications || []).filter((_, i) => i !== index);
                    setEditableData(prev => ({
                      ...prev,
                      certifications: newCerts
                    }));
                  }}
                >
                  <MaterialIcons name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setEditableData(prev => ({
                  ...prev,
                  certifications: [...(prev.certifications || []), 'New Certification']
                }));
              }}
            >
              <Text style={styles.addButtonText}>+ Add Certification</Text>
            </TouchableOpacity>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setCompanyData(editableData);
                  setEditingSection(null);
                }}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditingSection(null)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Company Details Section with Editing */}
      <View style={styles.infoSection}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Company Details</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditingSection('companyDetails')}
          >
            <Ionicons name="create-outline" size={24} color="#4A5568" />
          </TouchableOpacity>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={20} color="#3182CE" />
          <Text style={styles.infoText}>Founded: {companyData.foundedYear}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location" size={20} color="#3182CE" />
          <Text style={styles.infoText}>HQ: {companyData.headquarters}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="people" size={20} color="#3182CE" />
          <Text style={styles.infoText}>Employees: {companyData.employees}</Text>
        </View>
      </View>

      {/* Contact Information Section */}
      <View style={styles.infoSection}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditingSection('contactInfo')}
          >
            <Ionicons name="create-outline" size={24} color="#4A5568" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.infoRow}
          onPress={() => Linking.openURL(`mailto:${companyData.email}`)}
        >
          <Ionicons name="mail" size={20} color="#3182CE" />
          <Text style={styles.infoText}>{companyData.email}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.infoRow}
          onPress={() => Linking.openURL(`tel:${companyData.phone}`)}
        >
          <Ionicons name="call" size={20} color="#3182CE" />
          <Text style={styles.infoText}>{companyData.phone}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.infoRow}
          onPress={() => Linking.openURL(`https://${companyData.website}`)}
        >
          <Ionicons name="globe" size={20} color="#3182CE" />
          <Text style={styles.infoText}>{companyData.website}</Text>
        </TouchableOpacity>
      </View>

      {/* Social Media Section */}
      <View style={styles.infoSection}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Social Media</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditingSection('socialLinks')}
          >
            <Ionicons name="create-outline" size={24} color="#4A5568" />
          </TouchableOpacity>
        </View>
        <View style={styles.socialContainer}>
          {Object.entries(companyData.socialLinks || {}).map(([platform, username]) => (
            <TouchableOpacity
              key={platform}
              style={styles.socialButton}
              onPress={() => openSocialLink(platform, username)}
            >
              <FontAwesome5
                name={platform}
                size={24}
                color={platform === 'linkedin' ? '#0A66C2' : '#1DA1F2'}
              />

            </TouchableOpacity>
          ))}
        </View>
      </View>



      {/* Render the editing modal */}
      {renderEditModal()}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },

  infoSection: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 10,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2D3748',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#4A5568',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  socialButton: {
    alignItems: 'center',
  },
  socialText: {
    marginTop: 5,
    color: '#4A5568',
  },
  certificationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  certificationBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    margin: 5,
  },
  certificationText: {
    fontSize: 12,
    color: '#4A5568',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  modalButton: {
    backgroundColor: '#3182CE',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#718096',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  certEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  certInput: {
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#48BB78',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CompanyProfileScreen;