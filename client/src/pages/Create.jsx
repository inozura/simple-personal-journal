import React, { useState } from "react";
import { Navigate } from "react-router-dom";

const Create = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(Date.now());
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (id, value) => {
    if (id === "titleinput") setTitle(value);
    if (id === "dateinput") setDate(value);
    if (id === "descriptioninput") setDescription(value);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`http://localhost:5000/api/journal`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          date,
        }),
      });

      if (response.status === 200) {
        return <Navigate to="/" replace />;
      }
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ width: "60vw" }}>
      <h4 className="inline-block">Personal Journal</h4>

      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          type="text"
          className="form-control"
          id="titleinput"
          name="titleinput"
          onChange={(e) => handleChange(e.target.id, e.target.value)}
        />

        <label className="form-label">Journal Date</label>
        <input
          type="date"
          className="form-control"
          id="dateinput"
          name="dateinput"
          onChange={(e) => handleChange(e.target.id, e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Body</label>
        <textarea
          className="form-control"
          id="descriptioninput"
          name="descriptioninput"
          rows="3"
          onChange={(e) => handleChange(e.target.id, e.target.value)}
        />
      </div>

      <button
        type="button"
        className="btn btn-primary"
        disabled={isLoading}
        onClick={() => handleSave()}
      >
        Save
      </button>
    </div>
  );
};

export default Create;
