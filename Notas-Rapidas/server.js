const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const NOTES_FILE = path.join(__dirname, 'notes.json');

app.use(express.json());

app.get('/notas', (req, res) => {
    fs.readFile(NOTES_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Erro ao ler as notas.' });
        const notes = JSON.parse(data || '[]');
        res.json(notes);
    });
});

app.post('/notas', (req, res) => {
    const { texto } = req.body;
    if (!texto) {
        return res.status(400).json({ error: 'Texto da nota é obrigatório.' });
    }

    fs.readFile(NOTES_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Erro ao salvar a nota.' });

        const notes = JSON.parse(data || '[]');
        const novaNota = { id: Date.now(), texto };
        notes.push(novaNota);

        fs.writeFile(NOTES_FILE, JSON.stringify(notes, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Erro ao salvar a nota.' });
            res.status(201).json(novaNota);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});