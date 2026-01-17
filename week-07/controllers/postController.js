import { Post, User, Comment } from "../models/index.js";
import { sequelize } from "../config/database.js";

const createPost = async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    const post = new Post({
      title,
      content,
      userId,
    });

    await post.save();

    res.status(201).json({
      message: "Post created successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
      });
    }

    if (post.userId !== parseInt(userId)) {
      return res.status(403).json({
        message: "You are not authorized to delete this post.",
      });
    }

    await post.destroy();

    res.status(200).json({
      message: "Post deleted.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getPostsWithDetails = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ["id", "title"],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"],
        },
        {
          model: Comment,
          as: "comments",
          attributes: ["id", "content"],
        },
      ],
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getPostsWithCommentCount = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: [
        "id",
        "title",
        [sequelize.fn("COUNT", sequelize.col("comments.id")), "commentCount"],
      ],
      include: [
        {
          model: Comment,
          as: "comments",
          attributes: [],
        },
      ],
      group: ["Post.id"],
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export {
  createPost,
  deletePost,
  getPostsWithDetails,
  getPostsWithCommentCount,
};
