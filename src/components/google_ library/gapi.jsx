import { useEffect, useState } from "react";

export default function GAPI() {
  //context
  const [isScriptAPILoaded, setIsScriptAPILoaded] = useState(false);
  var scriptAPI, apiScript;

  const handleScriptAPILoad = () => {
    setIsScriptAPILoaded(true);
  };

  useEffect(() => {
    //api
    apiScript = document.querySelector(
      'script[src="https://apis.google.com/js/api.js"]'
    );
    if (!apiScript) {
      scriptAPI = document.createElement("script");
      scriptAPI.src = "https://apis.google.com/js/api.js";
      scriptAPI.async = true;
      scriptAPI.defer = true;

      scriptAPI.addEventListener("load", handleScriptAPILoad);
      document.body.appendChild(scriptAPI);
    } else {
      if (apiScript.complete) {
        setIsScriptAPILoaded(true);
      } else {
        apiScript.addEventListener("load", handleScriptAPILoad);
      }
    }

    return () => {
      if (scriptAPI != undefined) {
        scriptAPI.removeEventListener("load", handleScriptAPILoad);
      }
      if (apiScript != undefined) {
        apiScript.removeEventListener("load", handleScriptAPILoad);
      }
    };
  }, []);

  return isScriptAPILoaded;
}
