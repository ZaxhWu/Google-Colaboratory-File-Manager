import React, { useState, useEffect, useContext } from "react";
import context from "./context";
import Read_Colab from "./google_colab/google_colab_read";
import Google_Colab_Patch from "./google_colab/google_colab_patch";
import Google_Colab_Post from "./google_colab/google_colab_post";
import GoogleFolderSaving from "./google_folder_saving";

const API_KEY = process.env.API_KEY;

function Folder() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const { token, setToken } = useContext(context);

  const [selectedForderId, setSelectedForderId] = useState("root");
  const [selectedFileId, setSelectedFileId] = useState("");
  const [selectedForderName, setSelectedForderName] = useState("root");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [stack, setStack] = useState(["root"]);
  const [stackName, setStackName] = useState(["root"]);
  const [newFileName, setNewFileName] = useState("");
  const [colabState, setColabState] = useState("");

  const placeholder = "New Folder Name";
  const placeholderFile = "New File Name";

  var response = async () => {
    try {
      response = await gapi.client.drive.files.list({
        q: `(mimeType = 'application/vnd.google-apps.folder' or mimeType = 'application/vnd.google.colaboratory') and trashed = false and 'me' in owners and '${selectedForderId}' in parents`,

        fields: "files(id, name, mimeType)",
        access_token: token,
      });
      setFiles(response.result.files || []);
    } catch (err) {
      console.log("fail");
      setError(err.message);
    }
  };
  useEffect(() => {
    async function fetchData() {
      response();
    }
    const fd = async () => {
      await gapi.client
        .load("https://www.googleapis.com/discovery/v1/apis/drive/v3/rest")
        .then(() => {
          fetchData();
        });
    };

    gapi.load("client", fd);
  }, []);

  useEffect(() => {
    response();
  }, [selectedForderId]);

  const handleFileSelected = (ix) => {
    if (files[ix].id != selectedId) {
      setSelectedId(files[ix].id);
    } else {
      if (files[ix].mimeType == "application/vnd.google-apps.folder") {
        setSelectedForderId(files[ix].id);
        setSelectedForderName(files[ix].name);
        setStack([...stack, files[ix].id]);
        setStackName([...stackName, files[ix].name]);
      } else {
        setSelectedFileId(files[ix].id);
        setSelectedFileName(files[ix].name);
      }
    }
  };

  const checker = (typ) => {
    if (typ == "application/vnd.google-apps.folder") {
      return "Folder";
    }
    return "Colab";
  };

  const createNewFolder = async () => {
    fetch(`https://www.googleapis.com/drive/v3/files?key=${API_KEY}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newFolderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [`${selectedForderId}`],
      }),
    })
      .then(function (responses) {
        return responses.json();
      })
      .catch(function (error) {
        console.error("Error creating folder:", error.message);
      });
  };

  const folderBack = () => {
    if (stack.length > 0) {
      var tmp = stack.pop();
      // prevent go back from the last enter folder, need to click twice
      var tp = stackName.pop();
      if (tmp == selectedForderId) {
        tmp = stack.pop();
        tp = stackName.pop();
      }
      setSelectedForderId(tmp);
      setSelectedForderName(tp);
    } else {
      setSelectedForderId("root");
      setSelectedForderName("root");
    }
  };

  const deleteFolder = () => {
    // console.log("del");
    fetch(
      `https://www.googleapis.com/drive/v3/files/${selectedForderId}?key=${API_KEY}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trashed: true,
        }),
      }
    )
      .then((r) => {
        console.log(r);
      })
      .catch(function (error) {
        console.error("Error creating folder:", error.message);
      });
  };

  useEffect(() => {
    if (token.length > 0) {
      setSelectedForderId("root");
      setSelectedForderName("root");
      setError(null);
      setStack(["root"]);
      setStackName(["root"]);
    }
  }, [token]);

  const handleSelectedId = (d) => {
    setSelectedForderId(d);
  };

  const handleColabState = (x) => {
    setColabState(x);
  };

  return (
    <>
      <h2>Select Your Folder and file</h2>
      <div>Your selected Folder: {selectedForderName}</div>
      <div>Your selected file: {selectedFileName}</div>

      <button
        onClick={() => {
          setSelectedForderId("root");
          setSelectedForderName("root");
          setError(null);
          setStack(["root"]);
          setStackName(["root"]);
        }}
      >
        Go to root
      </button>
      <button
        onClick={() => {
          response();
        }}
      >
        {" "}
        Refresh
      </button>
      {/* <button onClick={() => folderBack()}>Go Back</button> */}
      {/* <button
        onClick={() => {
          deleteFolder();
        }}
      >
        Delete Forder
      </button> */}

      <div>
        <button onClick={() => createNewFolder()}>Create Folder</button>
        <input
          placeholder={placeholder}
          style={{
            width:
              newFolderName != ""
                ? `${newFolderName.length * 10}px`
                : `${placeholder.length * 8}px`,
          }}
          type="text"
          value={newFolderName}
          onChange={(e) => {
            setNewFolderName(e.target.value);
          }}
        />
      </div>
      <GoogleFolderSaving
        selectedForderIdd={selectedForderId}
        folderName={selectedForderName}
        folderPath={stackName}
        selectForderId={handleSelectedId}
      />
      <a
        href={`https://drive.google.com/drive/folders/${selectedForderId}?usp=drive_link`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "black" }}
      >
        Link to the folder you've selected
      </a>
      <h4>Folder :</h4>
      {error ? (
        <pre>Error: {error}</pre>
      ) : (
        <div
          style={{
            maxHeight: "500px",
            overflowY: "scroll",
          }}
        >
          <table
            style={{
              borderCollapse: "collapse",
            }}
          >
            <thead
              style={{
                borderBottom: "1px solid black",
              }}
            >
              <tr>
                <th>Name</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, ix) => (
                <tr
                  key={file.id}
                  onClick={() => handleFileSelected(ix)}
                  style={{
                    borderCollapse: "collapse",
                    backgroundColor: selectedId == file.id ? "#e0f0ff" : "",
                    cursor: "pointer",
                  }}
                >
                  <td
                    style={{
                      borderBottom: "1px solid black",
                    }}
                  >
                    {file.name}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid black",
                    }}
                  >
                    {checker(file.mimeType)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <h4> Colab oberation :</h4>
      <p>
        You may first select a file, then read and modify it, and finally submit
        it. <br />
        Alternatively, you can create a new Colab file, then read and modify it.
      </p>
      <div style={{ display: "flex" }}>
        <Read_Colab fileId={selectedFileId} state={handleColabState} />
        <Google_Colab_Patch fileId={selectedFileId} state={handleColabState} />
        <Google_Colab_Post
          colabFileName={newFileName}
          colabFolderID={selectedForderId}
          state={handleColabState}
        />
        <input
          placeholder={placeholderFile}
          style={{
            width:
              newFileName != ""
                ? `${newFileName.length * 10}px`
                : `${placeholderFile.length * 8}px`,
          }}
          type="text"
          value={newFileName}
          onChange={(e) => {
            setNewFileName(e.target.value);
          }}
        />
      </div>
      <p>Colab States: {colabState}</p>
    </>
  );
}

export default Folder;
