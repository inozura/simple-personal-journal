import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";

const Edit = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(Date.now());
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Get params from URL
  let { id } = useParams();

  if (!id) {
    return navigate("/");
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
        setDate(moment(data.date).format("YYYY-MM-DD"));
        setDescription(data.description);
        setIsLoading(false);
      }

      if (response.status === 404) {
        return navigate("/");
      }
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
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
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          date: date,
        }),
      });

      if (response.status === 200) {
        setIsLoading(false);
        return navigate("/");
      }
    } catch (error) {
      console.log("error", error);
      setIsLoading(true);
    }
  };

  return (
    <div className="container mt-5" style={{ width: "60vw" }}>
      <h4 className="inline-block">Personal Journal</h4>

      <div className="mb-3">
        <div className="d-flex flex-row">
          <div className="me-2">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="titleinput"
              name="titleinput"
              value={title}
              onChange={(e) => handleChange(e.target.id, e.target.value)}
            />
          </div>
          <div className="ms-2">
            <label className="form-label">Journal Date</label>
            <input
              type="date"
              className="form-control"
              id="dateinput"
              name="dateinput"
              value={date}
              onChange={(e) => handleChange(e.target.id, e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Body</label>
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
