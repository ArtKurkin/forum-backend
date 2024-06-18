const Router = require("express");
const categoryController = require("../controllers/categoryController");
const router = new Router();

router.get("/", categoryController.getAll);
router.get("/slug/:slug", categoryController.getBySlug);
router.get("/:slug/forums", categoryController.getForumsBySlug);
router.post("/", categoryController.addCategory);

module.exports = router;
