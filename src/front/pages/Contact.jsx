import { useState } from "react"
import { Link } from "react-router-dom"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export const Contact = (item) => {

  const defaultImage = "https://images.unsplash.com/photo-1748444406895-c284c355e2ef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  const imageUrl = item?.image ? item.image : defaultImage

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleEdit = () => {
  }

  const handleDelete = () => {
    setShowModal(true)
  }

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-end">
        <Link to="/addnewcontact" className="btn btn-success m-2">
          Add New Contact
        </Link>
      </div>
      <div key={item.id} className="card my-3">
        <div className="row g-0">
          <div className="col-md-4 text-center m-auto">
            <img src={imageUrl} className="img-fluid rounded-circle w-75 h-75" alt="..." />
          </div>
          <div className="col-md-8 d-flex">
            <div className="card-body">
              <h5 className="card-title">Full Name</h5>
              <p className="card-text">Address</p>
              <p className="card-text">Phone</p>
              <p className="card-text">Email</p>
            </div>
            <div className="mt-3 me-3">
              <i onClick={handleEdit} className="fa-solid fa-pen-to-square fa-xl me-3" style={{ cursor: "pointer" }}></i>
              <i onClick={handleShow} className="fa-solid fa-trash fa-xl" style={{ cursor: "pointer" }}></i>
            </div>
            {show && (
              <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Eliminar Contacto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Estás seguro de querer eliminar este contacto?
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                  </Button>
                  <Button onClick={handleDelete} variant="danger">Eliminar</Button>
                </Modal.Footer>
              </Modal>
            )
            }
          </div>
        </div>
      </div>
    </div>
  )
}