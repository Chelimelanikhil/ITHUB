import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Make sure to import axios

const ReviewsSection = ({ companyData, editableData, setEditableData, onReviewAdded }) => {
    const [isAddReviewModalVisible, setAddReviewModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newReview, setNewReview] = useState({
        author: '',
        designation: '',
        text: '',
        rating: '',
    });

    const addNewReview = async () => {
        setLoading(true);
        const reviewToAdd = {
            companyId: companyData._id,
            author: newReview.author,
            designation: newReview.designation, // Include designation
            text: newReview.text,
            rating: parseInt(newReview.rating, 10),
        };

        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('https://ithub-backend.onrender.com/api/companies/add-review', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewToAdd),
            });

            if (response.ok) {
                setNewReview({ author: '', designation: '', text: '', rating: '' });
                setAddReviewModalVisible(false);

                if (onReviewAdded) {
                    await onReviewAdded();
                    Alert.alert('Success', 'Review has been added successfully!');
                }
            } else {
                Alert.alert('Error', 'Failed to add review.');
            }
        } catch (error) {
            console.error('Error adding review:', error);
            Alert.alert('Error', 'There was an error adding your review.');
        }finally {
            setLoading(false);
        }
    };

    const handleEditReview = (index, field, value) => {
        const updatedReviews = [...editableData.reviews];
        updatedReviews[index] = { ...updatedReviews[index], [field]: value };
        setEditableData({ ...editableData, reviews: updatedReviews });
    };

    const handleSaveReviewChanges = async (index) => {
        setLoading(true);

        try {
            const token = await AsyncStorage.getItem('token');
            const updatedReviewData = editableData.reviews[index];

            const response = await axios.put(
                'https://ithub-backend.onrender.com/api/companies/update-review',
                {
                    companyId: companyData._id,
                    reviewId: updatedReviewData._id,
                    author: updatedReviewData.author,
                    designation: updatedReviewData.designation, // Include designation
                    text: updatedReviewData.text,
                    rating: updatedReviewData.rating,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                Alert.alert('Success', 'Review updated successfully!');
                if (onReviewAdded) await onReviewAdded();
            } else {
                Alert.alert('Error', 'Failed to update review.');
            }
        } catch (error) {
            console.error('API Error:', error);
            Alert.alert('Error', 'An error occurred while updating the review.');
        } finally {
            setLoading(false);
        }
    };
    const handleCancelEdit = (index) => {
        const updatedReviews = [...editableData.reviews];
        updatedReviews[index].isEditing = false;
        setEditableData({ ...editableData, reviews: updatedReviews });
    };

    const handleDeleteReview = async (index) => {
        // Ensure companyId and reviewId are available
        const companyId = companyData._id; // Assuming companyData is available in editableData
        const reviewId = editableData.reviews[index]._id; // Assuming reviewId is available


        // Show confirmation alert before proceeding with deletion
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this review?',
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
                                `https://ithub-backend.onrender.com/api/companies/delete-review`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                    data: {
                                        companyId, // Send companyId and reviewId in the request body
                                        reviewId,
                                    },
                                }
                            );

                            if (response.status === 200) {
                                if (onReviewAdded) {
                                    await onReviewAdded();
                                }

                                // Remove the deleted review from the state
                                const updatedReviews = editableData.reviews.filter((_, i) => i !== index);
                                setEditableData({ ...editableData, reviews: updatedReviews });

                                Alert.alert('Success', 'Review deleted successfully!');
                            } else {
                                Alert.alert('Error', 'Failed to delete review.');
                            }
                        } catch (error) {
                            console.error('API Error:', error);
                            Alert.alert('Error', 'An error occurred while deleting the review. Please try again.');
                        }
                    },
                },
            ],
            { cancelable: true } // Make the alert cancelable by tapping outside of it
        );
    };

    const renderReviewCard = (review, index) => {
        return !review.isEditing ? (
            <View key={index} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                    <Text style={styles.reviewAuthor}>{review.author}</Text>
                  
                       
                  
                    <View style={styles.ratingContainer}>
                        {[...Array(5)].map((_, i) => (
                            <Ionicons
                                key={i}
                                name="star"
                                size={16}
                                color={i < review.rating ? "#FFC107" : "#E0E0E0"}
                            />
                        ))}
                    </View>
                    
                </View>
                <Text style={styles.reviewComment}>{review.text}</Text>
                <Text style={styles.reviewDesignation}>{review.designation}</Text>
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        onPress={() => {
                            const updatedReviews = [...editableData.reviews];
                            updatedReviews[index] = { ...updatedReviews[index], isEditing: true };
                            setEditableData({ ...editableData, reviews: updatedReviews });
                        }}
                        style={styles.iconButton}
                    >
                        <Ionicons name="pencil" size={18} color="#007AFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => handleDeleteReview(index)}
                    >
                        <Ionicons name="trash" size={18} color="#FF3B30" />
                    </TouchableOpacity>
                </View>
            </View>
        ) : (
            <View key={index} style={styles.editReviewCard}>
                <TextInput
                    style={styles.input}
                    value={review.author}
                    onChangeText={(text) => handleEditReview(index, 'author', text)}
                    placeholder="Author Name"
                />
                <TextInput
                    style={styles.input}
                    value={review.designation}
                    onChangeText={(text) => handleEditReview(index, 'designation', text)}
                    placeholder="Designation"
                />
                <TextInput
                    style={styles.input}
                    value={review.text}
                    onChangeText={(text) => handleEditReview(index, 'text', text)}
                    placeholder="Review Details"
                    multiline
                />
                <View style={styles.ratingInputContainer}>
                    <Text style={styles.ratingLabel}>Rating: </Text>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                            key={star}
                            onPress={() => handleEditReview(index, 'rating', star)}
                        >
                            <Ionicons
                                name="star"
                                size={24}
                                color={star <= review.rating ? "#FFC107" : "#E0E0E0"}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity
                    onPress={() => handleSaveReviewChanges(index)}
                    style={styles.saveButton}
                    disabled={loading}
                >
                    <Text style={styles.saveButtonText}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleCancelEdit(index)} // Handle cancel edit
                    style={styles.secondaryButton} // Style for Cancel button
                >
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.sectionTitle}>Reviews</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setAddReviewModalVisible(true)}
                >
                    <Ionicons name="add" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {editableData.reviews.length === 0 ? (
                <Text style={styles.noReviewsText}>No reviews yet</Text>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.reviewsList}
                    showsVerticalScrollIndicator={false}
                >
                    {editableData.reviews.map(renderReviewCard)}
                </ScrollView>
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={isAddReviewModalVisible}
                onRequestClose={() => setAddReviewModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Review</Text>
                        <TextInput
                            style={styles.input}
                            value={newReview.author}
                            onChangeText={(text) => setNewReview({ ...newReview, author: text })}
                            placeholder="Your Name"
                        />
                        <TextInput
                            style={styles.input}
                            value={newReview.designation}
                            onChangeText={(text) => setNewReview({ ...newReview, designation: text })}
                            placeholder="Your Designation"
                        />
                        <TextInput
                            style={styles.input}
                            value={newReview.text}
                            onChangeText={(text) => setNewReview({ ...newReview, text: text })}
                            placeholder="Your Review"
                            multiline
                            numberOfLines={4}
                        />
                        <View style={styles.ratingInputContainer}>
                            <Text style={styles.ratingLabel}>Rating: </Text>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity
                                    key={star}
                                    onPress={() => setNewReview({ ...newReview, rating: star })}
                                >
                                    <Ionicons
                                        name="star"
                                        size={24}
                                        color={star <= newReview.rating ? "#FFC107" : "#E0E0E0"}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={() => setAddReviewModalVisible(false)}
                            >
                                <Text style={styles.modalCancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalSaveButton}
                                onPress={addNewReview}
                            >
                                <Text style={styles.modalSaveButtonText}>  {loading ? 'Saving...' : 'Save Review'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingTop: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
    },
    addButton: {
        backgroundColor: '#007AFF',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    noReviewsText: {
        textAlign: 'center',
        color: '#888',
        fontSize: 16,
        marginTop: 20,
    },
    reviewsList: {
        paddingHorizontal: 20,
    },
    reviewCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    reviewAuthor: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    ratingContainer: {
        flexDirection: 'row',
    },
    reviewDesignation:{
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
    },
    reviewComment: {
       
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    iconButton: {
        marginLeft: 15,
    },
    editReviewCard: {
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    ratingInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    ratingLabel: {
        fontSize: 16,
        marginRight: 10,
    },
    saveButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontWeight: '600',
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
    secondaryButton: {
        padding: 10,
        backgroundColor: '#ccc',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 12,
    },
};

export default ReviewsSection;