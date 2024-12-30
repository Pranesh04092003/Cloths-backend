const {
  getAllAddresses,
  createAddress,
  updateAddress,
  setDefaultAddress,
  getDefaultAddress,
  deleteAddress
} = require('../controllers/addressController');
const Address = require('../models/Address');

jest.mock('../models/Address');

describe('Address Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      user: { id: 'testUserId' },
      body: {
        phone: '1234567890',
        address: 'Test Address',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456',
        isDefault: false
      },
      params: { id: 'testAddressId' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('setDefaultAddress', () => {
    it('should set an address as default', async () => {
      Address.updateMany.mockResolvedValue({});
      Address.findOneAndUpdate.mockResolvedValue({
        _id: 'testAddressId',
        isDefault: true
      });

      await setDefaultAddress(req, res);

      expect(Address.updateMany).toHaveBeenCalled();
      expect(Address.findOneAndUpdate).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        address: expect.any(Object)
      });
    });

    it('should handle address not found', async () => {
      Address.updateMany.mockResolvedValue({});
      Address.findOneAndUpdate.mockResolvedValue(null);

      await setDefaultAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getDefaultAddress', () => {
    it('should get default address', async () => {
      const mockAddress = {
        _id: 'testAddressId',
        isDefault: true
      };
      Address.findOne.mockResolvedValue(mockAddress);

      await getDefaultAddress(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        address: mockAddress
      });
    });

    it('should handle no default address', async () => {
      Address.findOne.mockResolvedValue(null);

      await getDefaultAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('updateAddress', () => {
    it('should handle validation errors', async () => {
      Address.findOneAndUpdate.mockRejectedValue(new Error('Validation error'));

      await updateAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle default address update', async () => {
      req.body.isDefault = true;
      const mockAddress = {
        _id: 'testAddressId',
        isDefault: true
      };
      
      Address.updateMany.mockResolvedValue({});
      Address.findOneAndUpdate.mockResolvedValue(mockAddress);

      await updateAddress(req, res);

      expect(Address.updateMany).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        address: mockAddress
      });
    });
  });
}); 