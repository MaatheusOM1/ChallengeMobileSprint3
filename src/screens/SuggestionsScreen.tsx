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

  const API_URL = 'http://localhost:3000/suggestions';

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch from server');
      const data = await response.json();
      setSuggestions(data);
      await AsyncStorage.setItem('suggestions', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to load suggestions from server, trying AsyncStorage', error);
      try {
        const jsonValue = await AsyncStorage.getItem('suggestions');
        const storedSuggestions: Suggestion[] = jsonValue ? JSON.parse(jsonValue) : [];
        setSuggestions(storedSuggestions);
      } catch (error) {
        console.error('Failed to load suggestions from AsyncStorage', error);
      }
    }
  };

  const saveSuggestions = async (newSuggestions: Suggestion[]) => {
    try {
      await AsyncStorage.setItem('suggestions', JSON.stringify(newSuggestions));
    } catch (error) {
      console.error('Failed to save suggestions to AsyncStorage', error);
    }
  };

  const addOrUpdateSuggestion = async () => {
    if (!name || !description) {
      Alert.alert('Preencha todos os campos!');
      return;
    }

    const suggestionData = { name, description };

    try {
      if (editingId) {
        // Atualiza a sugestão existente no servidor
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...suggestionData, id: editingId }),
        });
        const updatedSuggestion = await response.json();
        setSuggestions((prev) =>
          prev.map((item) => (item.id === updatedSuggestion.id ? updatedSuggestion : item))
        );
      } else {
        // Adiciona nova sugestão ao servidor
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...suggestionData, id: Date.now().toString() }),
        });
        const newSuggestion = await response.json();
        setSuggestions((prev) => [...prev, newSuggestion]);
      }
      await saveSuggestions([...suggestions, { ...suggestionData, id: editingId || Date.now().toString() }]);
      clearInputs();
    } catch (error) {
      console.error('Failed to save suggestion', error);
    }
  };

  const editSuggestion = (id: string) => {
    const suggestionToEdit = suggestions.find((item) => item.id === id);
    if (suggestionToEdit) {
      setName(suggestionToEdit.name);
      setDescription(suggestionToEdit.description);
      setEditingId(id);
    }
  };

  const deleteSuggestion = async (id: string) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      setSuggestions((prev) => prev.filter((item) => item.id !== id));
      await saveSuggestions(suggestions.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to delete suggestion', error);
    }
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
