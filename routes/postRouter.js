const Router = require("express");
const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const router = new Router();

router.get("/id/:id", postController.getPost);
router.post("/:id/like", authMiddleware, postController.likePost);
router.post("/:id/dislike", authMiddleware, postController.dislikePost);
router.post("/", authMiddleware, postController.add);
router.delete("/:id", roleMiddleware, postController.deletePost);

module.exports = router;
