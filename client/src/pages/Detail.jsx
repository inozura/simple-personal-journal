import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Modal from "../components/Modal";

const Detail = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotfound, setIsNotfound] = useState(false);
  const [isShowDialogDelete, setIsShowDialogDelete] = useState(false);

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
        setData(await response.json());
        setIsLoading(false);
      }
      if (response.status === 404) {
        setIsNotfound(true);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (isLoading) {
      fetchData();
    }
  }, []);

  if (isNotfound)
    return (
      <div
        style={{
          height: "100vh",
          width: "100wh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h1 style={{ textAlign: "center" }}>404</h1>
        <p style={{ textAlign: "center" }}>Data Not Found in the Database</p>

        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );

  return isLoading ? (
    <div
      style={{
        height: "100vh",
        width: "100wh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span>Loading...</span>
    </div>
  ) : (
    <>
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="inline-block">Personal Journal</h4>
          <Link className="btn btn-primary" to="/new">
            Create
          </Link>
        </div>

        <div style={{ width: "60vw" }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="inline-block">Title: {data.title}</p>
            <p className="inline-block">
              Journal Date: {moment(data.updated_at).format("YYYY-MM-DD")}
            </p>
          </div>

          {/* Content */}
          <p>Body</p>
          <p>{data.description}</p>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="inline-block">
              Date created: {moment(data.updated_at).format("YYYY-MM-DD")}
            </p>
            {/* <button className="btn btn-danger">Delete</button> */}
          </div>
        </div>
      </div>

      {/* <Modal
        handleClose={handleClose}
        data={dataActive}
        show={showDialog}
        isLoading={isLoading}
        handleYes={handleDelete}
      /> */}
    </>
  );
};

export default Detail;
