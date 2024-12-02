import { Button } from "flowbite-react";

interface NavBarLoggedOutView {
  onSignupClicked: () => void;
  onLoginClicked: () => void;
}

const NavBarLoggedOutView = ({
  onLoginClicked,
  onSignupClicked,
}: NavBarLoggedOutView) => {
  return (
    <>
      <div className="flex justify-end gap-x-2 max-sm:justify-center">
        <Button
          className="bg-slate-700 hover:!bg-slate-600 focus:!ring-transparent"
          onClick={onSignupClicked}
        >
          Sign up
        </Button>
        <Button
          outline
          className="bg-slate-900 hover:!bg-slate-600 focus:!ring-transparent"
          onClick={onLoginClicked}
        >
          Log in
        </Button>
      </div>
    </>
  );
};

export default NavBarLoggedOutView;
