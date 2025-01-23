import {
  View,
  Text,
  TextInput,
  StyleSheet
} from 'react-native';
export const AboutStep = ({ companyProfile, setCompanyProfile }) => {
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
});