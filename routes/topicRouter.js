const Router = require("express");
const topicController = require("../controllers/topicController");
const authMiddleware = require("../middleware/authMiddleware");
const router = new Router();

router.get("/:slug/posts", topicController.getPosts);
router.get("/slug/:slug", topicController.getBySlug);
router.post("/:id/like", authMiddleware, topicController.likeTopic);
router.post("/:id/dislike", authMiddleware, topicController.dislikeTopic);
router.post("/", authMiddleware, topicController.add);

module.exports = router;
