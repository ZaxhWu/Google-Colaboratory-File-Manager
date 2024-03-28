import React, { useEffect, useState, useContext } from "react";
import context from "./context";

const API_KEY = process.env.API_KEY;

const GooglePicker = () => {
  const { token, setToken } = useContext(context);
  const [pickerInited, setPickerInited] = useState(false);

  useEffect(() => {
    const initializePicker = async () => {
      await gapi.client.load(
        "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
      );
      setPickerInited(true);
    };

    gapi.load("client:picker", initializePicker);
  }, []);
  useEffect(() => {
    console.log("pickerToken", token);
    if (token.length > 0) {
      const fetchData = async () => {
        await createPicker();
      };

      fetchData();
    }
  }, [pickerInited, token]);

  const createPicker = async () => {
    console.log("picker creater");
    const view = new google.picker.View(google.picker.ViewId.DOCS);
    view.setMimeTypes("image/png,image/jpeg,image/jpg");
    const picker = new google.picker.PickerBuilder()
      .enableFeature(google.picker.Feature.NAV_HIDDEN)
      .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
      .setDeveloperKey(API_KEY)
      //   .setAppId(APP_ID)
      .setOAuthToken(token)
      .addView(view)
      .addView(new google.picker.DocsUploadView())
      .setCallback(pickerCallback)
      .build();
    picker.setVisible(true);
  };

  const pickerCallback = async (data) => {
    if (data.action === google.picker.Action.PICKED) {
      let text = `Picker response: \n${JSON.stringify(data, null, 2)}\n`;
      const document = data[google.picker.Response.DOCUMENTS][0];
      const fileId = document[google.picker.Document.ID];
      const res = await gapi.client.drive.files.get({
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
      <pre id="content" style={{ whiteSpace: "pre-wrap" }}></pre>
    </div>
  );
};

export default GooglePicker;
