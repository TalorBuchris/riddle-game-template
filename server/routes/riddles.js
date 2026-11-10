import express from 'express';
import { readDb, writeDb } from '../db/dbHelpers.js';

const riddlesRouter = express.Router();

// GET
riddlesRouter.get('/', async (req, res) => {
    try {
        const data = await readDb();
        res.json(data.riddles);

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
});

// GET by ID
riddlesRouter.get('/:id', async (req, res) => {
    try {
        const data = await readDb();
        const riddle = data.riddles.find(r => {
            return r.id === Number(req.params.id);
        })
        if (!riddle)
            return res.status(404).json({ error: 'The riddle was not found.' })
        res.json(riddle)
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
})

// POST
riddlesRouter.post('/', async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "No data was sent" })
        }
        const data = await readDb();
        let maxId;
        if (data.riddles.length === 0) {
            maxId = 0;
        }
        else {
            const IDs = data.riddles.map(item => {
                return item.id;
            });
            maxId = Math.max(...IDs);
        }
        const newRiddle = { ...req.body }
        newRiddle.id = maxId + 1;
        data.riddles.push(newRiddle);
        await writeDb(data);
        res.status(201).json(newRiddle);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
})

// PUT
riddlesRouter.put('/:id', async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "No data was sent" })
        }
        const data = await readDb();
        const id = Number(req.params.id);

        const index = data.riddles.findIndex(r => r.id === id);

        if (index === -1) {
            return res.status(404).json({ error: "Riddle not found" });
        }

        const updatedRiddle = { ...req.body, id };

        data.riddles.splice(index, 1, updatedRiddle);

        await writeDb(data);
        res.json(updatedRiddle);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
})

// DELETE
riddlesRouter.delete('/:id', async (req, res) => {
    try {
        const data = await readDb();
        const id = Number(req.params.id);
        const index = data.riddles.findIndex(r => r.id === id);

        if (index === -1) {
            return res.status(404).json({ error: "Riddle not found" });
        }
        data.riddles.splice(index, 1);

        await writeDb(data);
        res.json({ message: "Riddle deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
})
export default riddlesRouter;