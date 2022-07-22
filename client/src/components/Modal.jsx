import React from "react";
import Button from "react-bootstrap/Button";
import BSModal from "react-bootstrap/Modal";

const Modal = ({ show, handleClose, handleYes, data, isLoading }) => {
  console.log(data);
  return (
    <BSModal show={show} onHide={() => handleClose()}>
      <BSModal.Header closeButton>
        <BSModal.Title>Delete</BSModal.Title>
      </BSModal.Header>
      <BSModal.Body>
        Did you realy want to delete <b>{data?.title}</b>
      </BSModal.Body>
      <BSModal.Footer>
        <Button variant="secondary" onClick={() => handleClose()}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => handleYes()}
          disabled={isLoading}
        >
          Save Changes
        </Button>
      </BSModal.Footer>
    </BSModal>
  );
};

export default Modal;
