const mongoose = require('mongoose');
const Address = require('../../models/Address');

describe('Address Model', () => {
  it('should create a valid address', () => {
    const validAddress = new Address({
      user: new mongoose.Types.ObjectId(),
      phone: '1234567890',
      address: 'Test Address',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456',
      isDefault: true
    });

    const validationError = validAddress.validateSync();
    expect(validationError).toBeUndefined();
  });

  it('should require phone number', () => {
    const addressWithoutPhone = new Address({
      user: new mongoose.Types.ObjectId(),
      address: 'Test Address',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456'
    });

    const validationError = addressWithoutPhone.validateSync();
    expect(validationError.errors.phone).toBeDefined();
  });
}); 