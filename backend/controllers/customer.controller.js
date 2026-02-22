const Customer = require('../models/customer.model');

// Create
exports.create = async (req, res) => {
    try {
        const customer = await Customer.create(req.body);
        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Find All
exports.findAll = async (req, res) => {
    try {
        const query = req.query.query;

        if (query) {
            const customers = await Customer.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { phoneNumber: query },
                    { email: { $regex: query, $options: 'i' } },
                    { "phones.imeiNumber": query }
                ]
            });

            return res.json(customers);
        }

        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Find One
exports.findOne = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update
exports.update = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete
exports.delete = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json({ message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
