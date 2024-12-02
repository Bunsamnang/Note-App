import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import { assertIsDefined } from "../utils/assertIsDefined";

// set up a of get (fetch data) when a request is made
export const getNotes: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId); // ensure theres no null value, especially when u forgot to add the check middleware

    const notes = await NoteModel.find({ userId: authenticatedUserId }).exec();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

    // check if the id is fit the standard
    if (!isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid Note Id");
    }

    const note = await NoteModel.findById(noteId).exec();
    // check if the id provided is not found in database
    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    if (!note.userId?.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note");
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

interface CreateNoteBody {
  title?: string;
  text?: string;
}

export const createNote: RequestHandler<
  unknown,
  unknown,
  CreateNoteBody,
  unknown
> = async (req, res, next) => {
  // when user make a request with note input ({title: "", text: "" }), extract it
  const title = req.body.title;
  const text = req.body.text;

  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

    if (!title) {
      throw createHttpError(400, "Note must have a title");
    }

    const newNote = await NoteModel.create({
      userId: authenticatedUserId,
      title: title,
      text: text,
    });

    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

interface UpdateNoteParams {
  noteId: string;
}

interface UpdateNoteBody {
  title?: string;
  text?: string;
}

export const updateNote: RequestHandler<
  UpdateNoteParams,
  unknown,
  UpdateNoteBody,
  unknown
> = async (req, res, next) => {
  const noteId = req.params.noteId;

  const newTitle = req.body.title;
  const newText = req.body.text;

  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

    if (!isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid Note Id");
    }

    if (!newTitle) {
      throw createHttpError(400, "Note must have a title");
    }

    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    if (!note.userId?.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note");
    }

    note.title = newTitle;
    note.text = newText;

    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;

  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

    if (!isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid Note Id");
    }

    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    if (!note.userId?.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note");
    }

    await note.deleteOne();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
