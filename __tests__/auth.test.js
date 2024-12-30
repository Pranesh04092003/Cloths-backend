const { register, login, getProfile } = require('../controllers/authController');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Mock the modules
jest.mock('../models/User');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup request object
    req = {
      body: {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      },
      user: {
        userId: 'testUserId'
      }
    };

    // Setup response object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Setup JWT mock
    jwt.sign.mockReturnValue('testToken');
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      // Mock user with comparePassword method
      const mockUser = {
        _id: 'testUserId',
        fullName: 'Test User',
        email: 'test@example.com',
        comparePassword: jest.fn().mockResolvedValue(true)
      };

      // Setup the mock implementation
      User.findOne.mockResolvedValue(mockUser);

      await login(req, res);

      expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login successful',
        data: expect.objectContaining({
          token: 'testToken',
          user: expect.any(Object)
        })
      });
    });

    it('should return 400 if email or password is missing', async () => {
      req.body = {};
      
      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Please provide email and password'
      });
    });

    it('should return 401 if user not found', async () => {
      User.findOne.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid credentials'
      });
    });

    it('should return 401 if password is incorrect', async () => {
      const mockUser = {
        comparePassword: jest.fn().mockResolvedValue(false)
      };
      User.findOne.mockResolvedValue(mockUser);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid credentials'
      });
    });
  });

  describe('getProfile', () => {
    it('should return user profile successfully', async () => {
      const mockUser = {
        _id: 'testUserId',
        fullName: 'Test User',
        email: 'test@example.com'
      };

      // Mock the select chain
      const mockSelect = jest.fn().mockResolvedValue(mockUser);
      User.findById.mockReturnValue({ select: mockSelect });

      await getProfile(req, res);

      expect(User.findById).toHaveBeenCalledWith('testUserId');
      expect(mockSelect).toHaveBeenCalledWith('-password');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { user: mockUser }
      });
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database error');
      User.findById.mockReturnValue({
        select: jest.fn().mockRejectedValue(mockError)
      });

      await getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error fetching profile',
        error: mockError.message
      });
    });
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Mock user creation
      const mockUser = {
        _id: 'testUserId',
        fullName: 'Test User',
        email: 'test@example.com',
        save: jest.fn().mockResolvedValue(true)
      };

      User.findOne.mockResolvedValue(null);
      User.mockImplementation(() => mockUser);

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Registration successful',
        data: expect.objectContaining({
          token: expect.any(String),
          user: expect.objectContaining({
            id: expect.any(String),
            fullName: 'Test User',
            email: 'test@example.com'
          })
        })
      });
    });

    it('should handle validation errors', async () => {
      req.body = {};
      
      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Please provide all required fields'
      });
    });

    it('should handle existing user', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com' });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email already registered'
      });
    });
  });
}); 