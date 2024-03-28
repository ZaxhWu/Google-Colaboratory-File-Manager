import { useEffect, useState, useContext } from "react";
import { jwtDecode as jwt_decode } from "jwt-decode";
import context from "./context";

const Client_ID = process.env.ClientID;

const SCOPES =
  "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file";

export default function Google_login() {
  const { token, setToken } = useContext(context);

  const [user, setUser] = useState({});
  const [tokenClient, setTokenClient] = useState({});

  const [indicator, setIndicator] = useState(false);

  function handleCredentialResponse(response) {
    var userObject = jwt_decode(response.credential);
    setUser(userObject);
    document.getElementById("signinDiv").hidden = true;
  }

  function handleSignOut(e) {
    setUser({});
    document.getElementById("signinDiv").hidden = false;
  }

  //get Access Token
  //Token client
  function tokenLogin() {
    tokenClient.requestAccessToken();
  }

  useEffect(() => {
    if (token) {
      setIndicator(true);
    } else {
      setIndicator(false);
    }
  }, [token]);

  useEffect(() => {
    google.accounts.id.initialize({
      client_id: Client_ID,
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(document.getElementById("signinDiv"), {
      theme: "outline",
      size: "large",
    });
    setTokenClient(
      google.accounts.oauth2.initTokenClient({
        client_id: Client_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
          setToken(tokenResponse.access_token);
        },
      })
    );
  }, []);

  return (
    <div>
      <h2>Google Login :</h2>
      {user && (
        <div style={{ margin: "0" }}>
          <img src={user.picture} />
          <p>{user.name}</p>
        </div>
      )}
      <div id="signinDiv" style={{ margin: "0" }}></div>
      {Object.keys(user).length != 0 && (
        <div>
          <button onClick={(e) => handleSignOut(e)}>SignOut From Google</button>
        </div>
      )}
      <h2>Token Login</h2>
      <p style={{ margin: "0" }}>
        {" "}
        To use Google API, we need to obtain an Access Token.
      </p>
      <div style={{ display: "flex", alignItems: "center", marginTop: "-2px" }}>
        {indicator ? <p>🟢</p> : <p>🔴</p>}
        <button
          type="submit"
          onClick={tokenLogin}
          // value="Token Login"
          style={{ height: "20px" }}
        >
          Get Access Token
        </button>
      </div>
    </div>
  );
}
