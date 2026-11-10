import express from 'express';
import { readDb, writeDb } from '../db/dbHelpers';

const playersRouter = express.Router();

// GET
playersRouter.get('/', async (req, res) => {
    try {
        const data = await readDb();
        if (req.query.name) {
            const filterData = data.players.filter(item => {
                return item.name === req.query.name
            })
            res.json(filterData);
        }
        else {
            res.json(data.players);
        }

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
});

// POST
playersRouter.post('/', async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "No data was sent" })
        }
        const data = await readDb();
        let maxId;
        if (data.players.length === 0) {
            maxId = 0;
        }
        else {
            const IDs = data.players.map(item => {
                return item.id;
            });
            maxId = Math.max(...IDs) + 1;
        }
        const newPlayer = { id: maxId, name: req.body.name, lowestTime: null };
        data.players.push(newPlayer);
        await writeDb(data);
        res.status(201).json(newPlayer);

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
});

// PUT
playersRouter.put('/:id',  async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "No data was sent" })
        }
        const data = await readDb();
        const id = Number(req.params.id);

        const index = data.players.findIndex(r => r.id === id);

        if (index === -1) {
            return res.status(404).json({ error: "player not found" });
        }

        data.players[index].lowestTime = req.body.lowestTime;

        await writeDb(data);
        res.json(data.players[index]);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
})

export default playersRouter;