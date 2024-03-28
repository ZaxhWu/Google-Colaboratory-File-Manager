import React, { useState, useEffect, useContext } from "react";
import context from "../context";

const API_KEY = "AIzaSyDljXsD9dSmLhhTX6yW1D5NCPRizlzQoig";
export default function Google_Colab_Patch({ fileId, state }) {
  const { token, inputs } = useContext(context);

  async function handleClick() {
    console.log("colab submitting");

    const content_pattern = {
      notes: {
        cell_type: "markdown",
        metadata: {},
        source: [],
      },
      code: {
        cell_type: "code",
        execution_count: null,
        metadata: {
          id: null,
        },
        outputs: [],
        source: [],
      },
    };

    const content = {
      cells: [],
      metadata: {
        colab: {
          provenance: [],
        },
        kernelspec: {
          display_name: "Python 3",
          name: "python3",
        },
        language_info: {
          name: "python",
        },
      },
      nbformat: 4,
      nbformat_minor: 0,
    };

    inputs.forEach((input) => {
      const cell = JSON.parse(JSON.stringify(content_pattern[input.type]));

      if (input.type === "notes") {
        cell.source[0] = input.value.replace(/\n/g, "<br>\n");
      } else {
        cell.source[0] = input.value;
      }

      content.cells.push(cell);
    });

    var file = new Blob([JSON.stringify(content)], {
      type: "application/json",
    });

    fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/vnd.google.colaboratory",
        },
        body: file,
      }
    )
      .then(function (response) {
        console.log("Upload complete");
        state("Submit complete!");
      })
      .catch(function (error) {
        console.log("Upload error: " + error);
        state(`Submit error: ${error.message}`);
      });
  }

  return (
    <div>
      <button onClick={handleClick}>Colab Submit </button>
    </div>
  );
}
