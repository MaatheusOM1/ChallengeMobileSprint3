import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Suggestion {
  id: string;
  name: string;
  description: string;
}

const SuggestionsScreen = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('suggestions');
      const storedSuggestions: Suggestion[] = jsonValue ? JSON.parse(jsonValue) : [];
      setSuggestions(storedSuggestions);
    } catch (error) {
      console.error('Failed to load suggestions', error);
    }
  };

  const saveSuggestions = async (newSuggestions: Suggestion[]) => {
    try {
      await AsyncStorage.setItem('suggestions', JSON.stringify(newSuggestions));
    } catch (error) {
      console.error('Failed to save suggestions', error);
    }
  };

  const addOrUpdateSuggestion = () => {
    if (!name || !description) {
      Alert.alert('Preencha todos os campos!');
      return;
    }

    const newSuggestions = editingId
      ? suggestions.map((item) => (item.id === editingId ? { id: editingId, name, description } : item))
      : [...suggestions, { id: Date.now().toString(), name, description }];

    setSuggestions(newSuggestions);
    saveSuggestions(newSuggestions);
    clearInputs();
  };

  const editSuggestion = (id: string) => {
    const suggestionToEdit = suggestions.find((item) => item.id === id);
    if (suggestionToEdit) {
      setName(suggestionToEdit.name);
      setDescription(suggestionToEdit.description);
      setEditingId(id);
    }
  };

  const deleteSuggestion = (id: string) => {
    const newSuggestions = suggestions.filter((item) => item.id !== id);
    setSuggestions(newSuggestions);
    saveSuggestions(newSuggestions);
  };

  const clearInputs = () => {
    setName('');
    setDescription('');
    setEditingId(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sugestões de Moda:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome da sugestão"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
      />
      <Button title={editingId ? 'Atualizar Sugestão' : 'Adicionar Sugestão'} onPress={addOrUpdateSuggestion} />
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Button title="Editar" onPress={() => editSuggestion(item.id)} />
            <Button title="Deletar" onPress={() => deleteSuggestion(item.id)} color="red" />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  item: {
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SuggestionsScreen;
