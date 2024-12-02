import { useEffect, useState } from "react";
import LoginModal from "./components/LoginModal";
import NavBar from "./components/NavBar";
import SignupModal from "./components/SignupModal";
import { User } from "./models/user";
import * as NotesApi from "./network/notes_api";
import { Route, Routes } from "react-router-dom";
import NotesPage from "./components/pages/NotesPage";
import PrivacyPage from "./components/pages/PrivacyPage";
import NotFoundPage from "./components/pages/NotFoundPage";

function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const [openModalSignup, setOpenModalSignup] = useState(false);
  const [openModalLogin, setOpenModalLogin] = useState(false);

  const [serverDown, setServerDown] = useState(false);

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const user = await NotesApi.getLoggedInUser();
        setLoggedInUser(user);
        setServerDown(false);
      } catch (error) {
        console.error(error);
        if (
          error instanceof Error &&
          error.message ===
            "Request failed with status: 500, message: An unknown error occurred"
        ) {
          setServerDown(true);
        }
      }
    }

    fetchLoggedInUser();
  }, []);

  return (
    <div className="app min-h-screen min-w-screen bg-slate-200 pb-3">
      <NavBar
        loggedInUser={loggedInUser}
        onLoginClicked={() => setOpenModalLogin(true)}
        onSignupClicked={() => setOpenModalSignup(true)}
        onLogoutSuccessful={() => setLoggedInUser(null)}
      />
      <div>
        {serverDown ? (
          <p className="text-center text-red-600 text-xl">
            Server is not reachable. Please try again later.
          </p>
        ) : (
          <Routes>
            <Route
              path="/"
              element={<NotesPage loggedInUser={loggedInUser} />}
            />
            <Route path="/privacy" element={<PrivacyPage />} />

            {/* if the route are different from the routes defined above, it will goes this below route */}
            <Route path="/*" element={<NotFoundPage />} />
          </Routes>
        )}

        {openModalSignup && (
          <SignupModal
            onSignupSuccessful={(user) => setLoggedInUser(user)}
            onCloseModal={() => setOpenModalSignup(false)}
            openModal={openModalSignup}
          />
        )}

        {openModalLogin && (
          <LoginModal
            onSubmitSuccessful={(user) => setLoggedInUser(user)}
            onCloseModal={() => setOpenModalLogin(false)}
            openModal={openModalLogin}
          />
        )}
      </div>
    </div>
  );
}

export default App;
