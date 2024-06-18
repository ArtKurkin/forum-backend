const Router = require("express");
const forumController = require("../controllers/forumController");
const router = new Router();

router.get("/", forumController.getAll);
router.get("/:slug/topics", forumController.getTopicsBySlug);
router.get("/slug/:slug", forumController.getBySlug);
router.post("/", forumController.add);

module.exports = router;
