const { 
  getAllProducts, 
  getProductSizes, 
  purchaseProduct,
  updateProductSizes 
} = require('../controllers/shopController');
const Product = require('../models/Product');

jest.mock('../models/Product');

describe('Shop Controller', () => {
  let req;
  let res;
  const mockIo = {
    emit: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      params: { id: 'testProductId' },
      body: {
        size: 'M',
        quantity: 1
      },
      app: {
        get: jest.fn().mockReturnValue(mockIo)
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const mockProducts = [{ title: 'Product 1' }];
      Product.find.mockResolvedValue(mockProducts);

      await getAllProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });

    it('should handle database errors', async () => {
      Product.find.mockRejectedValue(new Error('Database error'));

      await getAllProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch products'
      });
    });
  });

  describe('purchaseProduct', () => {
    it('should handle product not found', async () => {
      Product.findById.mockResolvedValue(null);

      await purchaseProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Product not found'
      });
    });

    it('should handle invalid size', async () => {
      const mockProduct = {
        sizes: [{ name: 'L', quantity: 5 }]
      };
      Product.findById.mockResolvedValue(mockProduct);

      await purchaseProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid size selected'
      });
    });

    it('should handle insufficient stock', async () => {
      const mockProduct = {
        sizes: [{ name: 'M', quantity: 0 }]
      };
      Product.findById.mockResolvedValue(mockProduct);

      await purchaseProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Insufficient stock for the selected size'
      });
    });
  });

  describe('updateProductSizes', () => {
    it('should handle size not found', async () => {
      const mockProduct = {
        sizes: [{ name: 'L', quantity: 5 }]
      };
      Product.findById.mockResolvedValue(mockProduct);

      req.body.sizeName = 'XL';
      await updateProductSizes(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Size not found'
      });
    });
  });
}); 