import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "myBase";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged(async (user) => {
      if (user) {
        if (user.displayName === null) {
          const userName = user.email.split("@")[0];
          await user.updateProfile({ displayName: userName });
        }
        // 방법 1
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });

        // 방법 2
        // setUserObj(user);
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    // 방법 1
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });

    // 방법 2
    // setUserObj(Object.assign({}, user));
  };
  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
      <footer>&copy; {new Date().getFullYear()} Mwitter</footer>
    </>
  );
}

export default App;
