import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';


export const JobsStep = ({ companyProfile, setCompanyProfile }) => {
  const addJob = () => {
    setCompanyProfile((prev) => ({
      ...prev,
      jobs: [
        ...prev.jobs,
        {
          title: '',
          description: '',
          requirements: '',
          location: '',
          salary: '',
          type: '',
        },
      ],
    }));
  };

  const updateJob = (index, field, value) => {
    const newJobs = [...companyProfile.jobs];
    newJobs[index][field] = value;
    setCompanyProfile((prev) => ({
      ...prev,
      jobs: newJobs,
    }));
  };

  const removeJob = (index) => {
    const newJobs = companyProfile.jobs.filter((_, i) => i !== index);
    setCompanyProfile((prev) => ({
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
            <View style={styles.pickerContainer}>

              <Picker
                selectedValue={job.type}
                style={styles.picker}
                onValueChange={(itemValue) => updateJob(index, 'type', itemValue)}
              >
                <Picker.Item label="Select Job Type" value="" />
                <Picker.Item label="Full-Time" value="Full-Time" />
                <Picker.Item label="Part-Time" value="Part-Time" />
              </Picker>
            </View>
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
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  picker: {
    height: 55,
    width: '100%',
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