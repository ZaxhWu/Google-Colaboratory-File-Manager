import React, { useContext } from "react";
import context from "../context";

export default function Google_Colab() {
  const { inputs, setInputs } = useContext(context);

  const handleInputChange = (index, e) => {
    const newInputs = [...inputs];
    newInputs[index].value = e.target.value;
    setInputs(newInputs);
  };

  const handleAddCodeInput = () => {
    setInputs([...inputs, { type: "code", value: "" }]);
  };

  const handleAddNotesInput = () => {
    setInputs([...inputs, { type: "notes", value: "" }]);
  };

  const handleDeleteInput = (index) => {
    const newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData("text");
    const newInputs = [...inputs];
    const temp = newInputs[draggedIndex];
    newInputs[draggedIndex] = newInputs[index];
    newInputs[index] = temp;
    setInputs(newInputs);
  };

  return (
    <div>
      <h4>Code and Note</h4>
      <div>
        {inputs.map((input, index) => (
          <div
            key={index}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            style={{}}
          >
            {input.type === "code" ? (
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                  cursor: "grab",
                  border: "1px solid blue",
                }}
              >
                <div>Code</div>
                <textarea
                  style={{
                    width: "100%",
                    height: "80px",
                  }}
                  value={input.value}
                  onChange={(e) => handleInputChange(index, e)}
                />
                <div>
                  <button onClick={handleAddCodeInput}>Code</button>
                  <button onClick={handleAddNotesInput}>Note</button>
                  <button onClick={() => handleDeleteInput(index)}>-</button>
                </div>
              </div>
            ) : (
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                  cursor: "grab",
                  border: "1px solid green",
                }}
              >
                <div>Note</div>
                <textarea
                  style={{
                    width: "100%",
                    height: "80px",
                  }}
                  value={input.value}
                  onChange={(e) => handleInputChange(index, e)}
                />
                <div>
                  <button onClick={handleAddCodeInput}>Code</button>
                  <button onClick={handleAddNotesInput}>Note</button>
                  <button onClick={() => handleDeleteInput(index)}>-</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
