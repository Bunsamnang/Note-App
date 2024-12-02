import * as NotesController from "../controllers/note";
import express from "express";

const router = express.Router();
// set up a of get (fetch data) when a request is made
router.get("/", NotesController.getNotes);

router.get("/:noteId", NotesController.getNote);

router.post("/", NotesController.createNote);

router.patch("/:noteId", NotesController.updateNote);

router.delete("/:noteId", NotesController.deleteNote);

export default router;
