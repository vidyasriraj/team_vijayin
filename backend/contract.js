const express = require('express');
const path = require('path');
const app = express();
const data = require('../frontend/contracts/farmer.json');
const data2=require("../frontend/sachivalayam/sachivalayams.json")
const data3=require("../frontend/notifications.json")
const farmers = data.farmers;
const sachivalayams=data2.sachivalayams;
const notifies=data3.notifications;


app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'backend')));
const cors = require('cors');
app.use(cors());

// Endpoint to get all contracts (return unique contract IDs)

//Displays available contract IDS
app.get('/contracts', (req, res) => {
    const uniqueContractIds = new Set(farmers.map(farmer => farmer.contract_ID));
    const contracts = Array.from(uniqueContractIds).map(id => ({ contract_ID: id }));
    res.json(contracts);
});

// Endpoint to get farmers for a specific contract
app.get('/contracts/:id', (req, res) => {
    const contractId = req.params.id;
    if (!contractId) return res.status(400).send('Contract ID is required');
    const items = farmers.filter(i => i.contract_ID === contractId);
    if (items.length === 0) return res.status(404).send('Items not found');
    res.json(items);
});
app.get('/search/:name', (req, res) => {
    const term = req.params.name;
    if (!term) {
        return res.status(400).json({ message: 'Search term is required' });
    }
    const searchTerm = term.toLowerCase();
    if (!data || !Array.isArray(sachivalayams)) {
        return res.status(500).json({ message: 'Sachivalayam data is not available' });
    }
    const filteredSachivalayams = sachivalayams.filter(sachivalayam => 
        sachivalayam.District.toLowerCase().includes(searchTerm) ||
        sachivalayam.Crop.toLowerCase().includes(searchTerm)
    );
    res.json(filteredSachivalayams);
});


app.get('/notifications',(req,res)=>{
    res.json(notifies);
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
