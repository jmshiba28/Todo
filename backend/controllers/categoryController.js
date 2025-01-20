const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ userId: req.user.id });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name, color } = req.body;
        const newCategory = new Category({
            name,
            color,
            userId: req.user.id
        });
        const category = await newCategory.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { name, color } = req.body;
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        if (category.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        category.name = name || category.name;
        category.color = color || category.color;
        
        await category.save();
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        if (category.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await category.remove();
        res.json({ message: 'Category removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}; 