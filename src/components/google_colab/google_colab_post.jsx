import React, { useState, useEffect, useContext } from "react";
import context from "../context";

const API_KEY = process.env.API_KEY;
export default function Google_Colab_Post({
  colabFileName,
  colabFolderID,
  state,
}) {
  const { token } = useContext(context);

  const inputs = [{ type: "notes", value: "" }];
  async function handleClick() {
    console.log("colab submitting");
    //POST https://www.googleapis.com/drive/v3/files?key=[YOUR_API_KEY] HTTP/1.1

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

    fetch(`https://www.googleapis.com/drive/v3/files?key=${API_KEY}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `${colabFileName}.ipynb`,
        mimeType: "application/vnd.google.colaboratory",
        parents: [`${colabFolderID}`],
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var fileId = data.id;

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
            state("Create File Successful");
          })
          .catch(function (error) {
            console.log("Upload error: " + error);
            state(`Create file fail: ${error.message}`);
          });
      })
      .catch(function (error) {
        console.log("Upload error: " + error);
      });
  }

  return (
    <div>
      <button onClick={handleClick}>Create Colab</button>
    </div>
  );
}
