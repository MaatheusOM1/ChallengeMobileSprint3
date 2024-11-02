import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useProfile } from '../context/ProfileContext';

const ProfileSettingsScreen = ({ navigation }: any) => {
  const { name, email, setName, setEmail } = useProfile();
  const [newName, setNewName] = useState(name);
  const [newEmail, setNewEmail] = useState(email);

  const handleSave = () => {
    setName(newName);
    setEmail(newEmail);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={newName}
        onChangeText={setNewName}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={newEmail}
        onChangeText={setNewEmail}
        keyboardType="email-address"
      />
      <Button title="Salvar" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
  },
});

export default ProfileSettingsScreen;
