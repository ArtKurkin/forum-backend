const Router = require("express");
const postRouter = require("./postRouter");
const topicRouter = require("./topicRouter");
const userRouter = require("./userRouter");
const forumRouter = require("./forumRouter");
const categoryRouter = require("./categoryRouter");
const router = new Router();

router.use("/posts", postRouter);
router.use("/topics", topicRouter);
router.use("/users", userRouter);
router.use("/forums", forumRouter);
router.use("/categories", categoryRouter);

module.exports = router;
