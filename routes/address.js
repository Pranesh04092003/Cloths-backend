const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const addressController = require('../controllers/addressController');

// Get all addresses
router.get('/', auth, addressController.getAllAddresses);

// Create new address
router.post('/', auth, addressController.createAddress);

// Update address
router.put('/:id', auth, addressController.updateAddress);

// Set address as default
router.patch('/:id/set-default', auth, addressController.setDefaultAddress);

// Get default address
router.get('/default', auth, addressController.getDefaultAddress);

// Delete address
router.delete('/:id', auth, addressController.deleteAddress);

module.exports = router; 