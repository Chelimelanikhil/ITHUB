
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';


export const GalleryStep = ({ companyProfile, setCompanyProfile }) => {
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



    </View>

  );
};


const styles = StyleSheet.create({

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
  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginTop: 12,
  },
 
  addButton: {
    backgroundColor: '#3182CE',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  removeButton: {
    backgroundColor: '#FC8181',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

});