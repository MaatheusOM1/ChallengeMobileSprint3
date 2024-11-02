const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let suggestions = [
  { id: '1', name: 'Vestido Floral', description: 'Um vestido leve e florido.' },
  { id: '2', name: 'Camisa Jeans', description: 'Uma camisa clássica de jeans.' },
];

app.get('/suggestions', (req, res) => {
  res.json(suggestions);
});

app.post('/suggestions', (req, res) => {
  const { name, description } = req.body;
  const newSuggestion = { id: Date.now().toString(), name, description };
  suggestions.push(newSuggestion);
  res.status(201).json(newSuggestion);
});

app.put('/suggestions/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const index = suggestions.findIndex((s) => s.id === id);

  if (index !== -1) {
    suggestions[index] = { id, name, description };
    res.json(suggestions[index]);
  } else {
    res.status(404).json({ message: 'Sugestão não encontrada' });
  }
});

app.delete('/suggestions/:id', (req, res) => {
  const { id } = req.params;
  suggestions = suggestions.filter((s) => s.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
