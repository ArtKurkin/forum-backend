const jwt = require("jsonwebtoken");
require("dotenv").config("../");
const userRepository = require("../repositories/userPostgresRepository");

class TokenService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS, {
      expiresIn: "2m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH, {
      expiresIn: "5m",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await this.userRepository.saveRefreshTokenByUserId(
      userId,
      refreshToken
    );
    return tokenData;
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS);
      return userData;
    } catch (error) {
      throw null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH);
      return userData;
    } catch (error) {
      return null;
    }
  }

  async removeToken(refreshToken) {
    const tokenData = await this.userRepository.deleteRefreshToken(
      refreshToken
    );
    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = await this.userRepository.getUsersRefreshToken(
      refreshToken
    );
    return tokenData;
  }
}

module.exports = new TokenService(userRepository);
