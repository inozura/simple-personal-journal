import React, { useState } from "react";
import BootstrapTable from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import moment from "moment";
import Modal from "./Modal";

const Table = ({ data, handleFilterDelete }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [dataActive, setDataActive] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClickDelete = (dataJournal) => {
    setDataActive(dataJournal);
    setShowDialog(true);
  };

  const handleClose = () => {
    setDataActive(null);
    setShowDialog(false);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/journal/${dataActive.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 200) {
        setIsLoading(false);
        handleFilterDelete(dataActive.id);
        handleClose();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <BootstrapTable>
        <thead>
          <tr>
            <th>Title</th>
            <th>Body</th>
            <th>Journal</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((journal) => (
            <tr>
              <td>{journal.title}</td>
              <td>{journal.description}</td>
              <td>{moment(journal.updated_at).format("YYYY-MM-DD")}</td>
              <td>
                <div className="d-flex d-flex align-items-center">
                  <Link
                    className="btn btn-primary me-2"
                    to={`/detail/${journal.id}`}
                  >
                    View
                  </Link>
                  <Link
                    className="btn btn-primary me-2"
                    to={`/edit/${journal.id}`}
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleClickDelete(journal)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </BootstrapTable>

      {showDialog && (
        <Modal
          handleClose={handleClose}
          data={dataActive}
          show={showDialog}
          isLoading={isLoading}
          handleYes={handleDelete}
        />
      )}
    </>
  );
};

export default Table;
