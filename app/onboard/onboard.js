import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from "expo-router";
import * as ImagePicker from 'expo-image-picker';




const CompanyOnboarding = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [companyProfile, setCompanyProfile] = useState({
    basicInfo: {
      name: '',
      logo: '',
      location: '',
      industry: '',
      founded: '',
      employees: '',
      email: '',
      rating: '',
      website: '',
      phone: '',
      headquarters: '',
      socialLinks: {
        linkedin: '',
        twitter: ''
      },
      openings: '',
      description: '',
      certifications: []
    },
    about: '',
    jobs: [],
    reviews: [],
    gallery: []
  });


  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTransparent: false,
      headerTitle: "",
    });
  }, []);

  const handleNextStep = () => {
    console.log(companyProfile.basicInfo);
    setCurrentStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      //const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NjU2YTc3NDkxYTdjMjA1ZTViZWJhNiIsImVtYWlsIjoibmFuaUBnbWFpbC5jb20iLCJpYXQiOjE3MzQ3MDAwMTUsImV4cCI6MTczNDczNjAxNX0.gzFamssyvBUM5trr--8l_yTQwHxgom8Fv3RB40gxdNU";
      await axios.post('http://localhost:5000/api/companies/onboarding',
        companyProfile,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      router.replace('/company/company'); // Navigate to company-specific screen
    } catch (error) {
      console.error('Onboarding submission error:', error);
    }
  };

  const renderBasicInfoStep = () => {
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
        {/* <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNextStep}
        >
          <Text style={styles.nextButtonText}>Next: About Company</Text>
        </TouchableOpacity> */}
        {renderNavigationButtons(
        handlePreviousStep,
        handleNextStep
      )}
      </View>
    );
  };


  const renderNavigationButtons = (onBack, onNext, isLastStep = false) => (
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

  const renderAboutStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>About Your Company</Text>

        <TextInput
          style={styles.textArea}
          multiline
          placeholder="Tell us about your company's mission, values, and culture"
          value={companyProfile.about}
          onChangeText={(text) => setCompanyProfile(prev => ({
            ...prev,
            about: text
          }))}
        />

        {/* <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handlePreviousStep}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNextStep}
          >
            <Text style={styles.nextButtonText}>Next: Job Openings</Text>
          </TouchableOpacity>
      
        </View> */}
        {renderNavigationButtons(
        handlePreviousStep,
        handleNextStep
      )}
      </View>
    );
  };

  const renderJobsStep = () => {
    const addJob = () => {
      setCompanyProfile((prev) => ({
        ...prev,
        jobs: [
          ...prev.jobs,
          {
            title: '',
            description: '',
            requirements: '',
            location: '',
            salary: '',
            type: '',
          },
        ],
      }));
    };

    const updateJob = (index, field, value) => {
      const newJobs = [...companyProfile.jobs];
      newJobs[index][field] = value;
      setCompanyProfile((prev) => ({
        ...prev,
        jobs: newJobs,
      }));
    };

    const removeJob = (index) => {
      const newJobs = companyProfile.jobs.filter((_, i) => i !== index);
      setCompanyProfile((prev) => ({
        ...prev,
        jobs: newJobs,
      }));
    };

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Job Openings</Text>

        {companyProfile.jobs.map((job, index) => (
          <View key={index} style={styles.jobContainer}>
            <TextInput
              style={styles.input}
              placeholder="Job Title"
              value={job.title}
              onChangeText={(text) => updateJob(index, 'title', text)}
            />
            <TextInput
              style={styles.textArea}
              multiline
              placeholder="Job Description"
              value={job.description}
              onChangeText={(text) => updateJob(index, 'description', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Job Requirements"
              value={job.requirements}
              onChangeText={(text) => updateJob(index, 'requirements', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Job Location"
              value={job.location}
              onChangeText={(text) => updateJob(index, 'location', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Salary"
              value={job.salary}
              keyboardType="numeric"
              onChangeText={(text) => updateJob(index, 'salary', text)}
            />
            <View style={styles.pickerContainer}>

              <Picker
                selectedValue={job.type}
                style={styles.picker}
                onValueChange={(itemValue) => updateJob(index, 'type', itemValue)}
              >
                <Picker.Item label="Select Job Type" value="" />
                <Picker.Item label="Full-Time" value="Full-Time" />
                <Picker.Item label="Part-Time" value="Part-Time" />
              </Picker>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeJob(index)}
            >
              <Text style={styles.removeButtonText}>Remove Job</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addJob}>
          <Text style={styles.addButtonText}>+ Add Job Opening</Text>
        </TouchableOpacity>

        {/* <View style={styles.navigationButtons}>
          <TouchableOpacity style={styles.backButton} onPress={handlePreviousStep}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
            <Text style={styles.nextButtonText}>Next: Reviews</Text>
          </TouchableOpacity>
        </View> */}
        {renderNavigationButtons(
        handlePreviousStep,
        handleNextStep
      )}
      </View>
    );
  };

  const renderReviewsStep = () => {
    const addReview = () => {
      setCompanyProfile(prev => ({
        ...prev,
        reviews: [...prev.reviews, { author: '', designation:'',text: '', rating: '' }],
      }));
    };

    const updateReview = (index, field, value) => {
      const newReviews = [...companyProfile.reviews];
      newReviews[index][field] = value;
      setCompanyProfile(prev => ({
        ...prev,
        reviews: newReviews,
      }));
    };

    const removeReview = (index) => {
      const newReviews = companyProfile.reviews.filter((_, i) => i !== index);
      setCompanyProfile(prev => ({
        ...prev,
        reviews: newReviews,
      }));
    };

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Company Reviews</Text>

        {companyProfile.reviews.map((review, index) => (
          <View key={index} style={styles.reviewContainer}>
            {/* Reviewer Name */}
            <TextInput
              style={styles.input}
              placeholder="Reviewer Name"
              value={review.author}
              onChangeText={(text) => updateReview(index, 'author', text)}
            />
             <TextInput
              style={styles.textArea}
              multiline
              placeholder="Designation"
              value={review.designation}
              onChangeText={(text) => updateReview(index, 'designation', text)}
            />

            {/* Review Text */}
            <TextInput
              style={styles.textArea}
              multiline
              placeholder="Review Text"
              value={review.text}
              onChangeText={(text) => updateReview(index, 'text', text)}
            />

            {/* Rating */}
            <TextInput
              style={styles.input}
              placeholder="Rating (1-5)"
              keyboardType="numeric"
              value={review.rating ? review.rating.toString() : ''}
              onChangeText={(text) => updateReview(index, 'rating', text)}
            />


            {/* Remove Review Button */}
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeReview(index)}
            >
              <Text style={styles.removeButtonText}>Remove Review</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Add Review Button */}
        <TouchableOpacity style={styles.addButton} onPress={addReview}>
          <Text style={styles.addButtonText}>+ Add Review</Text>
        </TouchableOpacity>

        {/* Navigation Buttons */}
        {/* <View style={styles.navigationButtons}>
          <TouchableOpacity style={styles.backButton} onPress={handlePreviousStep}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
            <Text style={styles.nextButtonText}>Next: Gallery</Text>
          </TouchableOpacity>
        </View> */}
        {renderNavigationButtons(
        handlePreviousStep,
        handleNextStep
      )}
      </View>
    );
  };

  const renderStepIndicator = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        {[1, 2, 3, 4, 5].map(step => (
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
               step === 4 ? 'Reviews' : 'Gallery'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );


  const renderInputField = (placeholder, value, onChangeText, multiline = false, keyboardType = 'default') => (
    <TextInput
      style={multiline ? styles.textArea : styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      numberOfLines={multiline ? 4 : 1}
      keyboardType={keyboardType}
      placeholderTextColor="#A0AEC0"
    />
  );

  const renderButton = (onPress, text, type = 'primary') => (
    <TouchableOpacity
      style={[
        styles.button,
        type === 'primary' ? styles.primaryButton : 
        type === 'secondary' ? styles.secondaryButton : styles.dangerButton
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.buttonText,
        type === 'secondary' ? styles.secondaryButtonText : styles.primaryButtonText
      ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
  const renderGalleryStep = () => {
    const addGalleryImage = async () => {
      const maxImages = 10; // Define the maximum number of images allowed
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
        selectionLimit: maxImages - companyProfile.gallery.length,
      });
  
      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        const newImages = pickerResult.assets.map(asset => ({
          url: asset.uri,
          isNew: true,
        }));
  
        setCompanyProfile(prev => ({
          ...prev,
          gallery: [...prev.gallery, ...newImages],
        }));
      }
    };
  
   
  
    const removeGalleryImage = (index) => {
      const newGallery = companyProfile.gallery.filter((_, i) => i !== index);
      setCompanyProfile(prev => ({
        ...prev,
        gallery: newGallery,
      }));
    };
  
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Company Gallery</Text>
  
        {companyProfile.gallery.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            {image.url ? (
              <Image
                source={{ uri: image.url }}
                style={styles.previewImage}
              />
            ) : (
              <Text>No Image</Text>
            )}
  
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeGalleryImage(index)}
            >
              <Text style={styles.removeButtonText}>Remove Image</Text>
            </TouchableOpacity>
          </View>
        ))}
  
        <TouchableOpacity
          style={styles.addButton}
          onPress={addGalleryImage}
        >
          <Text style={styles.addButtonText}>+ Add Gallery Image</Text>
        </TouchableOpacity>
  
        {/* <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handlePreviousStep}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={styles.finalSubmitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.finalSubmitButtonText}>Complete Profile</Text>
          </TouchableOpacity>
        </View> */}
        {renderNavigationButtons(
        handlePreviousStep,
        handleSubmit,
        true
      )}
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Fixed Header */}
        {renderStepIndicator()}
        
        {/* Scrollable Content */}
        <KeyboardAvoidingView
          style={styles.contentContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formContainer}>
              {currentStep === 1 && renderBasicInfoStep()}
              {currentStep === 2 && renderAboutStep()}
              {currentStep === 3 && renderJobsStep()}
              {currentStep === 4 && renderReviewsStep()}
              {currentStep === 5 && renderGalleryStep()}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: 20,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    flex: 1,
    backgroundColor: '#EDF2F7',
    borderRadius: 12,
    paddingVertical: 16,
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
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  fullWidthButton: {
    flex: 2,
    marginLeft: 0,
  },
  submitButton: {
    backgroundColor: '#48BB78',
  },
  backButtonText: {
    color: '#2D3748',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  backButtonIcon: {
    color: '#2D3748',
    fontSize: 18,
    marginRight: 8,
    fontWeight: '600',
  },
  nextButtonIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 8,
    fontWeight: '600',
  },
  stepContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
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
  progressContainer: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  progressBarWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  progressStep: {
    width: '100%',
    height: 4,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 2,
  },
  activeProgressStep: {
    backgroundColor: '#4299E1',
  },
  stepLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  activeStepLabel: {
    color: '#4299E1',
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  formContainer: {
    padding: 20,
  },
  progressContainer: {
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBarWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  progressStep: {
    width: '100%',
    height: 4,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 2,
  },
  activeProgressStep: {
    backgroundColor: '#4299E1',
  },
  stepLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  activeStepLabel: {
    color: '#4299E1',
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#2D3748',
  },
  textArea: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#2D3748',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  primaryButton: {
    backgroundColor: '#4299E1',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4299E1',
  },
  dangerButton: {
    backgroundColor: '#FEB2B2',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: 'white',
  },
  secondaryButtonText: {
    color: '#4299E1',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 24,
    textAlign: 'center',
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  imagePickerButton: {
    backgroundColor: '#EBF8FF',
    borderWidth: 1,
    borderColor: '#4299E1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePickerButtonText: {
    color: '#4299E1',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 16,
    backgroundColor: '#F7FAFC',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5568',
    marginBottom: 8,
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 14,
    marginTop: 4,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: '#ff6666',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F7F9FC',
    borderRadius: 10,
  },  
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },

  
});

export default CompanyOnboarding;
