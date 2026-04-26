const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');
const RefreshToken = require('../models/RefreshToken');

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRE });
};

const generateRefreshToken = async (userId) => {
  const token = crypto.randomBytes(40).toString('hex');

  // Parse refresh expiry to milliseconds
  const expireStr = env.JWT_REFRESH_EXPIRE;
  const days = parseInt(expireStr, 10) || 7;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await RefreshToken.create({ userId, token, expiresAt });

  return token;
};

const generateTokens = async (userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = await generateRefreshToken(userId);
  return { accessToken, refreshToken };
};

module.exports = { generateAccessToken, generateRefreshToken, generateTokens };
