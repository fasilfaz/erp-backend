const itemModel = require("../models/itemModel");

const getItemController = async (req, res) => {
  try {
    const items = await itemModel.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addItemController = async (req, res) => {
  try {
    const newItem = new itemModel(req.body);
    await newItem.save();
    res.status(201).json({ message: "Item Created Successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const editItemController = async (req, res) => {
  try {
    const { itemId } = req.body;
    const updatedItem = await itemModel.findOneAndUpdate({ _id: itemId }, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Item Updated", item: updatedItem });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteItemController = async (req, res) => {
  try {
    const { itemId } = req.body;
    await itemModel.findOneAndDelete({ _id: itemId });
    res.status(200).json({ message: "Item Deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getItemController,
  addItemController,
  editItemController,
  deleteItemController,
};