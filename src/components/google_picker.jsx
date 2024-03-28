import React, { useEffect, useState } from "react";

const API_KEY = process.env.API_KEY;

const GooglePicker = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [pickerInited, setPickerInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);

  useEffect(() => {
    const gapiLoaded = () => {
      window.gapi.load("client:picker", initializePicker);
    };

    const gisLoaded = () => {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: "",
      });
      tokenClient.then((client) => {
        setGisInited(true);
        client.callback = async (response) => {
          if (response.error !== undefined) {
            throw response;
          }
          setAccessToken(response.access_token);
        };
      });
    };

    const initializePicker = async () => {
      await window.gapi.client.load(
        "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
      );
      setPickerInited(true);
    };

    const maybeEnableButtons = () => {
      if (pickerInited && gisInited) {
        document.getElementById("authorize_button").style.visibility =
          "visible";
      }
    };

    document.getElementById("authorize_button").style.visibility = "hidden";
    document.getElementById("signout_button").style.visibility = "hidden";

    window.gapi.load("client:picker", initializePicker);
    window.gapi.load("auth2", gisLoaded);
  }, [pickerInited, gisInited]);

  const handleAuthClick = () => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: "",
    });

    tokenClient.then((client) => {
      client.callback = async (response) => {
        if (response.error !== undefined) {
          throw response;
        }
        setAccessToken(response.access_token);
        document.getElementById("signout_button").style.visibility = "visible";
        document.getElementById("authorize_button").innerText = "Refresh";
        await createPicker();
      };

      if (accessToken === null) {
        client.requestAccessToken({ prompt: "consent" });
      } else {
        client.requestAccessToken({ prompt: "" });
      }
    });
  };

  const handleSignoutClick = () => {
    if (accessToken) {
      setAccessToken(null);
      window.google.accounts.oauth2.revoke(accessToken);
      document.getElementById("content").innerText = "";
      document.getElementById("authorize_button").innerText = "Authorize";
      document.getElementById("signout_button").style.visibility = "hidden";
    }
  };

  const createPicker = async () => {
    const view = new window.google.picker.View(
      window.google.picker.ViewId.DOCS
    );
    view.setMimeTypes("image/png,image/jpeg,image/jpg");
    const picker = new window.google.picker.PickerBuilder()
      .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
      .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
      .setDeveloperKey(API_KEY)
      .setAppId(APP_ID)
      .setOAuthToken(accessToken)
      .addView(view)
      .addView(new window.google.picker.DocsUploadView())
      .setCallback(pickerCallback)
      .build();
    picker.setVisible(true);
  };

  const pickerCallback = async (data) => {
    if (data.action === window.google.picker.Action.PICKED) {
      let text = `Picker response: \n${JSON.stringify(data, null, 2)}\n`;
      const document = data[window.google.picker.Response.DOCUMENTS][0];
      const fileId = document[window.google.picker.Document.ID];
      const res = await window.gapi.client.drive.files.get({
        fileId: fileId,
        fields: "*",
      });
      text += `Drive API response for first document: \n${JSON.stringify(
        res.result,
        null,
        2
      )}\n`;
      document.getElementById("content").innerText = text;
    }
  };

  return (
    <div>
      <p>Picker API Quickstart</p>
      <button id="authorize_button" onClick={handleAuthClick}>
        Authorize
      </button>
      <button id="signout_button" onClick={handleSignoutClick}>
        Sign Out
      </button>
      <pre id="content" style={{ whiteSpace: "pre-wrap" }}></pre>
    </div>
  );
};

export default GooglePicker;
