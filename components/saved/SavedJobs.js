import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Modal,
    Platform,
    Dimensions,
    Alert,
    SafeAreaView
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import axios from "axios";

export default function SavedCompanies({ onClose }) {
    const [savedCompanies, setSavedCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const router = useRouter();

    useEffect(() => {
        fetchSavedCompanies();
    }, []);

    const fetchSavedCompanies = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('https://ithub-backend.onrender.com/api/companies/savedcompanies', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setSavedCompanies(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching saved companies:', error);
            setLoading(false);
        }
    };
    const handleUnsaveCompany = (companyId, companyName) => {
        setSelectedCompany({ companyId, companyName });
        setShowConfirmModal(true);
    };

    const confirmUnsave = async () => {
        setShowConfirmModal(false);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.delete(
                `https://ithub-backend.onrender.com/api/companies/saved-companies/${selectedCompany.companyId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {
                fetchSavedCompanies();
                setShowSuccessModal(true); // Show success modal
            } else {
                Alert.alert('Error', response.data.message || 'Unable to remove the company.');
            }
        } catch (error) {
            console.error('Error unsaving company:', error);
            Alert.alert('Error', 'Unable to unsave the company. Please try again.');
        }
    };

    const handleCompanyPress = (companyId) => {
        router.push({
            pathname: "/CompanyDetails/CompanyDetailScreen",
            params: { companyId },
        });
    };

    const renderCompanyItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.companyCard} 
            onPress={() => handleCompanyPress(item.companyId)}
        >
            <View style={styles.cardHeader}>
                <Image 
                    source={{ uri: item.companyLogo }} 
                    style={styles.companyLogo} 
                />
                <View style={styles.companyHeaderContent}>
                    <Text style={styles.companyName} numberOfLines={1}>
                        {item.companyName}
                    </Text>
                    <Text style={styles.companyIndustry} numberOfLines={1}>
                        {item.industry}
                    </Text>
                </View>
                <TouchableOpacity 
                    onPress={() => handleUnsaveCompany(item.companyId, item.companyName)}
                    style={styles.unsaveButton}
                >
                    <MaterialCommunityIcons 
                        name="bookmark-remove" 
                        size={24} 
                        color="#5A6674" 
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.companyDetails}>
                <View style={styles.detailItem}>
                    <MaterialCommunityIcons 
                        name="map-marker" 
                        size={16} 
                        color="#007BFF" 
                    />
                    <Text style={styles.detailText}>{item.companyLocation}</Text>
                </View>
                <View style={styles.detailItem}>
                    <MaterialCommunityIcons 
                        name="account-group" 
                        size={16} 
                        color="#28A745" 
                    />
                    <Text style={styles.detailText}>{item.companyEmployees}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={styles.loadingText}>Loading Saved Companies</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={onClose} style={styles.backButton}>
                    <MaterialCommunityIcons 
                        name="arrow-left" 
                        size={24} 
                        color="#2C3E50" 
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Saved Companies</Text>
                <View style={styles.counterBadge}>
                    <Text style={styles.counterText}>{savedCompanies.length}</Text>
                </View>
            </View>

            <FlatList
                data={savedCompanies}
                renderItem={renderCompanyItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyStateContainer}>
                        <MaterialCommunityIcons 
                            name="bookmark-outline" 
                            size={80} 
                            color="#A0A0A0" 
                        />
                        <Text style={styles.emptyStateTitle}>No Saved Companies</Text>
                        <Text style={styles.emptyStateSubtitle}>
                            Companies you save will appear here
                        </Text>
                    </View>
                }
            />
           <Modal
                visible={showConfirmModal}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setShowConfirmModal(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Remove Saved Company</Text>
                        <Text style={styles.modalMessage}>
                            Are you sure you want to remove{' '}
                            <Text style={styles.modalHighlight}>{selectedCompany?.companyName}</Text>{' '}
                            from your saved companies?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setShowConfirmModal(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={confirmUnsave}
                            >
                                <Text style={[styles.buttonText, styles.confirmText]}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Success Modal */}
            <Modal
    visible={showSuccessModal}
    animationType="fade"
    transparent={true}
    onRequestClose={() => setShowSuccessModal(false)}
>
    <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
            <MaterialCommunityIcons
                name="check-circle"
                size={64}
                color="#27AE60"
            />
            <Text style={styles.modalTitle}>Company Removed</Text>
            <Text style={styles.modalMessage}>
                <Text style={styles.modalHighlight}>{selectedCompany?.companyName}</Text> has been successfully removed from your saved companies.
            </Text>
            <TouchableOpacity
                style={styles.successButton}
                onPress={() => setShowSuccessModal(false)}
            >
                <Text style={[styles.buttonText, styles.successText]}>Okay</Text>
            </TouchableOpacity>
        </View>
    </View>
</Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F6F9',
    }, 
     modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        alignItems: 'center', // Center all items horizontally
        justifyContent: 'center', // Center all items vertically
    },
    
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        color: '#34495E',
        textAlign: 'center',
        marginVertical: 15,
    },
    modalHighlight: {
        fontWeight: '700',
        color: '#E74C3C',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#BDC3C7',
    },
    confirmButton: {
        backgroundColor: '#E74C3C',
    },
    successButton: {
        backgroundColor: '#27AE60',
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        alignItems: 'center',
    },
    
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    confirmText: {
        fontWeight: '700',
    },
    successText: {
        fontWeight: '700',
        color: 'white',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: 'white',
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0,0,0,0.1)',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    backButton: {
        padding: 10,
        marginLeft: -10,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3E50',
    },
    counterBadge: {
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        minWidth: 40,
        alignItems: 'center',
    },
    counterText: {
        color: '#007BFF',
        fontSize: 14,
        fontWeight: '700',
    },
    listContent: {
        padding: 15,
    },
    companyCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 15,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0,0,0,0.1)',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
            },
            android: {
                elevation: 3,
            },
        }),
        padding: 15,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    companyLogo: {
        width: 55,
        height: 55,
        borderRadius: 10,
        marginRight: 15,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    companyHeaderContent: {
        flex: 1,
    },
    companyName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
    },
    companyIndustry: {
        fontSize: 14,
        color: '#6C757D',
        marginTop: 4,
    },
    unsaveButton: {
        padding: 10,
    },
    companyDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#E9ECEF',
        paddingTop: 10,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        marginLeft: 6,
        fontSize: 14,
        color: '#495057',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F4F6F9',
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: '#2C3E50',
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2C3E50',
        marginTop: 20,
        textAlign: 'center',
    },
    emptyStateSubtitle: {
        fontSize: 16,
        color: '#6C757D',
        marginTop: 10,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
});