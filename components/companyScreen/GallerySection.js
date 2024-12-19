import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageViewer from 'react-native-image-zoom-viewer';

export default GallerySection = ({
  companyData,
  editableData,
  setEditableData,
  onImageAdded,
  maxImages = 10
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isNewImagesAdded, setIsNewImagesAdded] = useState(false);
  const [selectedImageIds, setSelectedImageIds] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isAddImageModalVisible, setIsAddImageModalVisible] = useState(false);
  const [modalSelectedImages, setModalSelectedImages] = useState([]);

  const handleModalImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Needed', 'Camera roll access is required.');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
        selectionLimit: maxImages - editableData.gallery.length,
      });

      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        const newImages = pickerResult.assets.map(asset => ({
          url: asset.uri,
          isNew: true
        }));

        setModalSelectedImages(newImages);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Image selection failed.');
    }
  };

  const handleMultipleImageDelete = async () => {
    if (selectedImageIds.length === 0) return;

    Alert.alert(
      "Delete Multiple Images",
      `Are you sure you want to delete ${selectedImageIds.length} image(s)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const companyId = companyData._id;

              const body = JSON.stringify({
                imageIds: selectedImageIds,
              });


              const response = await fetch(
                `https://ithub-backend.onrender.com/api/companies/delete-images/${companyId}`,
                {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                  },
                  body: body,
                }
              );

              const responseText = await response.text();


              const result = JSON.parse(responseText); // Convert to JSON only if valid

              if (response.ok) {
                const updatedGallery = editableData.gallery.filter(
                  img => !selectedImageIds.includes(img._id)
                );

                // setEditableData({ ...editableData, gallery: updatedGallery });
                // setSelectedImageIds([]);
                setSelectMode(false);

                if (onImageAdded) {
                  await onImageAdded();
                  Alert.alert('Success', 'Selected images deleted successfully!');
                }
              } else {
                Alert.alert('Error', result.message || 'Something went wrong while deleting images.');
              }
            } catch (error) {
              console.error('Error deleting multiple images:', error);
              Alert.alert('Error', 'There was an error deleting the images.');
            }
          },
        },
      ]
    );
  };




  // const handleSaveImages = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('token');
  //     const url = `https://ithub-backend.onrender.com/api/companies/add-images/${companyData._id}`;

  //     const newImages = editableData.newImages || [];

  //     if (newImages.length === 0) {
  //       Alert.alert('No Images', 'No new images to save.');
  //       return;
  //     }

  //     const response = await fetch(url, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         imageUrls: newImages.map(image => image.url),
  //       }),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.text();
  //       console.error('Server Error:', errorData);
  //       Alert.alert('Error', 'Image upload failed.');
  //       return;
  //     }
  //     if (onImageAdded) {
  //       await onImageAdded();
  //       Alert.alert('Success', 'Images saved successfully!');
  //     }

  //     setIsNewImagesAdded(false);
  //     setEditableData(prevState => ({
  //       ...prevState,
  //       newImages: [],
  //     }));
  //   } catch (error) {
  //     console.error('Error saving images:', error);
  //     Alert.alert('Error', 'Image save failed.');
  //   }
  // };



  const handleDeleteImage = async (index) => {
    Alert.alert(
      "Delete Image",
      "Are you sure you want to delete this image?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            const imageId = editableData.gallery[index]._id;

            const updatedGallery = editableData.gallery.filter((_, i) => i !== index);
            setEditableData({ ...editableData, gallery: updatedGallery });

            try {
              const companyId = companyData._id;
              const token = await AsyncStorage.getItem('token');

              const response = await fetch(`https://ithub-backend.onrender.com/api/companies/delete-image/${companyId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                  imageId: imageId,
                }),
              });

              const result = await response.json();

              if (response.ok) {
                if (onImageAdded) {
                  await onImageAdded();
                  Alert.alert('Success', 'Image deleted successfully!');
                }
              } else {
                Alert.alert('Error', result.message || 'Something went wrong while deleting the image.');
              }
            } catch (error) {
              console.error('Error deleting image:', error);
              Alert.alert('Error', 'There was an error deleting the image.');
            }
          },
        },
      ]
    );
  };

  const handleSaveModalImages = async () => {
    if (modalSelectedImages.length === 0) {
      Alert.alert('No Images', 'Please select at least one image');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const url = `https://ithub-backend.onrender.com/api/companies/add-images/${companyData._id}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageUrls: modalSelectedImages.map(image => image.url),
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server Error:', errorData);
        Alert.alert('Error', 'Image upload failed.');
        return;
      }

      // Update local state with new images
      const updatedGallery = [
        ...editableData.gallery,
        ...modalSelectedImages
      ];

      setEditableData({
        ...editableData,
        gallery: updatedGallery,
        newImages: modalSelectedImages
      });

      if (onImageAdded) {
        await onImageAdded();
        Alert.alert('Success', 'Images saved successfully!');
      }

      setIsAddImageModalVisible(false);
      setModalSelectedImages([]);
    } catch (error) {
      console.error('Error saving images:', error);
      Alert.alert('Error', 'Image save failed.');
    }
  };

  const removeModalImage = (indexToRemove) => {
    setModalSelectedImages(modalSelectedImages.filter((_, index) => index !== indexToRemove));
  };

  const toggleSelectAll = () => {
    // Toggle select all
    const newIsSelectAll = !isSelectAll;
    setIsSelectAll(newIsSelectAll);

    if (newIsSelectAll) {
      // Select all image IDs
      const allImageIds = editableData.gallery.map(img => img._id);
      setSelectedImageIds(allImageIds);
    } else {
      // Deselect all
      setSelectedImageIds([]);
    }
  };
  const toggleImageSelection = (imageId) => {
    const newSelectedIds = imageId
      ? (selectedImageIds.includes(imageId)
        ? selectedImageIds.filter(id => id !== imageId)
        : [...selectedImageIds, imageId])
      : [];

    setSelectedImageIds(newSelectedIds);

    // Exit select mode if no images are selected
    if (newSelectedIds.length === 0) {
      setSelectMode(false);
    }
  };

  const handleImageView = (image, index) => {
    setSelectedImage(image);
    setSelectedImageIndex(index);
  };


  const renderModalImagePickerItem = ({ item, index }) => (
    <View style={styles.modalImagePickerWrapper}>
      <Image
        source={{ uri: item.url }}
        style={styles.modalPickerImage}
      />
      <TouchableOpacity
        style={styles.removeModalImageButton}
        onPress={() => removeModalImage(index)}
      >
        <Ionicons name="close" size={20} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );


  const renderImageItem = ({ item, index }) => {
    const isSelected = selectedImageIds.includes(item._id);
    return (
      <TouchableOpacity
        style={styles.imageWrapper}
        onLongPress={() => {
          setSelectMode(true);
          toggleImageSelection(item._id);
        }}
        onPress={() => {
          if (selectMode) {
            toggleImageSelection(item._id);
          } else {
            handleImageView(item, index);
          }
        }}
      >
        <Image
          source={{ uri: item.url }}
          style={[
            styles.gridImage,
            selectMode && isSelected && styles.selectedImage
          ]}
        />
        {selectMode && (
          <View style={styles.selectionOverlay}>
            {isSelected && <Ionicons name="checkmark-circle" size={24} color="#007bff" />}
          </View>
        )}
      </TouchableOpacity>
    );
  };


  const renderHeaderSelectMode = () => (
    <View style={styles.selectModeHeader}>
      <View style={styles.selectAllContainer}>
        <TouchableOpacity
          onPress={toggleSelectAll}
          style={styles.selectAllTouchable}
        >
          <Ionicons
            name={isSelectAll ? "checkbox" : "square-outline"}
            size={24}
            color="#007bff"
          />
          <Text style={styles.selectAllText}>Select All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.selectModeButtons}>
        <TouchableOpacity
          onPress={() => {
            setSelectMode(false);
            setSelectedImageIds([]);
            setIsSelectAll(false);
          }}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleMultipleImageDelete}
          style={[
            styles.deleteSelectedButton,
            selectedImageIds.length === 0 && styles.deleteSelectedButtonDisabled
          ]}
          disabled={selectedImageIds.length === 0}
        >
          <Ionicons name="trash" size={18} color="#ffffff" />
          <Text style={styles.deleteSelectedButtonText}>
            Delete ({selectedImageIds.length})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );


  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {selectMode ? (
          renderHeaderSelectMode()
        ) : (
          <>
            <Text style={styles.headerTitle}>Company Gallery</Text>
            <View style={styles.headerButtonContainer}>
              <TouchableOpacity
                onPress={() => setIsAddImageModalVisible(true)}
                style={styles.addButton}
                disabled={editableData.gallery.length >= maxImages}
              >
                <Ionicons
                  name="add-circle"
                  size={24}
                  color={editableData.gallery.length >= maxImages ? '#cccccc' : '#007bff'}
                />
                <Text style={[
                  styles.addButtonText,
                  editableData.gallery.length >= maxImages && styles.disabledText
                ]}>
                  Add Photos
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>


      {editableData.gallery.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="image-outline" size={64} color="#e0e0e0" />
          <Text style={styles.emptyStateText}>No images uploaded yet</Text>
          <Text style={styles.emptyStateSubtext}>Tap "Add Photos" to get started</Text>
        </View>
      ) : (
        <FlatList
          data={editableData.gallery}
          renderItem={renderImageItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContainer}
        />
      )}

      {selectedImage && (
        <Modal
          visible={!!selectedImage}
          transparent={true}
          onRequestClose={() => setSelectedImage(null)}
          animationType="fade"
        >
          <ImageViewer
            imageUrls={editableData.gallery.map((img) => ({ url: img.url }))}
            index={selectedImageIndex} // Pass the initial index
            onChange={(newIndex) => setSelectedImageIndex(newIndex)} // Update index on swipe
            onCancel={() => setSelectedImage(null)}
            enableSwipeDown
            renderHeader={(currentIndex) => (
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setSelectedImage(null)}
              >
                <Ionicons name="close" size={30} color="#ffffff" />
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.deleteImageIconBottom}
            onPress={() => handleDeleteImage(selectedImageIndex)} // Use updated index
          >
            <Ionicons name="trash" size={16} color="#dc3545" />
          </TouchableOpacity>
        </Modal>
      )}

      <Modal
        visible={isAddImageModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddImageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Add Images</Text>
              <TouchableOpacity onPress={() => setIsAddImageModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.selectImagesButton}
              onPress={handleModalImagePick}
            >
              <Ionicons name="image" size={24} color="#007bff" />
              <Text style={styles.selectImagesButtonText}>Select Images</Text>
            </TouchableOpacity>

            {modalSelectedImages.length > 0 && (
              <FlatList
                data={modalSelectedImages}
                renderItem={renderModalImagePickerItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                style={styles.modalImageList}
              />
            )}

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setIsAddImageModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleSaveModalImages}
                disabled={modalSelectedImages.length === 0}
              >
                <Text style={styles.modalSaveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addButtonText: {
    marginLeft: 5,
    color: '#007bff',
    fontWeight: '600',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#f1f3f5',
    borderRadius: 10,
    marginVertical: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6c757d',
    marginTop: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#868e96',
    marginTop: 5,
  },
  gridContainer: {
    paddingBottom: 20,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  gridImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 5,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 3,
  },
  saveButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  saveButtonText: {
    marginLeft: 5,
    color: '#ffffff',
    fontWeight: '600',
  },
  fullScreenModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  closeModalButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1000
  },
  modalImageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },
  fullScreenImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  selectedImage: {
    opacity: 0.5,
  },
  selectionOverlay: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 2,
  },
  headerButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectModeButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f5',
    borderRadius: 25,
    padding: 4,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 5,
  },
  cancelButtonText: {
    color: '#495057',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteSelectedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc3545',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  deleteSelectedButtonDisabled: {
    backgroundColor: '#6c757d',
    opacity: 0.5,
  },
  deleteSelectedButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 5,
    fontSize: 14,
  },
  selectModeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAllTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAllText: {
    marginLeft: 5,
    color: '#007bff',
    fontWeight: '600',
  },
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
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectImagesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  selectImagesButtonText: {
    marginLeft: 10,
    color: '#007bff',
    fontWeight: '600',
  },
  modalImageList: {
    maxHeight: 150,
    marginBottom: 20,
  },
  modalImagePickerWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  modalPickerImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeModalImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 2,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  modalCancelButtonText: {
    color: '#6c757d',
  },
  modalSaveButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
  },
  modalSaveButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  deleteImageIconBottom: {
    position: 'absolute',
    bottom: 5,
    right: '50%',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
    padding: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    transform: [{ translateX: 15 }],
  },


});

