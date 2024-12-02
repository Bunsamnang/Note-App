import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
} from "flowbite-react";
import { User } from "../models/user";
import NavBarLoggedInView from "./NavBarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";
import { NavLink } from "react-router-dom";

interface NavBarProps {
  loggedInUser: User | null;
  onSignupClicked: () => void;
  onLoginClicked: () => void;
  onLogoutSuccessful: () => void;
}

const NavBar = ({
  loggedInUser,
  onLoginClicked,
  onLogoutSuccessful,
  onSignupClicked,
}: NavBarProps) => {
  return (
    <Navbar fluid className="bg-slate-800 text-white sticky p-5 w-full mb-6">
      <NavbarBrand className="whitespace-nowrap text-xl font-semibold dark:text-white">
        <NavLink
          to={"/"}
          className={({ isActive }) =>
            `mr-10 ${isActive ? "opacity-80 font-bold" : "hover:opacity-50"}`
          }
        >
          Notee App
        </NavLink>
        <NavLink
          to={"/privacy"}
          className={({ isActive }) =>
            `mr-10 font-normal ${isActive ? "opacity-80 " : "hover:opacity-50"}`
          }
        >
          Privacy
        </NavLink>
      </NavbarBrand>

      <NavbarToggle className="text-white border-white hover:bg-slate-700 hover:text-white transition-all 0.3s ease-in-out focus:ring-2 focus:ring-slate-500" />
      <NavbarCollapse>
        {loggedInUser ? (
          <NavBarLoggedInView
            user={loggedInUser}
            onLoggedoutSuccessful={onLogoutSuccessful}
          />
        ) : (
          <NavBarLoggedOutView
            onLoginClicked={onLoginClicked}
            onSignupClicked={onSignupClicked}
          />
        )}
      </NavbarCollapse>
    </Navbar>
  );
};

export default NavBar;
