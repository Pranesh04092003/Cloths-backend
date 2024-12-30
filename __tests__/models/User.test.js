const mongoose = require('mongoose');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

jest.mock('bcryptjs');

describe('User Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Add mock implementation for bcrypt hash
    bcrypt.hash.mockResolvedValue('hashedPassword123');
  });

  it('should create a valid user', () => {
    const validUser = new User({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    const validationError = validUser.validateSync();
    expect(validationError).toBeUndefined();
  });

  it('should require email', () => {
    const userWithoutEmail = new User({
      fullName: 'Test User',
      password: 'password123'
    });

    const validationError = userWithoutEmail.validateSync();
    expect(validationError.errors.email).toBeDefined();
  });

  it('should hash password before saving', async () => {
    const plainPassword = 'testPassword123';
    const user = new User({
      email: 'test@example.com',
      password: plainPassword,
      fullName: 'Test User'
    });

    await user.save();

    // Verify bcrypt.hash was called
    expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
    // Verify the password was updated with the hashed value
    expect(user.password).toBe('hashedPassword123');
  });

  it('should compare password correctly', async () => {
    const user = new User({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword'
    });

    bcrypt.compare.mockResolvedValueOnce(true);
    const isMatch = await user.comparePassword('password123');
    expect(isMatch).toBe(true);
  });
}); 