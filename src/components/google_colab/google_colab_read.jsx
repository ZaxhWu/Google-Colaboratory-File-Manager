import React, { useState, useEffect, useContext } from "react";
import context from "../context";

const API_KEY = process.env.API_KEY;
function Google_Colab_Read({ fileId, state }) {
  const { token, setInputs } = useContext(context);

  const ReadColab = async () => {
    if (fileId == undefined) {
      return;
    }

    fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      params: {
        mimeType: "application/vnd.google.colaboratory",
      },
    })
      .then(function (responses) {
        console.log("Colab Read ok");
        state("Colab Read Successful");
        return responses.json();
      })
      .then((dj) => {
        if (dj == undefined) return;
        var tmp = dj.cells.map((cur, idx) => {
          if (cur.cell_type == "markdown") {
            return { type: "notes", value: cur.source };
          } else {
            return { type: "code", value: cur.source };
          }
        });
        setInputs(tmp);
      })
      .catch(function (error) {
        console.error("Error Reading file:", error.message);
        state(`Reading file fail: ${error.message}`);
      });
  };

  return (
    <>
      <button
        onClick={() => {
          ReadColab(fileId);
        }}
      >
        Read Colab
      </button>
    </>
  );
}

export default Google_Colab_Read;
