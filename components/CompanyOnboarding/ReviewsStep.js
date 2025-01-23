import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
 
} from 'react-native';

export const ReviewsStep = ({ companyProfile, setCompanyProfile }) => {
  const addReview = () => {
    setCompanyProfile(prev => ({
      ...prev,
      reviews: [...prev.reviews, { author: '', designation: '', text: '', rating: '' }],
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
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    fontSize: 16,
    color: '#2D3748',
    minHeight: 140,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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