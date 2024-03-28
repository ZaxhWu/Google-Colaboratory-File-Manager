import { useState, useEffect } from "react";
export default function GoogleFolderSaving({
  folderName,
  folderPath,
  selectedForderIdd,
  selectForderId,
}) {
  // data ; [ [folderName, folderPath, folderId], ...]
  const [data, setData] = useState([]);
  const [path, setPath] = useState("");
  const [selectDataIdx, setSelectDataIdx] = useState();

  useEffect(() => {
    if (folderPath != undefined && folderPath.length > 0) {
      let tmp = folderPath.join(" / ");
      setPath(tmp);
    }
  }, [folderPath]);

  useEffect(() => {
    const storedData = localStorage.getItem("savingFolder");
    if (storedData != undefined) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const savingData = () => {
    let tmp = [...data, [folderName, path, selectedForderIdd]];
    setData(tmp);
    localStorage.setItem("savingFolder", JSON.stringify(tmp));
  };

  const loadData = () => {
    selectForderId(data[selectDataIdx][2]);
  };

  const handelDelSavingFolder = () => {
    let tmp = [...data];
    tmp.splice(selectDataIdx, 1);
    setData(tmp);
    localStorage.setItem("savingFolder", JSON.stringify(tmp));
  };

  return (
    <div>
      <button onClick={savingData}>Saving Folder</button>
      <select id="options" onChange={(e) => setSelectDataIdx(e.target.value)}>
        {data.length > 0 &&
          data.map((val, idx) => (
            <option value={idx} key={val[2]}>
              {val[0]} | {val[1]}
            </option>
          ))}
      </select>
      <button
        onClick={() => {
          loadData();
        }}
      >
        Load Saving Folder
      </button>
      <button onClick={handelDelSavingFolder}>Del Saving Folder</button>
    </div>
  );
}
