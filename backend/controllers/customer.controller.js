const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/db.json');

// Helper to read data
const readData = () => {
    try {
        if (!fs.existsSync(dataPath)) {
            // Create data directory if it doesn't exist
            const dataDir = path.dirname(dataPath);
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
            fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
            return [];
        }
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading data:', err);
        return [];
    }
};

// Helper to write data
const writeData = (data) => {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error('Error writing data:', err);
        return false;
    }
};

// Create and Save a new Customer
exports.create = (req, res) => {
    const customers = readData();
    const newCustomer = req.body;

    // Ensure ID if not provided (though frontend generates one, good to have backend check)
    if (!newCustomer.id) {
        newCustomer.id = Date.now().toString();
    }

    customers.push(newCustomer);

    if (writeData(customers)) {
        res.send(newCustomer);
    } else {
        res.status(500).send({
            message: "Some error occurred while creating the Customer."
        });
    }
};

// Retrieve all Customers
exports.findAll = (req, res) => {
    const customers = readData();
    const query = req.query.query;

    if (query) {
        const lowerQuery = query.toLowerCase();
        const filteredCustomers = customers.filter(customer =>
            customer.name.toLowerCase().includes(lowerQuery) ||
            customer.phoneNumber.includes(query) ||
            (customer.email && customer.email.toLowerCase().includes(lowerQuery)) ||
            customer.phones.some(phone => phone.imeiNumber.includes(query))
        );
        res.send(filteredCustomers);
    } else {
        res.send(customers);
    }
};

// Find a single Customer with an id
exports.findOne = (req, res) => {
    const customers = readData();
    const id = req.params.id;
    const customer = customers.find(c => c.id === id);

    if (customer) {
        res.send(customer);
    } else {
        res.status(404).send({
            message: "Customer not found with id " + id
        });
    }
};

// Update a Customer by the id in the request
exports.update = (req, res) => {
    const customers = readData();
    const id = req.params.id;
    const index = customers.findIndex(c => c.id === id);

    if (index !== -1) {
        const updatedCustomer = { ...customers[index], ...req.body };
        customers[index] = updatedCustomer;

        if (writeData(customers)) {
            res.send(updatedCustomer);
        } else {
            res.status(500).send({
                message: "Error updating Customer with id " + id
            });
        }
    } else {
        res.status(404).send({
            message: "Customer not found with id " + id
        });
    }
};

// Delete a Customer with the specified id in the request
exports.delete = (req, res) => {
    let customers = readData();
    const id = req.params.id;
    const initialLength = customers.length;

    customers = customers.filter(c => c.id !== id);

    if (customers.length < initialLength) {
        if (writeData(customers)) {
            res.send({ message: "Customer was deleted successfully!" });
        } else {
            res.status(500).send({
                message: "Could not delete Customer with id " + id
            });
        }
    } else {
        res.status(404).send({
            message: "Customer not found with id " + id
        });
    }
};
