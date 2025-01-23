import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const BasicInfoStep = ({ companyProfile, setCompanyProfile }) => {
  const handleImagePick = async () => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setCompanyProfile((prev) => ({
        ...prev,
        basicInfo: { ...prev.basicInfo, logo: pickerResult.assets[0].uri },
      }));
    }
  };

  return (
    <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Basic Company Information</Text>

        <TextInput
          style={styles.input}
          placeholder="Company Name"
          value={companyProfile.basicInfo.name}
          onChangeText={(text) => setCompanyProfile(prev => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, name: text }
          }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={companyProfile.basicInfo.email}  // Add value for email
          onChangeText={(text) => setCompanyProfile(prev => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, email: text }
          }))}
        />
        <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePick}>
          <Text style={styles.imagePickerButtonText}>Pick an Image</Text>
        </TouchableOpacity>

        {companyProfile.basicInfo.logo ? (
          <Image
            source={{ uri: companyProfile.basicInfo.logo }}
            style={styles.imagePreview}
          />
        ) : null}


        <TextInput
          style={styles.input}
          placeholder="Industry"
          value={companyProfile.basicInfo.industry}
          onChangeText={(text) => setCompanyProfile(prev => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, industry: text }
          }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={companyProfile.basicInfo.location}
          onChangeText={(text) => setCompanyProfile(prev => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, location: text }
          }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Year Founded"
          value={companyProfile.basicInfo.founded}
          onChangeText={(text) => setCompanyProfile(prev => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, founded: text }
          }))}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Company Size"
          value={companyProfile.basicInfo.employees}
          onChangeText={(text) => setCompanyProfile(prev => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, employees: text }
          }))}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Rating "
          value={companyProfile.basicInfo.rating}
          onChangeText={(text) => setCompanyProfile(prev => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, rating: text }
          }))}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Website URL"
          value={companyProfile.basicInfo.website}
          onChangeText={(text) => setCompanyProfile(prev => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, website: text }
          }))}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={companyProfile.basicInfo.phone}
          onChangeText={(text) => setCompanyProfile(prev => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, phone: text }
          }))}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Headquarters"
          value={companyProfile.basicInfo.headquarters}
          onChangeText={(text) => setCompanyProfile(prev => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, headquarters: text }
          }))}
        />

        <TextInput
          style={styles.input}
          placeholder="LinkedIn Profile"
          value={companyProfile.basicInfo.socialLinks?.linkedin}
          onChangeText={(text) => setCompanyProfile(prev => ({
            ...prev,
            basicInfo: {
              ...prev.basicInfo,
              socialLinks: {
                ...prev.basicInfo.socialLinks,
                linkedin: text
              }
            }
          }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Twitter Handle"
          value={companyProfile.basicInfo.socialLinks?.twitter}
          onChangeText={(text) => setCompanyProfile(prev => ({
            ...prev,
            basicInfo: {
              ...prev.basicInfo,
              socialLinks: {
                ...prev.basicInfo.socialLinks,
                twitter: text
              }
            }
          }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Job Openings"
          value={companyProfile.basicInfo.openings}
          onChangeText={(text) => setCompanyProfile(prev => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, openings: text }
          }))}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.multilineInput}
          placeholder="Company Description"
          value={companyProfile.basicInfo.description}
          onChangeText={(text) => setCompanyProfile(prev => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, description: text }
          }))}
          multiline={true}
          numberOfLines={4}
        />
        <View style={styles.certificationsContainer}>
          <Text style={styles.certificationsTitle}>Certifications</Text>
          {/* You might want to create a separate component for managing certifications */}
          <TextInput
            style={styles.input}
            placeholder="Add Certification"
            onSubmitEditing={(event) => {
              const certification = event.nativeEvent.text;
              setCompanyProfile(prev => ({
                ...prev,
                basicInfo: {
                  ...prev.basicInfo,
                  certifications: [...(prev.basicInfo.certifications || []), certification]
                }
              }));
              // Clear the input after adding
              event.target.clear();
            }}
          />
          {companyProfile.basicInfo.certifications?.map((cert, index) => (
            <Text key={index} style={styles.certificationTag}>
              {cert}
              <TouchableOpacity onPress={() => {
                setCompanyProfile(prev => ({
                  ...prev,
                  basicInfo: {
                    ...prev.basicInfo,
                    certifications: prev.basicInfo.certifications.filter((_, i) => i !== index)
                  }
                }));
              }}>
                <Text style={styles.removeCertification}>✕</Text>
              </TouchableOpacity>
            </Text>
          ))}
        </View>
       
       
      </View>

  );
};


const styles = StyleSheet.create({
 
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F9FF', 
  },
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  contentContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  formContainer: {
    padding: 20,
  },
  stepContainer: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 28,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A365D',
    marginBottom: 32,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    fontSize: 16,
    color: '#2D3748',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  imagePickerButton: {
    backgroundColor: '#EBF8FF',
    borderWidth: 2,
    borderColor: '#63B3ED',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imagePickerButtonText: {
    color: '#2B6CB0',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  imagePreview: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignSelf: 'center',
    marginBottom: 24,
    backgroundColor: '#F7FAFC',
    borderWidth: 3,
    borderColor: '#63B3ED',
  },
});