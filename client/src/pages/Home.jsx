import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../components/Table";

const Home = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`http://localhost:5000/api/journal`, {
        method: "GET",
      });

      if (response.status === 200) {
        const jsonData = await response.json();
        console.log("jsonData", jsonData);
        setData(jsonData);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterDelete = (id) => {
    setData(data?.filter((journal) => journal.id !== id));
  };

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
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="inline-block">Personal Journal</h4>
        <Link className="btn btn-primary" to="/create">
          Create
        </Link>
      </div>

      {data?.length > 0 ? (
        <Table data={data} handleFilterDelete={handleFilterDelete} />
      ) : (
        <>
          <h2 style={{ textAlign: "center" }}>Data is Null</h2>
          <p style={{ textAlign: "center" }}>
            Add Data use Button in the Right page
          </p>
        </>
      )}
    </div>
  );
};

export default Home;
