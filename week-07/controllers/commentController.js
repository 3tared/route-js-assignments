import { Comment, User, Post } from "../models/index.js";
import { Op } from "sequelize";

const bulkCreateComments = async (req, res) => {
  try {
    const { comments } = req.body;

    await Comment.bulkCreate(comments);

    res.status(201).json({
      message: "comments created.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, content } = req.body;

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "comment not found",
      });
    }

    if (comment.userId !== parseInt(userId)) {
      return res.status(403).json({
        message: "You are not authorized to update this comment",
      });
    }

    comment.content = content;
    await comment.save();

    res.status(200).json({
      message: "Comment updated.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const findOrCreateComment = async (req, res) => {
  try {
    const { postId, userId, content } = req.body;

    const [comment, created] = await Comment.findOrCreate({
      where: {
        postId,
        userId,
        content,
      },
      defaults: {
        postId,
        userId,
        content,
      },
    });

    res.status(200).json({
      comment,
      created,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const searchComments = async (req, res) => {
  try {
    const { word } = req.query;

    if (!word) {
      return res.status(400).json({
        message: "Word query parameter is required",
      });
    }

    const { count, rows } = await Comment.findAndCountAll({
      where: {
        content: {
          [Op.like]: `%${word}%`,
        },
      },
    });

    if (count === 0) {
      return res.status(404).json({
        message: "no comments found.",
      });
    }

    res.status(200).json({
      count,
      comments: rows,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getNewestComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.findAll({
      where: { postId },
      order: [["createdAt", "DESC"]],
      limit: 3,
    });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getCommentWithDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "email"],
        },
        {
          model: Post,
          as: "post",
          attributes: ["id", "title", "content"],
        },
      ],
    });

    if (!comment) {
      return res.status(404).json({
        message: "no comment found",
      });
    }

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export {
  bulkCreateComments,
  updateComment,
  findOrCreateComment,
  searchComments,
  getNewestComments,
  getCommentWithDetails,
};
