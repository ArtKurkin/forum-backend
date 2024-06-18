const commentService = require("../services/postService");
const postService = require("../services/postService");

class PostController {
  async add(req, res, next) {
    const body = req.body;
    try {
      const newPost = await postService.addPost(body);
      return res.json(newPost);
    } catch (error) {
      next(error);
    }
  }

  async getPostsByTopicSlug(req, res, next) {
    const slug = req.params["slug"];
    try {
      const posts = await postService.getPostsByTopicSlug(slug);
      return res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  }

  async getPost(req, res, next) {
    const postId = req.params["id"];
    try {
      const post = await postService.getPost(postId);
      return res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }

  async likePost(req, res, next) {
    const postId = req.params["id"];
    const userId = req.user.id;
    try {
      const post = await postService.postLike(postId, userId);
      return res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }

  async dislikePost(req, res, next) {
    const postId = req.params["id"];
    const userId = req.user.id;
    try {
      const post = await postService.postDislike(postId, userId);
      return res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req, res, next) {
    const postId = req.params["id"];
    try {
      const post = await postService.deletePost(postId);
      return res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostController();
