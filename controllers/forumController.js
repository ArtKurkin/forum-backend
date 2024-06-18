const { Topic, Post } = require("../models/models");
const topicService = require("../services/topicService");
const postService = require("../services/topicService");
const forumService = require("../services/forumService");

class ForumController {
  async getAll(req, res, next) {
    try {
      const forums = await forumService.getAllForums();
      return res.json(forums);
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req, res, next) {
    const slug = req.params["slug"];
    try {
      const forum = await forumService.getByForumSlug(slug);
      return res.status(200).json(forum);
    } catch (error) {
      next(error);
    }
  }

  async getTopicsBySlug(req, res, next) {
    const slug = req.params["slug"];
    try {
      const topic = await topicService.getTopicsByForumSlug(slug);
      return res.status(200).json(topic);
    } catch (error) {
      next(error);
    }
  }

  async add(req, res, next) {
    try {
      const newForum = await forumService.addForum(req.body);
      return res.status(200).json(newForum);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ForumController();
