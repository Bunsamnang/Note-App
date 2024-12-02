import { Label, Textarea, TextInput } from "flowbite-react";
import { FieldErrors, UseFormRegister, Path } from "react-hook-form";
import {
  LoginCredentials,
  NoteInput,
  SingupCredentials,
} from "../../network/notes_api";

type InputTypes = NoteInput | LoginCredentials | SingupCredentials;

interface TextInputFieldProps<T extends InputTypes> {
  register: UseFormRegister<T>;
  validationRules?: object;
  id: Path<T>;
  label: string;
  placeholder: string;
  isTextArea?: boolean;
  errors: FieldErrors<T>;
  rows?: number;
  type?: "text" | "email" | "password";
}
const TextInputField = <T extends InputTypes>({
  register,
  validationRules,
  id,
  label,
  placeholder,
  isTextArea,
  errors,
  rows,
  type,
}: TextInputFieldProps<T>) => {
  // Access the error message safely
  const error = errors[id] as FieldErrors | undefined;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} value={label} />
      {isTextArea ? (
        <Textarea
          id={id}
          placeholder={placeholder}
          rows={rows}
          shadow
          {...register(id)}
          className={error ? "border-red-500" : ""}
        />
      ) : (
        <TextInput
          id={id}
          placeholder={placeholder}
          shadow
          type={type}
          {...register(id, validationRules)}
          color={error ? "failure" : undefined}
          helperText={
            error && (
              <span>
                {typeof error.message === "string" ? error.message : ""}
              </span>
            )
          }
        />
      )}
    </div>
  );
};

export default TextInputField;
