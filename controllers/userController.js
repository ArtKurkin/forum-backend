const userService = require("../services/userService");

class UserController {
  async getBySlug(req, res, next) {
    try {
      const slug = req.params["slug"];
      const user = await userService.getByUserSlug(slug);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const id = req.params["id"];
      const user = await userService.getByUserId(id);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async add(req, res, next) {
    try {
      const body = req.body;
      const newUser = await userService.addUser(body);
      return res.json(newUser);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params["id"];
      const deletedUser = await userService.deleteUser(id);
      return res.json(deletedUser);
    } catch (error) {
      next(error);
    }
  }

  async registration(req, res, next) {
    try {
      const body = req.body;
      const { accessToken, refreshToken, user } =
        await userService.registration(body);

      return res
        .cookie("refreshToken", refreshToken, {
          maxAge: 1000 * 60 * 5,
          httpOnly: true,
        })
        .status(200)
        .json({ user, accessToken });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const body = req.body;
      const { accessToken, refreshToken, user } = await userService.login(body);

      return res
        .cookie("refreshToken", refreshToken, {
          maxAge: 1000 * 60 * 5,
          httpOnly: true,
        })
        .status(200)
        .json({ user, accessToken });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const {
        accessToken,
        refreshToken: refresh,
        user,
      } = await userService.refresh(refreshToken);

      return res
        .cookie("refreshToken", refresh, {
          maxAge: 1000 * 60 * 5,
          httpOnly: true,
        })
        .status(200)
        .json({ user, accessToken });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
