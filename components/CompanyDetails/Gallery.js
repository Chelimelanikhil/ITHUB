import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Modal, TouchableOpacity, Dimensions } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

const HEADER_MAX_HEIGHT = 250;

const Gallery = ({ gallery }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Handle image click to open modal
  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Prepare images for zoom viewer
  const imageUrls = gallery ? gallery.map(image => ({ url: image.url })) : [];

  // Render the gallery
  return (
    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.tabContentContainer}
      scrollEventThrottle={16}
    >
      <View style={styles.galleryGrid}>
        {gallery && gallery.length > 0 ? (
          gallery.map((image, index) => (
            <TouchableOpacity key={index} onPress={() => handleImageClick(index)}>
              <Image
                source={{ uri: image.url }}
                style={styles.galleryImage}
                onError={() => console.error(`Failed to load image: ${image.url}`)}
              />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.container}>
            <Text style={styles.noImagesText}>No images available</Text>
          </View>
        )}
      </View>

      {/* Modal for Full Image View with Zoom */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <ImageViewer
          imageUrls={imageUrls}
          index={selectedImageIndex}
          enableSwipeDown={true}
          onCancel={handleCloseModal}
          renderHeader={() => (
            <TouchableOpacity 
              style={styles.modalCloseButton} 
              onPress={handleCloseModal}
            >
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
          )}
          backgroundColor="rgba(0,0,0,0.8)"
        />
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabContentContainer: {
    paddingTop: HEADER_MAX_HEIGHT + 48,
    minHeight: Dimensions.get('window').height + HEADER_MAX_HEIGHT,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 15,
    padding: 10
  },
  galleryImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  closeText: {
    fontSize: 24,
    color: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImagesText: {
    fontSize: 16,
    color: 'grey',
  },
});

export default Gallery;