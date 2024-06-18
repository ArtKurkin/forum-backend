const Router = require("express");
const userController = require("../controllers/userController");
const router = new Router();

// router.get("/slug/:slug", userController.getBySlug);
// router.get("/id/:id", userController.getById);
// router.post("/", userController.add);
// router.delete("/:id", userController.delete);
router.post("/registration", userController.registration);
router.get("/logout", userController.logout);
router.post("/login", userController.login);
router.get("/refresh", userController.refresh);

module.exports = router;
