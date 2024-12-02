import { User } from "../../models/user";
import NotesPageLoggedInView from "../NotesPageLoggedInView";
import NotesPageLoggedOutView from "../NotesPageLoggedOutView";

interface NotesPageProps {
  loggedInUser: User | null;
}

const NotesPage = ({ loggedInUser }: NotesPageProps) => {
  return (
    <>{loggedInUser ? <NotesPageLoggedInView /> : <NotesPageLoggedOutView />}</>
  );
};

export default NotesPage;
