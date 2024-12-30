const { addProduct, updateProduct, deleteProduct } = require('../controllers/adminController');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

jest.mock('../models/Product');
jest.mock('../config/cloudinary');

describe('Admin Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {
        title: 'Test Product',
        image: 'base64image',
        brand: 'Test Brand',
        originalPrice: 100,
        salePrice: 80,
        sizes: [
          { name: 'S', quantity: 10, disabled: false }
        ]
      },
      params: { id: 'testProductId' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('addProduct', () => {
    it('should add a new product successfully', async () => {
      const mockUploadResult = { secure_url: 'https://test-image-url.com' };
      cloudinary.uploader.upload.mockResolvedValue(mockUploadResult);
      
      const mockProduct = {
        _id: 'testProductId',
        ...req.body,
        image: mockUploadResult.secure_url,
        save: jest.fn().mockResolvedValue(true)
      };
      
      Product.mockImplementation(() => mockProduct);
      Product.findOne.mockResolvedValue(null);

      await addProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle validation errors', async () => {
      req.body.title = '';
      await addProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle duplicate products', async () => {
      Product.findOne.mockResolvedValue({ title: 'Test Product' });
      await addProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      const mockUpdatedProduct = { ...req.body, _id: req.params.id };
      Product.findByIdAndUpdate.mockResolvedValue(mockUpdatedProduct);

      await updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle product not found', async () => {
      Product.findByIdAndUpdate.mockResolvedValue(null);
      await updateProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      Product.findByIdAndDelete.mockResolvedValue({ _id: req.params.id });
      await deleteProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle product not found', async () => {
      Product.findByIdAndDelete.mockResolvedValue(null);
      await deleteProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
}); 