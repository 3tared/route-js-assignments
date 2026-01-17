import { User } from "../models/index.js";
import { ValidationError } from "sequelize";

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists.",
      });
    }

    const user = User.build({
      name,
      email,
      password,
      role,
    });

    await user.save();

    res.status(201).json({
      message: "User added successfully.",
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: error.errors[0].message,
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const upsertUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age, role } = req.body;

    await User.upsert(
      {
        id: parseInt(id),
        name,
        email,
        age,
        role,
      },
      {
        validate: false,
      },
    );

    res.status(200).json({
      message: "User created or updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const findByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        message: "Email query parameter is required",
      });
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "no user found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ["role"] },
    });

    if (!user) {
      return res.status(404).json({
        message: "no user found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export { signup, upsertUser, findByEmail, getUserById };
