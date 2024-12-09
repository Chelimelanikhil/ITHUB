import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import axios from 'axios';

const CompanyProfile = () => {
  const [companyData, setCompanyData] = useState(null); // Initial state as null to check loading status
  const [activeSection, setActiveSection] = useState('about');
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNewJob, setIsAddingNewJob] = useState(false); 
  const [editableData, setEditableData] = useState(null); // Same here, start with null
  const [newJobData, setNewJobData] = useState(null); // Same here, start with null

  const router = useRouter();

  // Fetch company data from API
  const fetchCompanyData = async () => {
    try {
      //const token = await AsyncStorage.getItem('token');
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTY5MmVmNWMwZjQ1OTI5MjYxZjlmYyIsImVtYWlsIjoibmlraGlsQGdtYWlsLmNvbSIsImlhdCI6MTczMzc0MTY3NSwiZXhwIjoxNzMzNzQ1Mjc1fQ.ix2BVmCHjQpEtVZGPYWc8nh5HRxEeXNdyiqJnuUBvbk";

      const response = await axios.get('http://localhost:5000/api/companies/companydetails', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Log the response to check its structure
      console.log(response.data);
  
      // Assuming the response structure matches, set the data
      setCompanyData(response.data);
      setEditableData(response.data); // Set editable data if you're editing
    } catch (error) {
      console.error('Error fetching company data:', error);
      Alert.alert('Error', 'Could not fetch company details. Please try again later.');
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  useEffect(() => {
    if (companyData) {
      console.log(companyData);
    }
  }, [companyData]);
  
  const handleSave = () => {
    setCompanyData({ ...editableData });
    setIsEditing(false);
    Alert.alert('Success', 'Company details updated successfully!');
  };

  const handleLogout = async () => {
    try {
      // Clear the user token from AsyncStorage
      await AsyncStorage.removeItem('token');
      // Show a success message
      Alert.alert('Logged out successfully');
      // Redirect to the SignIn screen
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error logging out. Please try again.');
    }
  };

  const handleAddNewJob = () => {
    const newJob = { title: '', description: '' };
    const updatedJobs = [...editableData.jobs, newJob];
    setEditableData({ ...editableData, jobs: updatedJobs });
    setIsEditing(true); // Enable editing mode to let the user fill out the new job.
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Image 
        source={{ uri: companyData.image }} 
        style={styles.companyLogo} 
      />
      <View style={styles.headerContent}>
        <Text style={styles.companyName}>{companyData.name}</Text>
        <Text style={styles.companySubtitle}>
          {companyData.industry} • Founded {companyData.founded}
        </Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#FF4D4D" />
      </TouchableOpacity>
    </View> 
  );

  const renderSectionNavigation = () => (
    <View style={styles.sectionNavigation}>
      {[
        { key: 'about', label: 'About', icon: 'information-circle' },
        { key: 'jobs', label: 'Jobs', icon: 'briefcase' },
        { key: 'gallery', label: 'Gallery', icon: 'images' },
        { key: 'reviews', label: 'Reviews', icon: 'star' },
      ].map(section => (
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

  const renderAboutSection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.sectionTitle}>
        About Company
        {!isEditing && (
          <TouchableOpacity 
            onPress={() => setIsEditing(true)} 
            style={styles.editButton}
          >
            <Ionicons name="pencil" size={18} color="#4A90E2" />
          </TouchableOpacity>
        )}
      </Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={editableData.about}
          onChangeText={(text) => setEditableData({ ...editableData, about: text })}
          multiline
        />
      ) : (
        <Text style={styles.aboutText}>{companyData.about}</Text>
      )}
    </View>
  );

  const renderJobsSection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.sectionTitle}>Open Positions</Text>
  
      {editableData.jobs.length === 0 ? (
        <Text style={styles.noJobsText}>No open positions available</Text>
      ) : (
        editableData.jobs.map((job, index) => (
          <View key={index} style={styles.jobContainer}>
            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              {!job.isEditing ? (
                <>
                  {/* Edit Button */}
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                      const updatedJobs = [...editableData.jobs];
                      updatedJobs[index].isEditing = true;
                      setEditableData({ ...editableData, jobs: updatedJobs });
                    }}
                  >
                    <Ionicons name="pencil" size={18} color="#4A90E2" />
                  </TouchableOpacity>
  
                  {/* Delete Button */}
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                      const updatedJobs = editableData.jobs.filter((_, i) => i !== index);
                      setEditableData({ ...editableData, jobs: updatedJobs });
                    }}
                  >
                    <Ionicons name="trash" size={18} color="#E74C3C" />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => {
                    const updatedJobs = [...editableData.jobs];
                    updatedJobs[index].isEditing = false;
                    setEditableData({ ...editableData, jobs: updatedJobs });
                  }}
                >
                  <Ionicons name="checkmark" size={18} color="white" />
                </TouchableOpacity>
              )}
            </View>
  
            {job.isEditing ? (
              <>
                <TextInput
                  style={styles.input}
                  value={job.title}
                  placeholder="Job Title"
                  onChangeText={(text) => {
                    const updatedJobs = [...editableData.jobs];
                    updatedJobs[index].title = text;
                    setEditableData({ ...editableData, jobs: updatedJobs });
                  }}
                />
                <TextInput
                  style={styles.textArea}
                  value={job.description}
                  placeholder="Job Description"
                  onChangeText={(text) => {
                    const updatedJobs = [...editableData.jobs];
                    updatedJobs[index].description = text;
                    setEditableData({ ...editableData, jobs: updatedJobs });
                  }}
                  multiline
                />
                <TextInput
                  style={styles.input}
                  value={job.requirements}
                  placeholder="Job Requirements"
                  onChangeText={(text) => {
                    const updatedJobs = [...editableData.jobs];
                    updatedJobs[index].requirements = text;
                    setEditableData({ ...editableData, jobs: updatedJobs });
                  }}
                />
                <TextInput
                  style={styles.input}
                  value={job.location}
                  placeholder="Location"
                  onChangeText={(text) => {
                    const updatedJobs = [...editableData.jobs];
                    updatedJobs[index].location = text;
                    setEditableData({ ...editableData, jobs: updatedJobs });
                  }}
                />
                <TextInput
                  style={styles.input}
                  value={job.salary?.toString()}
                  placeholder="Salary (e.g., 50000)"
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const updatedJobs = [...editableData.jobs];
                    updatedJobs[index].salary = text;
                    setEditableData({ ...editableData, jobs: updatedJobs });
                  }}
                />
              </>
            ) : (
              <View style={styles.jobCard}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.jobDescription}>{job.description}</Text>
                <Text style={styles.jobRequirements}>
                  Requirements: {job.requirements}
                </Text>
                <Text style={styles.jobLocation}>Location: {job.location}</Text>
                <Text style={styles.jobSalary}>Salary: {job.salary}</Text>
              </View>
            )}
          </View>
        ))
      )}
  
      {/* Show input fields for a new job */}
      {isAddingNewJob && (
        <View style={styles.jobContainer}>
          <TextInput
            style={styles.input}
            placeholder="Job Title"
            onChangeText={(text) => setNewJobData({ ...newJobData, title: text })}
          />
          <TextInput
            style={styles.textArea}
            placeholder="Job Description"
            onChangeText={(text) => setNewJobData({ ...newJobData, description: text })}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Job Requirements"
            onChangeText={(text) => setNewJobData({ ...newJobData, requirements: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            onChangeText={(text) => setNewJobData({ ...newJobData, location: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Salary"
            keyboardType="numeric"
            onChangeText={(text) => setNewJobData({ ...newJobData, salary: text })}
          />
  
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveNewJob}>
            <Text style={styles.saveButtonText}>Save Job</Text>
          </TouchableOpacity>
        </View>
      )}
  
      {/* Add New Job Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setIsAddingNewJob(true)}>
        <Ionicons name="add-circle" size={24} color="#4A90E2" />
        <Text style={styles.addButtonText}>Add New Job</Text>
      </TouchableOpacity>
    </View>
  );
  
  
  
  // Function to handle saving new job
  const handleSaveNewJob = () => {
    setEditableData(prev => ({
      ...prev,
      jobs: [...prev.jobs, newJobData], // Add new job to the existing jobs list
    }));
    setIsAddingNewJob(false); // Hide the new job input fields
    setNewJobData({}); // Clear the new job data
  };
  
  
  const renderGallerySection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.sectionTitle}>
        Gallery
        {!isEditing && (
          <TouchableOpacity 
            onPress={() => setIsEditing(true)} 
            style={styles.editButton}
          >
            <Ionicons name="pencil" size={18} color="#4A90E2" />
          </TouchableOpacity>
        )}
      </Text>
  
      {isEditing ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add image URL"
            value={editableData.newGalleryImage}
            onChangeText={(text) => setEditableData({ ...editableData, newGalleryImage: text })}
          />
          <TouchableOpacity
            onPress={() => {
              if (editableData.newGalleryImage.trim() !== '') {
                const updatedGallery = [
                  ...editableData.gallery,
                  { url: editableData.newGalleryImage.trim() },
                ];
                setEditableData({ ...editableData, gallery: updatedGallery, newGalleryImage: '' });
              }
            }}
            style={styles.addButton}
          >
            <Ionicons name="add-circle" size={24} color="#4A90E2" />
            <Text style={styles.addButtonText}>Add Image</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {editableData.gallery.length > 0 ? (
            editableData.gallery.map((imageObj, index) => {
              console.log("Rendering image URL:", imageObj.url); // Debugging
              return (
                <Image
                key={index}
                source={{ uri: imageObj.url }}
                style={styles.galleryImage}
                onError={(e) => console.log(`Image failed to load at index ${index}:`, e.nativeEvent.error)}
              />
              
              );
            })
          ) : (
            <Text style={styles.noImageText}>No images available</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
  
  
  const renderReviewsSection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.sectionTitle}>Reviews</Text>
  
      {editableData.reviews.length === 0 ? (
        <Text style={styles.noReviewsText}>No reviews available</Text>
      ) : (
        editableData.reviews.map((review, index) => (
          <View key={index} style={styles.reviewCardContainer}>
            {!review.isEditing ? (
              <View style={styles.reviewCard}>
                <Text style={styles.reviewAuthor}>{review.author}</Text>
                <Text style={styles.reviewComment}>{review.text}</Text>
                <Text style={styles.reviewRating}>
                  <Ionicons name="star" size={16} color="#FFD700" /> {review.rating}/5
                </Text>
                <View style={styles.actionButtons}>
                  {/* Edit Button */}
                  <TouchableOpacity
                    onPress={() => {
                      const updatedReviews = [...editableData.reviews];
                      updatedReviews[index].isEditing = true;
                      setEditableData({ ...editableData, reviews: updatedReviews });
                    }}
                    style={styles.editButton}
                  >
                    <Ionicons name="pencil" size={18} color="#4A90E2" />
                  </TouchableOpacity>
  
                  {/* Delete Button */}
                  <TouchableOpacity
                    onPress={() => {
                      const updatedReviews = editableData.reviews.filter(
                        (_, i) => i !== index
                      );
                      setEditableData({ ...editableData, reviews: updatedReviews });
                    }}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash" size={18} color="#E74C3C" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.editableReviewCard}>
                {/* Edit Author */}
                <TextInput
                  style={styles.input}
                  value={review.author}
                  onChangeText={(text) => {
                    const updatedReviews = [...editableData.reviews];
                    updatedReviews[index].author = text;
                    setEditableData({ ...editableData, reviews: updatedReviews });
                  }}
                  placeholder="Edit author name"
                />
  
                {/* Edit Comment */}
                <TextInput
                  style={styles.input}
                  value={review.text}
                  onChangeText={(text) => {
                    const updatedReviews = [...editableData.reviews];
                    updatedReviews[index].text = text;
                    setEditableData({ ...editableData, reviews: updatedReviews });
                  }}
                  placeholder="Edit your review"
                  multiline
                />
  
                {/* Edit Rating */}
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={review.rating ? review.rating.toString() : ''}
                  onChangeText={(text) => {
                    const updatedReviews = [...editableData.reviews];
                    updatedReviews[index].rating = parseInt(text, 10) || 0;
                    setEditableData({ ...editableData, reviews: updatedReviews });
                  }}
                  placeholder="Edit rating (1-5)"
                />
  
                {/* Save Button */}
                <TouchableOpacity
                  onPress={() => {
                    const updatedReviews = [...editableData.reviews];
                    updatedReviews[index].isEditing = false;
                    setEditableData({ ...editableData, reviews: updatedReviews });
                  }}
                  style={styles.saveButton}
                >
                  <Ionicons name="checkmark" size={18} color="#4A90E2" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
      )}
  
      {/* Add New Review Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          const newReview = { author: '', text: '', rating: 0, isEditing: true };
          const updatedReviews = [...editableData.reviews, newReview];
          setEditableData({ ...editableData, reviews: updatedReviews });
        }}
      >
        <Ionicons name="add-circle" size={24} color="#4A90E2" />
        <Text style={styles.addButtonText}>Add New Review</Text>
      </TouchableOpacity>
    </View>
  );
  
  




  const renderContent = () => {
    switch (activeSection) {
      case 'about':
        return renderAboutSection();
      case 'jobs':
        return renderJobsSection();
      case 'gallery':
        return renderGallerySection();
      case 'reviews':
        return renderReviewsSection();
      default:
        return <Text style={styles.sectionContent}>Content not available.</Text>;
    }
  };
  if (!companyData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading company details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {renderHeader()}
      {renderSectionNavigation()}
      {renderContent()}
      {isEditing && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  companyLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  companySubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
  },
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
  sectionContent: {
    padding: 15,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    padding: 10,
    fontSize: 16,
  },
  aboutText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  editButton: {
    position: 'absolute',
    top: 0,
    right: 10,
    zIndex:1
  },
  jobCard: {
    padding: 10,
    backgroundColor: '#ECF0F1',
    marginBottom: 10,
    borderRadius: 5,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  jobDescription: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    marginLeft: 5,
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    marginBottom: 20,
    alignItems: 'center',
    borderRadius: 5,
  },
  saveButtonText: {
    fontSize: 18,
    color: 'white',
  },
  logoutButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  jobContainer: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
    position: 'relative',
  },
  
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#BDBDBD',
    marginBottom: 10,
    padding: 8,
    fontSize: 14,
    color: '#333',
  },

  textArea: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    fontSize: 14,
    height: 100,
    textAlignVertical: 'top',
  },

  saveButton: {
    marginTop: 15,
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },

  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  addButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    marginLeft: 8,
  },
  galleryImage: {
    width: 150, // Adjust width as needed
    height: 150, // Adjust height as needed
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#ccc', // Add a background color for debugging
  },
  reviewCardContainer: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    padding: 15,
  },
  reviewCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  editableReviewCard: {
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#f0f8ff',
  },
  reviewAuthor: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  reviewComment: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  reviewRating: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFD700',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    marginRight: 10,
  },
  deleteButton: {},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    marginLeft: 8,
  },
  saveButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  jobContainer: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  jobCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  editButton: {
    marginRight: 10,
  },
  deleteButton: {},
  saveButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#4A90E2',
    padding: 8,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
    height: 80,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    marginLeft: 8,
  },
  noReviewsText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  noJobsText: {
    fontSize: 16,
    color: '#999',  // You can choose a color that matches the design
    textAlign: 'center',
    marginTop: 10,
  },
  noImageText: {
    fontSize: 16,
    color: '#999',  // You can choose a color that matches the design
    textAlign: 'center',
    marginTop: 10,
  },
  
});

export default CompanyProfile;
