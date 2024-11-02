import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';

const StylePreferencesScreen = ({ navigation }: any) => {
  const [stylePreference, setStylePreference] = useState('');

  const handleSave = () => {
    console.log('Preferencias salvas', stylePreference);
    navigation.navigate('Sugestões');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Digite Sua Preferência de Estilo:</Text>
      <TextInput
        style={styles.input}
        value={stylePreference}
        onChangeText={setStylePreference}
      />
      <Button title="Salvar e Ver Recomendações" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
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

export default StylePreferencesScreen;
