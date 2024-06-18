const { userValidation } = require("../validations/userValidation");
const CyrillicToTranslit = require("cyrillic-to-translit-js");
const bcrypt = require("bcrypt");
const sequelize = require("sequelize");
const tokenService = require("./tokenService");
const ApiError = require("../exceptions/apiError");
const userRepository = require("../repositories/userPostgresRepository");
const roleRepository = require("../repositories/rolePostgresRepository");

class UserService {
  constructor(userRepository, roleRepository) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
  }

  async getByUserSlug(slug) {
    if (!slug) throw ApiError.BadRequest("Отсутствует строка идентификатора");
    const user = await this.userRepository.getUserBySlug(slug);
    if (!user) throw ApiError.BadRequest("Не удалось найти пользователя");
    return user;
  }

  async getByUserId(id) {
    if (!id) throw ApiError.BadRequest("Отсутствует номер идентификатора");
    const user = await this.userRepository.getUserById(id);
    if (!user) throw ApiError.BadRequest("Не удалось найти пользователя");
    return user;
  }

  async addUser(dto) {
    const { error } = userValidation(dto);
    if (error) throw ApiError.BadRequest(error.message);
    try {
      const cleanedStr = dto.name
        .replace(/[^а-яА-Яa-zA-Z\d]/g, " ")
        .replace(/ +/g, "-")
        .trim();

      const slug = new CyrillicToTranslit().transform(cleanedStr).toLowerCase();

      const hashPassword = await bcrypt.hash(dto.password, 5);

      const newUser = await this.userRepository.createUser({
        name: dto.name,
        password: hashPassword,
        slug: slug,
      });
      return newUser;
    } catch (error) {
      if (error instanceof sequelize.UniqueConstraintError)
        throw ApiError.BadRequest("Пользователь с таким именем уже существует");
      throw error;
    }
  }

  async deleteUser(id) {
    if (!id) throw ApiError.BadRequest("Отсутствует номер идентификатора");
    try {
      const deletedUser = await this.userRepository.getUserById(id);
      if (!user) throw ApiError.BadRequest("Не удалось найти пользователя");

      await this.userRepository.deleteUserById(deletedUser.id);

      return deletedUser;
    } catch (error) {
      throw error;
    }
  }

  async registration(dto) {
    const { error } = userValidation(dto);
    if (error) throw ApiError.BadRequest(error.message);
    try {
      const candidate = await this.userRepository.getUserByName(dto.name);
      if (candidate)
        throw ApiError.BadRequest("Пользователь с таким именем уже существует");
      const cleanedStr = dto.name
        .replace(/[^а-яА-Яa-zA-Z\d]/g, " ")
        .replace(/ +/g, "-")
        .trim();

      const slug = new CyrillicToTranslit().transform(cleanedStr).toLowerCase();

      const hashPassword = await bcrypt.hash(dto.password, 5);

      const newUser = await this.userRepository.createUser({
        name: dto.name,
        password: hashPassword,
        slug: slug,
      });

      const role = await this.roleRepository.getRoleById(newUser.roleId);

      const tokens = tokenService.generateToken({
        name: newUser.name,
        role: role.name,
        id: newUser.id,
      });
      console.log(newUser);

      await tokenService.saveToken(newUser.id, tokens.refreshToken);

      return {
        ...tokens,
        user: { name: newUser.name, id: newUser.id, role: role.name },
      };
    } catch (error) {
      throw error;
    }
  }

  async login(dto) {
    const { error } = userValidation(dto);
    if (error) throw ApiError.BadRequest(error.message);
    try {
      const user = await this.userRepository.getUserByName(dto.name);
      if (!user) throw ApiError.BadRequest("Не удалось найти пользователя");

      let comparePassword = await bcrypt.compare(dto.password, user.password);
      if (!comparePassword) throw ApiError.BadRequest("Указан неверный пароль");

      const role = await this.roleRepository.getRoleById(user.roleId);

      const tokens = tokenService.generateToken({
        name: user.name,
        role: role.name,
        id: user.id,
      });

      console.log(role);

      await tokenService.saveToken(user.id, tokens.refreshToken);

      return {
        ...tokens,
        user: { name: user.name, id: user.id, role: role.name },
      };
    } catch (error) {
      throw error;
    }
  }

  async logout(refreshToken) {
    console.log(refreshToken);
    if (!refreshToken) return;
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw ApiError.UnauthorizedError();

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) throw ApiError.UnauthorizedError();

    const user = await this.userRepository.getUserById(userData.id);

    const role = await this.roleRepository.getRoleById(user.roleId);

    const tokens = tokenService.generateToken({
      name: user.name,
      role: role.name,
      id: user.id,
    });

    await tokenService.saveToken(user.id, tokens.refreshToken);
    return {
      ...tokens,
      user: { name: user.name, id: user.id, role: role.name },
    };
  }
}

module.exports = new UserService(userRepository, roleRepository);
