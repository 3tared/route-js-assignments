import { Router } from "express";
import { verifyToken } from "../../middlewares/index.js";
import { SuccessfullResponse } from "../../common/utils/response/response.success.js";
import {
  AggregateNote,
  CreateNote,
  DeleteAllNotes,
  DeleteNote,
  GetNote,
  NoteWithUser,
  PaginateList,
  ReplaceNote,
  SearchNoteByContent,
  UpdateNote,
  UpdateUserNotes,
} from "./note.service.js";

const router = Router();

router.post("/", verifyToken, async (req, res, next) => {
  const note = await CreateNote(req);
  return SuccessfullResponse({
    res,
    message: "Note Created",
    data: note,
  });
});
router.patch("/all", verifyToken, async (req, res, next) => {
  const userNotes = await UpdateUserNotes(req);
  return SuccessfullResponse({
    res,
    message: "All Notes Updated",
    data: userNotes,
  });
});
router.get("/note-by-content", verifyToken, async (req, res, next) => {
  const searchNote = await SearchNoteByContent(req);
  return SuccessfullResponse({
    res,
    message: "Note",
    data: searchNote,
  });
});
router.get("/note-with-user", verifyToken, async (req, res, next) => {
  const userNote = await NoteWithUser(req);
  return SuccessfullResponse({
    res,
    message: "Note",
    data: userNote,
  });
});
router.get("/aggregate", verifyToken, async (req, res, next) => {
  const aggregatenote = await AggregateNote(req);
  return SuccessfullResponse({
    res,
    message: "Note",
    data: aggregatenote,
  });
});
router.get("/:noteId", verifyToken, async (req, res, next) => {
  const note = await GetNote(req);
  return SuccessfullResponse({
    res,
    message: "Note",
    data: note,
  });
});
router.patch("/:noteId", verifyToken, async (req, res, next) => {
  const updatedNote = await UpdateNote(req);
  return SuccessfullResponse({
    res,
    message: "Note Updated",
    data: updatedNote,
  });
});
router.put("/:noteId", verifyToken, async (req, res, next) => {
  const replacedNote = await ReplaceNote(req);
  return SuccessfullResponse({
    res,
    message: "Note Updated",
    data: replacedNote,
  });
});
router.delete("/", verifyToken, async (req, res, next) => {
  const deletedNotes = await DeleteAllNotes(req);
  return SuccessfullResponse({
    res,
    message: "Notes Deleted",
    data: deletedNotes,
  });
});
router.delete("/:noteId", verifyToken, async (req, res, next) => {
  const deletedNote = await DeleteNote(req);
  return SuccessfullResponse({
    res,
    message: "Note Deleted",
    data: deletedNote,
  });
});
router.get("/paginate-sort", verifyToken, async (req, res, next) => {
  const paginateList = await PaginateList(req);
  return SuccessfullResponse({
    res,
    message: "Notes",
    data: paginateList,
  });
});

export default router;
