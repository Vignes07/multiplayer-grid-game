import express from 'express';
import GridCellModel from "../models/GridState";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const grid = await GridCellModel.find();
        res.json(grid);
    } catch (err) {
        res.status(500).json({ message: "Failed to get grid" });
    }
})

router.post('/update', async (req, res) => {
    const { cellId, value, updateBy } = req.body;
    try {
        const gridCell = new GridCellModel({ cellId, value, updateBy });
        await gridCell.save();
        res.status(200).json({ message: "Grid updated" });
    } catch (err) {
        res.status(500).json({ message: "Failed to update grid" });
    }
})

export default router;