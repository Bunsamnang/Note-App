import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { User } from "../models/user";
import TextInputField from "./form/TextInputField";
import { useForm } from "react-hook-form";
import { LoginCredentials } from "../network/notes_api";
import * as NotesApi from "../network/notes_api";
import { UnauthorizedError } from "../errors/httpError";
import { useState } from "react";

interface LoginModalProps {
  openModal: boolean;
  onSubmitSuccessful: (user: User) => void;
  onCloseModal: () => void;
}
const LoginModal = ({
  openModal,
  onSubmitSuccessful,
  onCloseModal,
}: LoginModalProps) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>();

  const [errorText, setErrorText] = useState<string | null>(null);

  async function onSubmit(credentials: LoginCredentials) {
    try {
      const pingRes = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/health`
      );
      if (!pingRes.ok) {
        // Check first if the server is reachable
        console.log(pingRes.status);
        throw Error("Server not reachable");
      }

      const oldUser = await NotesApi.login(credentials);

      onSubmitSuccessful(oldUser); // Pass the user object to the parent

      alert(`Welcome back ${oldUser.username}`);
      reset(); // Reset the form
      onCloseModal(); // Close the modal
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        setErrorText(error.message); // Show Unauthorized error in UI
      } else if (error instanceof Error) {
        if (error.message.includes("Server not reachable")) {
          alert("Cannot connect to the server.");
          reset();
          onCloseModal();
        } else {
          alert(error.message); // Display other errors
        }
      } else {
        alert(error); // Catch-all for unexpected errors
      }
      console.log(error instanceof Error); // Log type-check for debugging
      console.error(error); // Log full error
    }
  }

  return (
    <Modal show={openModal} onClose={onCloseModal} dismissible>
      <ModalHeader>Log In</ModalHeader>

      <ModalBody>
        {errorText && <Alert color="failure">{errorText}</Alert>}

        <form
          id="signupForm"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <TextInputField
            errors={errors}
            id="username"
            label="Username"
            placeholder=""
            register={register}
            validationRules={{ required: "Required" }}
            type="text"
          />

          <TextInputField
            errors={errors}
            id="password"
            label="Password"
            placeholder=""
            register={register}
            validationRules={{ required: "Required" }}
            type="password"
          />
        </form>
      </ModalBody>

      <ModalFooter>
        <Button
          type="submit"
          form="signupForm"
          disabled={isSubmitting}
          className="w-full bg-blue-700 rounded-lg text-white hover:!bg-blue-600 focus:!ring-transparent"
        >
          <span className="text-lg font-normal">
            {isSubmitting ? "Loggin In" : "Log In"}
          </span>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default LoginModal;
