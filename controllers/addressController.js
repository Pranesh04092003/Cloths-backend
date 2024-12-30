const Address = require('../models/Address');

// Get all addresses
exports.getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id });
    res.json({
      success: true,
      addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching addresses',
      error: error.message
    });
  }
};

// Create new address
exports.createAddress = async (req, res) => {
  try {
    const { phone, address, city, state, pincode, isDefault } = req.body;
    
    // If this address is set as default, remove default from other addresses
    if (isDefault) {
      await Address.updateMany(
        { user: req.user.id },
        { $set: { isDefault: false } }
      );
    }
    
    // If this is the first address, make it default
    const addressCount = await Address.countDocuments({ user: req.user.id });
    const shouldBeDefault = isDefault || addressCount === 0;

    const newAddress = new Address({
      user: req.user.id,
      phone,
      address,
      city,
      state,
      pincode,
      isDefault: shouldBeDefault
    });

    await newAddress.save();
    
    res.status(201).json({
      success: true,
      address: newAddress
    });
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating address',
      error: error.message
    });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const { phone, address, city, state, pincode, isDefault } = req.body;
    
    if (isDefault) {
      await Address.updateMany(
        { user: req.user.id, _id: { $ne: req.params.id } },
        { $set: { isDefault: false } }
      );
    }

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { phone, address, city, state, pincode, isDefault },
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: 'Address not found or unauthorized'
      });
    }

    res.json({
      success: true,
      address: updatedAddress
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating address',
      error: error.message
    });
  }
};

// Set default address
exports.setDefaultAddress = async (req, res) => {
  try {
    await Address.updateMany(
      { user: req.user.id },
      { $set: { isDefault: false } }
    );

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isDefault: true },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: 'Address not found or unauthorized'
      });
    }

    res.json({
      success: true,
      address: updatedAddress
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error setting default address',
      error: error.message
    });
  }
};

// Get default address
exports.getDefaultAddress = async (req, res) => {
  try {
    const defaultAddress = await Address.findOne({ 
      user: req.user.id,
      isDefault: true 
    });

    if (!defaultAddress) {
      return res.status(404).json({
        success: false,
        message: 'No default address found'
      });
    }

    res.json({
      success: true,
      address: defaultAddress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching default address',
      error: error.message
    });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const deletedAddress = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: 'Address not found or unauthorized'
      });
    }

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting address',
      error: error.message
    });
  }
}; 