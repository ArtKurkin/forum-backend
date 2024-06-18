const { Topic, Post } = require("../models/models");
const topicService = require("../services/topicService");
const postService = require("../services/postService");

class TopicController {
  async getAll(req, res, next) {
    try {
      const topics = await Topic.findAll();
      return res.json(topics);
    } catch (error) {
      next(error);
    }
  }

  async getPosts(req, res, next) {
    const slug = req.params["slug"];
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const sort = req.query.sort || "downdate";
    try {
      const posts = await postService.getPostsByTopicSlug(
        slug,
        page,
        limit,
        sort
      );
      return res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req, res, next) {
    const slug = req.params["slug"];
    try {
      const topic = await topicService.getByTopicSlug(slug);
      return res.status(200).json(topic);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    const id = req.params["id"];
    try {
      const topic = await topicService.getByTopicId(id);
      return res.status(200).json(topic);
    } catch (error) {
      next(error);
    }
  }

  async add(req, res, next) {
    try {
      const topic = await topicService.addTopic(req.body);
      return res.status(200).json(topic);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    const id = req.params["id"];

    try {
      const deletedTopic = await topicService.deleteTopic(id);
      return res.status(200).json(deletedTopic);
    } catch (error) {
      next(error);
    }
  }

  async likeTopic(req, res, next) {
    const topicId = req.params["id"];
    const userId = req.user.id;
    try {
      const topic = await topicService.topicLike(topicId, userId);
      return res.status(200).json(topic);
    } catch (error) {
      next(error);
    }
  }

  async dislikeTopic(req, res, next) {
    const topicId = req.params["id"];
    const userId = req.user.id;
    try {
      const topic = await topicService.topicDislike(topicId, userId);
      return res.status(200).json(topic);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TopicController();
