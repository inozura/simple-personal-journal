import React, { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

const Edit = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(Date.now());
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get params from URL
  let { id } = useParams();

  if (!id) {
    return <Navigate to="/" />;
  }

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`http://localhost:5000/api/journal/${id}`, {
        method: "GET",
      });

      if (response.status === 200) {
        const data = await response.json();
        setTitle(data.title);
        setDate(data.date);
        setDescription(data.description);
        setIsLoading(false);
      }

      if (response.status === 404) {
        <Navigate to="/not-found" />;
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (id, value) => {
    if (id === "titleinput") setTitle(value);
    if (id === "dateinput") setDate(value);
    if (id === "descriptioninput") setDescription(value);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`http://localhost:5000/api/journal/${id}`, {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          date,
        }),
      });

      if (response.status === 200) {
        setIsLoading(false);
        <Navigate to="/" />;
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="container mt-5" style={{ width: "60wh" }}>
      <h4 className="inline-block">Personal Journal</h4>

      <div className="mb-3">
        <label for="titleinput" className="form-label">
          Title
        </label>
        <input
          type="text"
          className="form-control"
          id="titleinput"
          name="titleinput"
          value={title}
          onChange={(e) => handleChange(e.target.id, e.target.value)}
        />

        <label for="dateinput" className="form-label">
          Journal Date
        </label>
        <input
          type="date"
          className="form-control"
          id="dateinput"
          name="dateinput"
          value={date}
          onChange={(e) => handleChange(e.target.id, e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label for="descriptioninput" className="form-label">
          Body
        </label>
        <textarea
          className="form-control"
          id="descriptioninput"
          name="descriptioninput"
          rows="3"
          value={description}
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

export default Edit;
