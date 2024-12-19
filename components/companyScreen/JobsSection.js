import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const JobsSection = ({ companyData, editableData, setEditableData, onJobAdded }) => {
    const [isAddingNewJob, setIsAddingNewJob] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isAddJobModalVisible, setAddJobModalVisible] = useState(false);

    const [newJobData, setNewJobData] = useState({
        title: '',
        description: '',
        requirements: '',
        location: '',
        salary: '',
        type: 'Full-Time',
    });
    const handleAddNewJob = async () => {
        setLoading(true);
        if (!newJobData.title || !newJobData.description) {
            Alert.alert('Error', 'Job title and description are required');
            setLoading(false);
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.post(
                'https://ithub-backend.onrender.com/api/companies/add-job',
                {
                    companyId: companyData._id,
                    ...newJobData
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                // Reset new job data
                setNewJobData({
                    title: '',
                    description: '',
                    requirements: '',
                    location: '',
                    salary: '',
                    type: 'Full-Time',
                });
                setIsAddingNewJob(false);
                setAddJobModalVisible(false)

                // Call the callback to refetch data
                if (onJobAdded) {

                    await onJobAdded();
                    Alert.alert('Success', 'Job has been added successfully!');

                }
            } else {
                Alert.alert('Error', 'Failed to add job.');
            }
        } catch (error) {
            console.error('API Error:', error);
            Alert.alert('Error', 'An error occurred while adding the job. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditJob = (index, field, value) => {
        // Update the local state with the changes made by the user
        const updatedJobs = [...editableData.jobs];
        updatedJobs[index] = {
            ...updatedJobs[index],
            [field]: value
        };
        setEditableData({ ...editableData, jobs: updatedJobs });
    };

    const handleSaveChanges = async (index) => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const updatedJobData = editableData.jobs[index];

            // Make the API request to update the job
            const response = await axios.put(
                'https://ithub-backend.onrender.com/api/companies/update-job',
                {
                    companyId: companyData._id,
                    jobId: updatedJobData._id,  // Ensure jobId is used here
                    updatedData: {
                        title: updatedJobData.title,
                        description: updatedJobData.description,
                        requirements: updatedJobData.requirements,
                        location: updatedJobData.location,
                        salary: updatedJobData.salary,
                        type: updatedJobData.type
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                Alert.alert('Success', 'Job updated successfully!');

                // Disable editing mode after saving
                // const updatedEditableData = { ...editableData };
                // updatedEditableData.jobs[index].isEditing = false;  // Disable editing for the specific job
                // setEditableData(updatedEditableData);
                if (onJobAdded) {
                    await onJobAdded();
                }
            } else {
                Alert.alert('Error', 'Failed to update job.');
            }
        } catch (error) {
            console.error('API Error:', error);
            Alert.alert('Error', 'An error occurred while updating the job. Please try again.');
        } finally {
            setLoading(false);  // End loading after the API call completes
        }
    };



    const handleDeleteJob = async (index) => {
        // Ensure companyId and jobId are available
        const companyId = companyData._id; // Assuming companyData is available in editableData
        const jobId = editableData.jobs[index]._id; // Assuming jobId is available

        console.log(companyId, jobId);

        // Show confirmation alert before proceeding with deletion
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this job?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel', // Cancel button will not trigger any action
                },
                {
                    text: 'Delete',
                    style: 'destructive', // Delete button in red
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('token');

                            const response = await axios.delete(
                                `https://ithub-backend.onrender.com/api/companies/delete-job`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                    data: {
                                        companyId, // Send companyId and jobId in the request body
                                        jobId,
                                    },
                                }
                            );

                            if (response.status === 200) {
                                if (onJobAdded) {
                                    await onJobAdded();
                                }
                                // const updatedJobs = editableData.jobs.filter((_, i) => i !== index);
                                // setEditableData({ ...editableData, jobs: updatedJobs });
                                Alert.alert('Success', 'Job deleted successfully!');
                            } else {
                                Alert.alert('Error', 'Failed to delete job.');
                            }
                        } catch (error) {
                            console.error('API Error:', error);
                            Alert.alert('Error', 'An error occurred while deleting the job. Please try again.');
                        }
                    },
                },
            ],
            { cancelable: true } // Make the alert cancelable by tapping outside of it
        );
    };

    const handleCancelEdit = (index) => {
        const updatedJobs = [...editableData.jobs];
        updatedJobs[index].isEditing = false;
        setEditableData({ ...editableData, jobs: updatedJobs });
    };

    const renderJobCard = (job, index) => {
        if (job.isEditing) {
            return (
                <View style={styles.editJobContainer} key={index}>
                    <TextInput
                        style={styles.inputField}
                        value={job.title}
                        placeholder="Job Title"
                        placeholderTextColor="#A0AEC0"
                        onChangeText={(text) => handleEditJob(index, 'title', text)}
                    />
                    <TextInput
                        style={styles.textAreaField}
                        value={job.description}
                        placeholder="Job Description"
                        placeholderTextColor="#A0AEC0"
                        multiline
                        onChangeText={(text) => handleEditJob(index, 'description', text)}
                    />
                    <View style={styles.inputRow}>
                        <TextInput
                            style={[styles.inputField, styles.halfWidth]}
                            value={job.requirements}
                            placeholder="Requirements"
                            placeholderTextColor="#A0AEC0"
                            onChangeText={(text) => handleEditJob(index, 'requirements', text)}
                        />
                        <TextInput
                            style={[styles.inputField, styles.halfWidth]}
                            value={job.location}
                            placeholder="Location"
                            placeholderTextColor="#A0AEC0"
                            onChangeText={(text) => handleEditJob(index, 'location', text)}
                        />
                    </View>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={[styles.inputField, styles.halfWidth]}
                            value={job.salary ? job.salary.toString() : ''}
                            placeholder="Salary"
                            placeholderTextColor="#A0AEC0"
                            keyboardType="numeric"
                            onChangeText={(text) => handleEditJob(index, 'salary', text)}
                        />
                        <View style={[styles.inputField, styles.halfWidth]}>
                            <Picker
                                selectedValue={job.type}
                                onValueChange={(itemValue) => handleEditJob(index, 'type', itemValue)}
                                style={styles.pickerStyle}
                            >
                                <Picker.Item label="Full-Time" value="Full-Time" />
                                <Picker.Item label="Part-Time" value="Part-Time" />
                                <Picker.Item label="Internship" value="Internship" />
                                <Picker.Item label="Contract" value="Contract" />
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            onPress={() => handleSaveChanges(index)}
                            disabled={loading}
                            style={styles.primaryButton}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <Text style={styles.buttonText}>Save Changes</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handleCancelEdit(index)} // Handle cancel edit
                            style={styles.secondaryButton} // Style for Cancel button
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return (
            <View style={styles.jobCard} key={index}>
                <View style={styles.jobHeader}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <View style={styles.jobActions}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => {
                                const updatedJobs = [...editableData.jobs];
                                updatedJobs[index].isEditing = true;
                                setEditableData({ ...editableData, jobs: updatedJobs });
                            }}
                        >
                            <Ionicons name="create-outline" size={20} color="#4A5568" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => handleDeleteJob(index)}
                        >
                            <Ionicons name="trash-outline" size={20} color="#E53E3E" />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.jobDescription}>{job.description}</Text>
                <View style={styles.jobDetailsContainer}>
                    <View style={styles.jobDetailItem}>
                        <Ionicons name="briefcase-outline" size={16} color="#718096" />
                        <Text style={styles.jobDetailText}>{job.type}</Text>
                    </View>
                    <View style={styles.jobDetailItem}>
                        <Ionicons name="location-outline" size={16} color="#718096" />
                        <Text style={styles.jobDetailText}>{job.location}</Text>
                    </View>
                    <View style={styles.jobDetailItem}>
                        <Ionicons name="cash-outline" size={16} color="#718096" />
                        <Text style={styles.jobDetailText}>${job.salary}</Text>
                    </View>
                </View>
            </View>
        );
    };


    return (
        <View
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >

            <View style={styles.headerContainer}>
                <Text style={styles.sectionTitle}>Open Positions</Text>
                {!isAddingNewJob && (
                    <TouchableOpacity
                        style={styles.addJobButton}
                        onPress={() => setAddJobModalVisible(true)}
                    >
                        <Ionicons name="add-circle" size={24} color="#3182CE" />
                        <Text style={styles.addJobButtonText}>Add </Text>
                    </TouchableOpacity>
                )}
            </View>


            <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
            >
                {editableData.jobs.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="briefcase-outline" size={64} color="#A0AEC0" />
                        <Text style={styles.emptyStateText}>No open positions available</Text>
                    </View>
                ) : (
                    editableData.jobs.map(renderJobCard)
                )}

                {/* {isAddingNewJob && (
                    <View style={styles.editJobContainer}>
                        <TextInput
                            style={styles.inputField}
                            value={newJobData.title}
                            placeholder="Job Title"
                            placeholderTextColor="#A0AEC0"
                            onChangeText={(text) => setNewJobData({ ...newJobData, title: text })}
                        />
                        <TextInput
                            style={styles.textAreaField}
                            value={newJobData.description}
                            placeholder="Job Description"
                            placeholderTextColor="#A0AEC0"
                            multiline
                            onChangeText={(text) => setNewJobData({ ...newJobData, description: text })}
                        />
                        <View style={styles.inputRow}>
                            <TextInput
                                style={[styles.inputField, styles.halfWidth]}
                                value={newJobData.requirements}
                                placeholder="Requirements"
                                placeholderTextColor="#A0AEC0"
                                onChangeText={(text) => setNewJobData({ ...newJobData, requirements: text })}
                            />
                            <TextInput
                                style={[styles.inputField, styles.halfWidth]}
                                value={newJobData.location}
                                placeholder="Location"
                                placeholderTextColor="#A0AEC0"
                                onChangeText={(text) => setNewJobData({ ...newJobData, location: text })}
                            />
                        </View>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={[styles.inputField, styles.halfWidth]}
                                value={newJobData.salary}
                                placeholder="Salary"
                                placeholderTextColor="#A0AEC0"
                                keyboardType="numeric"
                                onChangeText={(text) => setNewJobData({ ...newJobData, salary: text })}
                            />
                            <View style={[styles.inputField, styles.halfWidth]}>
                                <Picker
                                    selectedValue={newJobData.type}
                                    style={styles.pickerStyle}
                                    onValueChange={(itemValue) => setNewJobData({ ...newJobData, type: itemValue })}
                                >
                                    <Picker.Item label="Full-Time" value="Full-Time" />
                                    <Picker.Item label="Part-Time" value="Part-Time" />
                                    <Picker.Item label="Internship" value="Internship" />
                                    <Picker.Item label="Contract" value="Contract" />
                                </Picker>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={handleAddNewJob}
                            disabled={loading}
                            style={styles.primaryButton}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <Text style={styles.buttonText}>Add Job</Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setIsAddingNewJob(false)}
                            style={styles.cancelButton}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                )} */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isAddJobModalVisible}
                    onRequestClose={() => setAddJobModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.editJobContainer}>
                                <TextInput
                                    style={styles.inputField}
                                    value={newJobData.title}
                                    placeholder="Job Title"
                                    placeholderTextColor="#A0AEC0"
                                    onChangeText={(text) => setNewJobData({ ...newJobData, title: text })}
                                />
                                <TextInput
                                    style={styles.textAreaField}
                                    value={newJobData.description}
                                    placeholder="Job Description"
                                    placeholderTextColor="#A0AEC0"
                                    multiline
                                    onChangeText={(text) => setNewJobData({ ...newJobData, description: text })}
                                />
                                <View style={styles.inputRow}>
                                    <TextInput
                                        style={[styles.inputField, styles.halfWidth]}
                                        value={newJobData.requirements}
                                        placeholder="Requirements"
                                        placeholderTextColor="#A0AEC0"
                                        onChangeText={(text) => setNewJobData({ ...newJobData, requirements: text })}
                                    />
                                    <TextInput
                                        style={[styles.inputField, styles.halfWidth]}
                                        value={newJobData.location}
                                        placeholder="Location"
                                        placeholderTextColor="#A0AEC0"
                                        onChangeText={(text) => setNewJobData({ ...newJobData, location: text })}
                                    />
                                </View>
                                <View style={styles.inputRow}>
                                    <TextInput
                                        style={[styles.inputField, styles.halfWidth]}
                                        value={newJobData.salary}
                                        placeholder="Salary"
                                        placeholderTextColor="#A0AEC0"
                                        keyboardType="numeric"
                                        onChangeText={(text) => setNewJobData({ ...newJobData, salary: text })}
                                    />
                                    <View style={[styles.inputField, styles.halfWidth]}>
                                        <Picker
                                            selectedValue={newJobData.type}
                                            style={styles.pickerStyle}
                                            onValueChange={(itemValue) => setNewJobData({ ...newJobData, type: itemValue })}
                                        >
                                            <Picker.Item label="Full-Time" value="Full-Time" />
                                            <Picker.Item label="Part-Time" value="Part-Time" />
                                            <Picker.Item label="Internship" value="Internship" />
                                            <Picker.Item label="Contract" value="Contract" />
                                        </Picker>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={handleAddNewJob}
                                    disabled={loading}
                                    style={styles.primaryButton}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <Text style={styles.buttonText}>Add Job</Text>
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setAddJobModalVisible(false)}
                                    style={styles.cancelButton}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7FAFC',
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom:20
       
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2D3748',
       
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    jobCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 10,
        margin:2,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2D3748',
    },
    jobActions: {
        flexDirection: 'row',
    },
    iconButton: {
        marginLeft: 12,
        padding: 4,
    },
    jobDescription: {
        color: '#4A5568',
        marginBottom: 12,
        lineHeight: 22,
    },
    jobDetailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    jobDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    jobDetailText: {
        marginLeft: 6,
        color: '#718096',
        fontSize: 14,
    },
    editJobContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    inputField: {
        backgroundColor: '#EDF2F7',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
        fontSize: 16,
        color: '#2D3748',
    },
    textAreaField: {
        backgroundColor: '#EDF2F7',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
        fontSize: 16,
        color: '#2D3748',
        minHeight: 100,
        textAlignVertical: 'top',
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfWidth: {
        width: '48%',
    },
    pickerStyle: {
        color: '#2D3748',
    },
    primaryButton: {
        backgroundColor: '#3182CE',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 12,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    addJobButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e9ecef',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    addJobButtonText: {
        color: '#3182CE',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    emptyStateText: {
        color: '#A0AEC0',
        fontSize: 18,
        marginTop: 16,
    },
    cancelButton: {
        padding: 10,
        backgroundColor: '#EDF2F7',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 12,
    },
    cancelButtonText: {
        color: '#4A5568',
        fontSize: 16,
        fontWeight: '600',
    }, secondaryButton: {
        padding: 10,
        backgroundColor: '#ccc',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 12,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        width: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 15,
        color: '#333',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    modalCancelButton: {
        flex: 1,
        marginRight: 10,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#F2F2F7',
        alignItems: 'center',
    },
    modalCancelButtonText: {
        color: '#007AFF',
        fontWeight: '600',
    },
    modalSaveButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#007AFF',
        alignItems: 'center',
    },
    modalSaveButtonText: {
        color: 'white',
        fontWeight: '600',
    },

});

export default JobsSection;