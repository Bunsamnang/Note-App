import { Card } from "flowbite-react";
import { Note as NoteModel } from "../models/note";
import { formatDate } from "../utils/formatDate";
import { Trash2 } from "lucide-react";

interface NoteProps {
  note: NoteModel;
  onDeleteNote: (noteId: string) => void;
  onNoteClicked: (note: NoteModel) => void;
}

const Note = ({ note, onDeleteNote, onNoteClicked }: NoteProps) => {
  // destructuring
  const { title, text, createdAt, updatedAt, _id } = note;

  let createdOrUpdated: string;

  if (updatedAt > createdAt) {
    createdOrUpdated = `Updated At: ${formatDate(updatedAt)}`;
  } else {
    createdOrUpdated = `Created At: ${formatDate(createdAt)}`;
  }

  return (
    <Card
      className="w-96  rounded-lg dark:bg-gray-800 max-sm:mb-2  hover:shadow-xl cursor-pointer transition-all 0.3s ease-in-out bg-slate-300"
      onClick={() => {
        onNoteClicked(note);
      }}
    >
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight dark:text-white">
          {title}
        </h1>
        <Trash2
          size={23}
          className="text-slate-800 hover:opacity-70"
          onClick={(e) => {
            e.stopPropagation(); // prevent the click event from the event of Card (parent)
            onDeleteNote(_id);
          }}
        />
      </div>
      <p className="whitespace-pre-line text-gray-700 dark:text-gray-300 flex-grow">
        {text}
      </p>
      <hr className="border-slate-700 w-full" />
      <div className=" text-gray-500 dark:text-gray-400 text-sm">
        <span>{createdOrUpdated}</span>
      </div>
    </Card>
  );
};

export default Note;
