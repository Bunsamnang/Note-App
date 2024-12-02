import { Button, Modal } from "flowbite-react";
import { Note } from "../models/note";
import { NoteInput } from "../network/notes_api";
import * as NoteApi from "../network/notes_api";
import { useForm } from "react-hook-form";
import TextInputField from "./form/TextInputField";

interface AddOrEditNoteProps {
  noteToEdit?: Note | null;
  handleClose: () => void;
  openModal: boolean;
  onNoteSaved: (note: Note) => void;
}

const AddOrEditNote = ({
  noteToEdit,
  handleClose,
  onNoteSaved,
  openModal,
}: AddOrEditNoteProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NoteInput>({
    defaultValues: {
      title: noteToEdit?.title || "",
      text: noteToEdit?.text || "",
    },
  });

  async function onSubmit(input: NoteInput) {
    try {
      let noteRes: Note;
      if (noteToEdit) {
        noteRes = await NoteApi.updateNote(noteToEdit._id, input);
      } else {
        noteRes = await NoteApi.createNote(input);
      }

      onNoteSaved(noteRes); // to update ui (pass this note to parent)
      reset(); // Clear the form after successful submission
      handleClose(); // Close the modal
    } catch (error) {
      console.error(error);
      alert("Failed to save note. Please try again.");
    }
  }

  return (
    <Modal show={openModal} onClose={handleClose} dismissible>
      <div className="bg-customBackground p-2">
        <Modal.Header>{noteToEdit ? "Edit Note" : "Add Note"}</Modal.Header>
        <Modal.Body>
          <form
            className="space-y-6"
            id="addEditNoteForm"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Title Input */}
            <TextInputField
              register={register}
              errors={errors}
              id="title"
              placeholder="Meeting Notes"
              label="Title"
              validationRules={{ required: "Title is required" }}
            />

            {/* Text Input */}
            <TextInputField
              register={register}
              errors={errors}
              id="text"
              isTextArea
              rows={4}
              label="Text"
              placeholder="Write down key points from today's meeting, including tasks, decisions, and deadlines."
            />
          </form>
        </Modal.Body>
        <Modal.Footer className="flex">
          <div className="ml-auto">
            <Button
              type="submit"
              form="addEditNoteForm"
              disabled={isSubmitting}
              className="bg-green-800 hover:!bg-green-700 focus:!ring-transparent "
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default AddOrEditNote;
