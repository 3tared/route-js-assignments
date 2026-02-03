import mongoose from "mongoose";
import {
  ErrorExeption,
  ErrorNotFound,
  ErrorUnauthorized,
} from "../../common/utils/index.js";
import { NoteModel } from "../../DB/model/note.model.js";
import { UserModel } from "../../DB/model/user.model.js";

export const CreateNote = async (req) => {
  const { userId } = req.user;
  const { title, content } = req.body;
  const note = await NoteModel.create([
    {
      title,
      content,
      userId,
    },
  ]);
  if (!note.length) {
    throw ErrorExeption("Failed To Create Note", { status: 500 });
  }
  return note;
};
export const UpdateNote = async (req) => {
  const { userId } = req.user;
  const { title, content } = req.body;
  const { noteId } = req.params;
  const note = await NoteModel.findById(noteId);
  if (!note) {
    throw ErrorNotFound("Note Not found");
  }
  if (!note.userId.equals(userId)) {
    throw ErrorUnauthorized("You Are Not The Owner");
  }
  const updatedNote = await NoteModel.updateOne(
    { _id: noteId },
    { $set: { title, content } },
    { runValidators: true },
  );
  return { note, updatedNote };
};
export const ReplaceNote = async (req) => {
  const { userId } = req.user;
  const { title, content } = req.body;
  const { noteId } = req.params;
  const note = await NoteModel.findById(noteId);
  if (!note) {
    throw ErrorNotFound("Note Not found");
  }
  if (!note.userId.equals(userId)) {
    throw ErrorUnauthorized("You Are Not The Owner");
  }
  const updatedNote = await NoteModel.findOneAndReplace(
    { _id: noteId },
    { title, content, userId },
    { runValidators: true, new: true, timestamps: true },
  );
  return updatedNote;
};
export const UpdateUserNotes = async (req) => {
  const { userId } = req.user;
  const { title } = req.body;
  const updateNotes = await NoteModel.updateMany(
    { userId },
    { $set: { title } },
    { runValidators: true },
  );

  return updateNotes;
};

export const DeleteNote = async (req) => {
  const { userId } = req.user;
  const { noteId } = req.params;
  const note = await NoteModel.findById(noteId);
  if (!note) {
    throw ErrorNotFound("Note Not found");
  }
  if (!note.userId.equals(userId)) {
    throw ErrorUnauthorized("You Are Not The Owner");
  }
  const deletedNote = await NoteModel.deleteOne({ _id: noteId });
  return { note, deletedNote };
};

export const PaginateList = async (req) => {
  const { userId } = req.user;
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;
  const paginatedNotes = await NoteModel.find({ userId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  const totalDocs = await NoteModel.countDocuments(userId);
  return { paginatedNotes, totalDocs };
};
export const GetNote = async (req) => {
  const { userId } = req.user;
  const { noteId } = req.params;
  const note = await NoteModel.findById(noteId);
  if (!note) {
    throw ErrorNotFound("Note Not found");
  }
  if (!note.userId.equals(userId)) {
    throw ErrorUnauthorized("You Are Not The Owner");
  }
  return note;
};
export const SearchNoteByContent = async (req) => {
  const { userId } = req.user;
  const { content } = req.query;
  if (!content) {
    const note = await NoteModel.find({});
    return note;
  }
  const note = await NoteModel.findOne({
    userId,
    $text: { $search: content },
  });
  if (!note) {
    throw ErrorNotFound("Note Not Found");
  }
  return note;
};

export const NoteWithUser = async (req) => {
  const { userId } = req.user;
  const notes = await NoteModel.find({ userId })
    .select("title userId createdAt")
    .populate("userId", "email -_id");

  return notes;
};
export const AggregateNote = async (req) => {
  const { userId } = req.user;
  const { title } = req.query;

  const note = await NoteModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        ...(title && {
          $text: { $search: title },
        }),
      },
    },

    {
      $lookup: {
        from: "ROUTE_USERS",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $project: {
        _id: 0,
        title: 1,
        content: 1,
        createdAt: 1,
        user: {
          name: 1,
          email: 1,
        },
      },
    },
  ]);
  return note;
};

export const DeleteAllNotes = async (req) => {
  const { userId } = req.user;
  const deletedNote = await NoteModel.deleteMany({ userId });
  return deletedNote;
};
