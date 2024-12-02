import { Button, NavbarBrand } from "flowbite-react";
import { User } from "../models/user";
import * as NotesApi from "../network/notes_api";

interface NavBarLoggedInViewProps {
  user: User;
  onLoggedoutSuccessful: () => void;
}

const NavBarLoggedInView = ({
  user,
  onLoggedoutSuccessful,
}: NavBarLoggedInViewProps) => {
  async function logout() {
    try {
      await NotesApi.logout();
      onLoggedoutSuccessful();
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <>
      <div className="flex justify-center items-center gap-x-5">
        <NavbarBrand className="whitespace-nowrap text-xl font-semibold dark:text-white">
          Signed in as: {user.username}
        </NavbarBrand>

        <Button
          className="bg-red-800 hover:!bg-red-700 focus:!ring-transparent"
          onClick={logout}
        >
          Log out
        </Button>
      </div>
    </>
  );
};

export default NavBarLoggedInView;
