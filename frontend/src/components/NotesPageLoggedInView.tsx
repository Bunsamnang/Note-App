import { Button } from "flowbite-react";
import { LoaderCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Note as NoteModel } from "../models/note";
import * as NotesApi from "../network/notes_api";
import AddOrEditNote from "./AddOrEditNote";
import Note from "./Note";

const NotesPageLoggedInView = () => {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);

  // Open Add Note Modal
  const handleAddNoteClick = () => {
    setNoteToEdit(null); // Clear any previous edit note
    setOpenModal(true); // Open the modal
  };

  // Open Edit Note Modal
  const handleEditNoteClick = (note: NoteModel) => {
    setNoteToEdit(note); // Set the note to edit
    setOpenModal(true); // Open the modal
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Close the modal
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await NotesApi.deleteNote(noteId);
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadNotes = async () => {
      try {
        setShowNotesLoadingError(false);
        setNotesLoading(true);
        const noteData = await NotesApi.fetchNotes();
        setNotes(noteData);
      } catch (error) {
        console.error(error);
        setShowNotesLoadingError(true);
      } finally {
        setNotesLoading(false);
      }
    };

    loadNotes();
  }, []);

  console.log(notes);
  console.log(noteToEdit);

  {
    /* Notes Display */
  }
  const noteCards = (
    <div className="flex flex-wrap justify-center gap-5">
      {notes.map((note) => (
        <Note
          note={note}
          key={note._id}
          onDeleteNote={handleDeleteNote}
          onNoteClicked={handleEditNoteClick}
        />
      ))}
    </div>
  );

  const addButton = (
    <div className="flex justify-center items-center">
      <Button
        className="mb-6 bg-slate-800 hover:!bg-slate-700 focus:!ring-transparent"
        onClick={handleAddNoteClick}
        size="lg"
      >
        <div className="flex items-center gap-2">
          <Plus size={20} />
          <span className="leading-none">Add new note</span>
        </div>
      </Button>
    </div>
  );
  return (
    <>
      {showNotesLoadingError && (
        <p className="text-red-700 text-center">Something went wrong.</p>
      )}
      {notesLoading && (
        <div className="flex justify-center items-center">
          <LoaderCircle className="animate-spin text-slate-800 w-10 h-10" />
        </div>
      )}

      {!showNotesLoadingError && !notesLoading && (
        <>
          {addButton}
          {notes.length > 0 ? (
            noteCards
          ) : (
            <p className="text-center text-slate-600">
              You don't have any notes yet.
            </p>
          )}
        </>
      )}

      {/* Add or Edit Note Modal */}
      {openModal && (
        <AddOrEditNote
          handleClose={handleCloseModal}
          openModal={openModal}
          noteToEdit={noteToEdit}
          onNoteSaved={(savedNote) => {
            if (noteToEdit) {
              // Update existing note
              setNotes((prevNotes) =>
                prevNotes.map((note) =>
                  note._id === savedNote._id ? savedNote : note
                )
              );
            } else {
              // Add new note
              setNotes((prevNotes) => [...prevNotes, savedNote]);
            }
            handleCloseModal();
          }}
        />
      )}
    </>
  );
};

export default NotesPageLoggedInView;
