import { useState } from "react"
import { Link } from "react-router-dom"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import useGlobalReducer from "../hooks/useGlobalReducer";
import { deleteContact } from "../services/contact";


export const ContactsList = (prop) => {

  const { store, dispatch } = useGlobalReducer()
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null)

  const handleErrorImage = (event) => {
    event.target.src = "https://e7.pngegg.com/pngimages/69/525/png-clipart-star-wars-yoda-illustration-yoda-emoji-star-wars-sticker-emoji-superhero-war-thumbnail.png"
  }

  const handleClose = () => setShowModal(false);
  const handleShow = (item) => {
    setSelectedContact(item);
    setShowModal(true)
  }

  const handleDelete = async () => {
    try {
      const result = await deleteContact(selectedContact)
      if (result) {
        dispatch({ type: "DELETE_CONTACT", payload: selectedContact.id });
      }
      setShowModal(false)
      setSelectedContact(null)
    } catch (error) {
      console.error("Error al eliminar: ", error)
    }
  }

  return (
    <div className="bg-dark">
      <div className="container min-vh-100 mt-5">
        <div className="d-flex justify-content-end">
          <Link to="/addnewcontact" className="btn btn-warning m-2">
            Añade un nuevo contacto
          </Link>
        </div>
        <div>
          <h1 className="text-light">Mi Agenda</h1>
        </div>
        {store.contacts.map((item, index) => {
          const backgroundColor = index % 2 === 0 ? "secondary" : "secondary-subtle"
          return (
            <div key={item.id} className={`card my-3 bg-${backgroundColor}`}>
              <div className="row g-0">
                <div className="col-md-4 text-center m-auto">
                  <img
                    src={`https://randomuser.me/api/portraits/women/${item.id}.jpg`}
                    className="img-fluid rounded-circle"
                    style={{ height: "150px", width: "150px" }}
                    alt="Imagen de contacto"
                    onError={handleErrorImage}
                  />
                </div>
                <div className="col-md-8 d-flex">
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <div className="d-flex align-items-center gap-2">
                      <i className="fa-solid fa-location-dot"></i>
                      <p className="card-text">{item.address}</p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <i className="fa-solid fa-phone"></i>
                      <p className="card-text">{item.phone}</p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <i className="fa-solid fa-envelope"></i>
                      <p className="card-text">{item.email}</p>
                    </div>
                  </div>
                  <div className="mt-3 me-3">
                    <Link to={`/editcontact/${item.id}`}>
                      <i className="fa-solid fa-pen-to-square fa-xl text-primary me-3" style={{ cursor: "pointer" }}></i>
                    </Link>
                    <i
                      onClick={() => handleShow(item)}
                      className="fa-solid fa-trash fa-xl text-danger"
                      style={{ cursor: "pointer" }}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        {showModal && (
          <Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
              <Modal.Title>Eliminar Contacto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              ¿Estás seguro de querer eliminar este contacto?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cerrar
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Eliminar
              </Button>
            </Modal.Footer>
          </Modal>
        )}
        <div className="text-center text-bg-light rounded">
          {!store.contacts.length ? (
            <p>No tienes ningún contacto.</p>
          ) : store.contacts.length === 1 ? (
            <p>Tienes 1 contacto</p>
          ) : (
            <p>Tienes {store.contacts.length} contactos</p>
          )}
        </div>
      </div>
    </div>
  )
}