import { ConflictError, UnauthorizedError } from "../errors/httpError";
import { Note } from "../models/note";
import { User } from "../models/user";

async function fetchData(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  try {
    const res = await fetch(input, init);

    if (res.ok) {
      return res; // Return the raw Response object if the request was successful
    } else {
      let errorBody;
      try {
        errorBody = await res.json(); // Try to parse the error body as JSON
      } catch {
        errorBody = {}; // If parsing fails, use an empty object
      }
      const errorMsg = errorBody.error || "An unknown error occurred";

      if (res.status === 401) {
        throw new UnauthorizedError(errorMsg); // Custom error for 401
      } else if (res.status === 409) {
        throw new ConflictError(errorMsg); // Custom error for 409
      } else {
        throw Error(
          `Request failed with status: ${res.status}, message: ${errorMsg}`
        ); // Generic error for other statuses
      }
    }
  } catch (err) {
    if (err instanceof TypeError && err.message === "Failed to fetch") {
      // Handle a network error (e.g., server is down)
      throw Error("Server is not reachable. Please try again later.");
    }
    throw err; // Re-throw any other errors
  }
}

export async function getLoggedInUser(): Promise<User> {
  const userRes = await fetchData(
    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users`,
    {
      method: "GET",
    }
  );
  return userRes.json();
}

export interface SingupCredentials {
  username: string;
  email: string;
  password: string;
}

export async function singUp(credentials: SingupCredentials): Promise<User> {
  const res = await fetchData(
    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }
  );

  return res.json();
}

export interface LoginCredentials {
  username: string;
  password: string;
}
export async function login(credentials: LoginCredentials): Promise<User> {
  const res = await fetchData(
    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }
  );

  return res.json();
}

export async function logout() {
  await fetchData(
    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users/logout`,
    { method: "POST" }
  );
}

export async function fetchNotes(): Promise<Note[]> {
  const res = await fetchData(
    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/notes`,
    { method: "GET" }
  );
  return res.json();
}

export interface NoteInput {
  title: string;
  text?: string;
}

export async function createNote(note: NoteInput): Promise<Note> {
  const res = await fetchData(
    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/notes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    }
  );

  return res.json();
}

export async function deleteNote(noteId: string) {
  await fetchData(
    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/notes/${noteId}`,
    {
      method: "DELETE",
    }
  );
}

export async function updateNote(noteId: string, note: NoteInput) {
  const res = await fetchData(
    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/notes/${noteId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note), // pass input (req.body)
    }
  );
  return res.json();
}
