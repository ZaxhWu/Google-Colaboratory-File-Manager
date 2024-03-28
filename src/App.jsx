import React, { useEffect, useState } from "react";
import Google_login from "./components/google_login";
import context from "./components/context";
import GSI from "./components/google_ library/gsi";
import GAPI from "./components/google_ library/gapi";
import Folder from "./components/google_folder";
import Google_Colab from "./components/google_colab/google_colab_input";

export default function App() {
  //context
  const [token, setToken] = useState("");
  const [inputs, setInputs] = useState([{ type: "notes", value: "" }]);
  const [gapiCK, setGapiCk] = useState(false);
  useEffect(() => {
    setGapiCk(true);
  }, [GAPI()]);

  return (
    <div style={{ marginLeft: "20%", marginRight: "20%" }}>
      <h1>Google Colaboratory File Manager</h1>
      <context.Provider value={{ token, setToken, inputs, setInputs }}>
        {GSI() && (
          <div>
            <Google_login />
            {gapiCK && token != "" && <Folder />}
          </div>
        )}
        {token != "" && <Google_Colab />}
      </context.Provider>
    </div>
  );
}
