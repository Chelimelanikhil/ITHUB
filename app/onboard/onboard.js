import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';



const CompanyOnboarding = () => {
    const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [companyProfile, setCompanyProfile] = useState({
    basicInfo: {
      name: '',
      image: '',
      industry: '',
      founded: '',
      employees: '',
      email:'',
      rating:''
    },
    about: '',
    jobs: [],
    reviews: [],
    gallery: []
  });

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
        // const token = await AsyncStorage.getItem('token');
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTY5MmVmNWMwZjQ1OTI5MjYxZjlmYyIsImVtYWlsIjoibmlraGlsQGdtYWlsLmNvbSIsImlhdCI6MTczMzc0MTY3NSwiZXhwIjoxNzMzNzQ1Mjc1fQ.ix2BVmCHjQpEtVZGPYWc8nh5HRxEeXNdyiqJnuUBvbk";
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
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Basic Company Information</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Company Name"
          value={companyProfile.basicInfo.name}
          onChangeText={(text) => setCompanyProfile(prev => ({
            ...prev, 
            basicInfo: {...prev.basicInfo, name: text}
          }))}
        />
         <TextInput
        style={styles.input}
        placeholder="Email"
        value={companyProfile.basicInfo.email}  // Add value for email
        onChangeText={(text) => setCompanyProfile(prev => ({
          ...prev, 
          basicInfo: {...prev.basicInfo, email: text}
        }))}
      />
        <TextInput
          style={styles.input}
          placeholder="Logo URL"
          value={companyProfile.basicInfo.logo}
          onChangeText={(text) => setCompanyProfile(prev => ({
            ...prev, 
            basicInfo: {...prev.basicInfo, image: text}
          }))}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Industry"
          value={companyProfile.basicInfo.industry}
          onChangeText={(text) => setCompanyProfile(prev => ({
            ...prev, 
            basicInfo: {...prev.basicInfo, industry: text}
          }))}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Year Founded"
          value={companyProfile.basicInfo.founded}
          onChangeText={(text) => setCompanyProfile(prev => ({
            ...prev, 
            basicInfo: {...prev.basicInfo, founded: text}
          }))}
          keyboardType="numeric"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Company Size"
          value={companyProfile.basicInfo.employees}
          onChangeText={(text) => setCompanyProfile(prev => ({
            ...prev, 
            basicInfo: {...prev.basicInfo, employees: text}
          }))}
        />
          <TextInput
          style={styles.input}
          placeholder="Rating "
          value={companyProfile.basicInfo.rating}
          onChangeText={(text) => setCompanyProfile(prev => ({
            ...prev, 
            basicInfo: {...prev.basicInfo, rating: text}
          }))}
        />
        
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNextStep}
        >
          <Text style={styles.nextButtonText}>Next: About Company</Text>
        </TouchableOpacity>
      </View>
    );
  };

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
        
        <View style={styles.navigationButtons}>
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
        </View>
      </View>
    );
  };

  const renderJobsStep = () => {
    const addJob = () => {
      setCompanyProfile(prev => ({
        ...prev,
        jobs: [
          ...prev.jobs,
          {
            title: '',
            description: '',
            requirements: '',
            location: '',
            salary: '',
          },
        ],
      }));
    };
  
    const updateJob = (index, field, value) => {
      const newJobs = [...companyProfile.jobs];
      newJobs[index][field] = value;
      setCompanyProfile(prev => ({
        ...prev,
        jobs: newJobs,
      }));
    };
  
    const removeJob = (index) => {
      const newJobs = companyProfile.jobs.filter((_, i) => i !== index);
      setCompanyProfile(prev => ({
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
  
        <View style={styles.navigationButtons}>
          <TouchableOpacity style={styles.backButton} onPress={handlePreviousStep}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
            <Text style={styles.nextButtonText}>Next: Reviews</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const renderReviewsStep = () => {
    const addReview = () => {
      setCompanyProfile(prev => ({
        ...prev,
        reviews: [...prev.reviews, { author: '', text: '', rating: '' }],
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
        <View style={styles.navigationButtons}>
          <TouchableOpacity style={styles.backButton} onPress={handlePreviousStep}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
  
          <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
            <Text style={styles.nextButtonText}>Next: Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  

  const renderGalleryStep = () => {
    const addGalleryImage = () => {
      setCompanyProfile(prev => ({
        ...prev,
        gallery: [...prev.gallery, { url: '' }]
      }));
    };

    const updateGalleryImage = (index, value) => {
      const newGallery = [...companyProfile.gallery];
      newGallery[index].url = value;
      setCompanyProfile(prev => ({
        ...prev,
        gallery: newGallery
      }));
    };

    const removeGalleryImage = (index) => {
      const newGallery = companyProfile.gallery.filter((_, i) => i !== index);
      setCompanyProfile(prev => ({
        ...prev,
        gallery: newGallery
      }));
    };

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Company Gallery</Text>
        
        {companyProfile.gallery.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <TextInput
              style={styles.input}
              placeholder="Image URL"
              value={image.url}
              onChangeText={(text) => updateGalleryImage(index, text)}
            />
            
            {image.url ? (
              <Image 
                source={{ uri: image.url }} 
                style={styles.previewImage} 
              />
            ) : null}
            
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
        
        <View style={styles.navigationButtons}>
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
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.progressBar}>
          {[1, 2, 3, 4, 5].map(step => (
            <View 
              key={step} 
              style={[
                styles.progressStep, 
                currentStep >= step ? styles.activeProgressStep : {}
              ]} 
            />
          ))}
        </View>

        {currentStep === 1 && renderBasicInfoStep()}
        {currentStep === 2 && renderAboutStep()}
        {currentStep === 3 && renderJobsStep()}
        {currentStep === 4 && renderReviewsStep()}
        {currentStep === 5 && renderGalleryStep()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  progressStep: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  activeProgressStep: {
    backgroundColor: '#4A90E2',
  },
  stepContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ECF0F1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ECF0F1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    minHeight: 100,
    fontSize: 16,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#ECF0F1',
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
    flex: 1,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#2C3E50',
    fontWeight: 'bold',
    fontSize: 16,
  },
  jobContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F7F9FC',
    borderRadius: 10,
  },
  reviewContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F7F9FC',
    borderRadius: 10,
  },
  imageContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F7F9FC',
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: '#E8F4F8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#FFE5E5',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  removeButtonText: {
    color: '#E74C3C',
    fontWeight: 'bold',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  finalSubmitButton: {
    backgroundColor: '#2ECC71',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  finalSubmitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default CompanyOnboarding;