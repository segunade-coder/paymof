import React from "react";
import "./modal.css";
const ModalCont = ({ children, title, save, classModal, btn }) => {
  let closeModal = () => {
    document
      .getElementsByClassName(classModal)[0]
      .classList.remove("show-modal");
    document.body.style.overflow = "auto";
    document.body.style.top = "";
  };
  return (
    <div className={"__modal-container " + classModal}>
      <div className="modal-body">
        <div className="header">
          <h4 className="title h3">{title}</h4>
        </div>
        <div className="content">{children}</div>
        <footer>
          <div className="btn-cont">
            <button
              onClick={(e) => closeModal()}
              className="btn btn-danger btn-sm"
            >
              Close
            </button>
            <button onClick={(e) => save()} className="btn btn-success btn-sm">
              {btn ? btn : "Save"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ModalCont;
