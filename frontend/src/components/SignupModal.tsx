import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { useForm } from "react-hook-form";
import { SingupCredentials } from "../network/notes_api";
import * as NotesApi from "../network/notes_api";
import { User } from "../models/user";
import TextInputField from "./form/TextInputField";
import { useState } from "react";
import { ConflictError } from "../errors/httpError";

interface SignupModalProps {
  onSignupSuccessful: (user: User) => void;
  openModal: boolean;
  onCloseModal: () => void;
}

const SignupModal = ({
  onSignupSuccessful,
  openModal,
  onCloseModal,
}: SignupModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SingupCredentials>();

  const [errorText, setErrorText] = useState<string | null>(null);

  async function onSubmit(credentials: SingupCredentials) {
    try {
      const pingRes = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/health`
      );
      if (!pingRes.ok) {
        // check first if the server is on
        throw new Error("Server not reachable");
      } else {
        const newUser = await NotesApi.singUp(credentials);

        onSignupSuccessful(newUser); // pass this user object to parent
        reset();
        onCloseModal();
      }
    } catch (error) {
      if (error instanceof ConflictError) {
        setErrorText(error.message);
      } else if (error instanceof Error) {
        if (error.message.includes("Server not reachable")) {
          alert("Cannot connect to the server.");

          reset();
          onCloseModal();
        } else {
          alert(error.message);
        }
      } else {
        console.error(error);
      }
    }
  }

  const passwordValidation = (value: string) => {
    if (!value) {
      return "Password is required"; // First rule: required
    }
    if (value.length < 8) {
      return "Password must be at least 8 characters long"; // Second rule: minLength
    }
    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one uppercase letter"; // Third rule: uppercase
    }
    if (!/\d/.test(value)) {
      return "Password must contain at least one number"; // Fourth rule: number
    }
    if (!/[!@#$%^&*]/.test(value)) {
      return "Password must contain at least one special character"; // Fifth rule: special character
    }
    return true; // If all conditions are met, validation passes
  };

  return (
    <Modal show={openModal} onClose={onCloseModal} dismissible>
      <ModalHeader>Sign Up</ModalHeader>

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
            placeholder="John Doe"
            register={register}
            type="text"
            validationRules={{ required: "Username is Required" }}
          />
          <TextInputField
            errors={errors}
            id="email"
            label="Email"
            placeholder="JonhDoe@gmail.com"
            register={register}
            type="email"
            validationRules={{ required: "Email is Required" }}
          />
          <TextInputField
            errors={errors}
            id="password"
            label="Password"
            placeholder=""
            register={register}
            type="password"
            validationRules={{
              validate: passwordValidation,
            }}
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
            {isSubmitting ? "Signing Up" : "Sign Up"}
          </span>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SignupModal;
