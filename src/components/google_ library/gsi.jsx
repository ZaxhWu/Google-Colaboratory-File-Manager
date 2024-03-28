import { useEffect, useState } from "react";

export default function GSI() {
  //context

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  var script, gsiScript;

  const handleScriptLoad = () => {
    setIsScriptLoaded(true);
  };

  useEffect(() => {
    // gsi
    gsiScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );
    if (!gsiScript) {
      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;

      script.addEventListener("load", handleScriptLoad);
      document.body.appendChild(script);
    } else {
      if (gsiScript.complete) {
        setIsScriptLoaded(true);
      } else {
        gsiScript.addEventListener("load", handleScriptLoad);
      }
    }

    return () => {
      if (script != undefined) {
        script.removeEventListener("load", handleScriptLoad);
      }
      if (gsiScript != undefined) {
        gsiScript.removeEventListener("load", handleScriptLoad);
      }
    };
  }, []);

  return isScriptLoaded;
}
