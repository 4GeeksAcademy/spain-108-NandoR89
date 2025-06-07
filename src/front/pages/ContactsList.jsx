import { useState } from "react"
import { Link } from "react-router-dom"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import useGlobalReducer from "../hooks/useGlobalReducer"


export const ContactsList = (item) => {

  const { store } = useGlobalReducer()

  const defaultImage = "https://images.unsplash.com/photo-1748444406895-c284c355e2ef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  const imageUrl = item?.image ? item.image : defaultImage

  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleEdit = () => {
  }

  const handleDelete = () => {
    setShowModal(true)
  }

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-end">
        <Link to="/addnewcontact" className="btn btn-warning m-2">
          Añade un nuevo contacto
        </Link>
      </div>
      {store.contacts.map((item) =>
        <div key={item.id} className="card my-3">
          <div className="row g-0">
            <div className="col-md-4 text-center m-auto">
              <img src={imageUrl} className="img-fluid rounded-circle w-75 h-75" alt="..." />
            </div>
            <div className="col-md-8 d-flex">
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <div className="d-flex align-items-center gap-2">
                  <i class="fa-solid fa-location-dot"></i>
                  <p className="card-text">{item.address}</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                <i class="fa-solid fa-phone"></i>
                <p className="card-text">{item.phone}</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                <i class="fa-solid fa-envelope"></i>
                <p className="card-text">{item.email}</p>
                </div>
              </div>
              <div className="mt-3 me-3">
                <i onClick={handleEdit} className="fa-solid fa-pen-to-square fa-xl me-3" style={{ cursor: "pointer" }}></i>
                <i onClick={handleShow} className="fa-solid fa-trash fa-xl" style={{ cursor: "pointer" }}></i>
              </div>
              {showModal && (
                <Modal
                  show={showModal}
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
      )}
    </div>
  )
}