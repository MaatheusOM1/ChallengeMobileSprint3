import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const WelcomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-Vindo!</Text>
      <Pressable 
        style={styles.button}
        onPress={() => navigation.navigate('Preferências de Estilo')}
      >
        <Text style={styles.buttonText}>Preferências de Estilo</Text>
      </Pressable>
      <Pressable 
        style={styles.button}
        onPress={() => navigation.navigate('Perfil')}
      >
        <Text style={styles.buttonText}>Perfil</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default WelcomeScreen;
