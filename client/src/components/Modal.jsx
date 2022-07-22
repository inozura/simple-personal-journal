import React from "react";
import Button from "react-bootstrap/Button";

const Modal = ({ show, handleClose, handleYes, data, isLoading }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>Did you realy want to delete {data?.title}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleYes} disabled={isLoading}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Modal;
