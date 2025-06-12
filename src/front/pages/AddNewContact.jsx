import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"
import { postNewContact, getContact, putContact } from "../services/contact.js"
import { addUser } from "../services/contact.js"
import storeReducer from "../store.js"


export const AddNewContact = () => {

  const { store, dispatch } = useGlobalReducer()

  const [contactName, setContactName] = useState('')
  const [contactPhoneNumber, setContactPhoneNumber] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactAdress, setContactAdress] = useState('')
  const navigate = useNavigate()

  const handleFullName = event => setContactName(event.target.value)
  const handleEmail = event => setContactEmail(event.target.value)
  const handlePhone = event => setContactPhoneNumber(event.target.value)
  const handleAddress = event => setContactAdress(event.target.value)

  const { id } = useParams()

  useEffect(() => {
    if (id) {
      const editContact = store.contacts.find(contact => contact.id === parseInt(id))
      if (editContact) {
        setContactName(editContact.name),
          setContactEmail(editContact.email),
          setContactPhoneNumber(editContact.phone),
          setContactAdress(editContact.address)
      }
    }
  }, [id])

  const handleSubmit = async (event) => {
    event.preventDefault()

    const userData = {
      name: contactName,
      phone: contactPhoneNumber,
      email: contactEmail,
      address: contactAdress,
    }

    if (
      !contactName.trim() &&
      !contactPhoneNumber.trim() &&
      !contactEmail.trim() &&
      !contactAdress.trim()
    ) {
      setContactName('')
      setContactPhoneNumber('')
      setContactEmail('')
      setContactAdress('')
      return
    }

    try {
      await addUser()

      if (id) {
        await putContact(id, userData)
        dispatch({ type: "EDIT_CONTACT", payload: id, ...userData })
      } else {
        await postNewContact(userData)
      }
      const newContact = await getContact()
      navigate("/contactslist")
      if (newContact) {
        dispatch({ type: "contacts", payload: newContact })
      }
    } catch (error) {
      console.error("Error en el formulario:", error);
    }
  }

  return (
    <div className="container m-auto my-5">
      <div className="d-flex justify-content-between align-items-center bg-warning p-4 rounded">
        <div className="col-md-6 pe-md-4">
          <form onSubmit={handleSubmit}>
            <div className="row mb-2">
              <div className="col-md-11 col-lg-10 col-xl-9">
                <label htmlFor="fullname" className="form-label">Nombre y Apellidos</label>
                <input onChange={handleFullName} id="fullname" type="text" className="form-control" value={contactName} placeholder="Introduce el nombre completo" />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-md-11 col-lg-10 col-xl-9">
                <label htmlFor="" className="form-label">Correo electrónico</label>
                <input onChange={handleEmail} type="email" className="form-control" value={contactEmail} placeholder="Introduce el email" />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-md-11 col-lg-10 col-xl-9">
                <label htmlFor="" className="form-label">Teléfono</label>
                <input onChange={handlePhone} type="tel" className="form-control" value={contactPhoneNumber} placeholder="Introduce el número de teléfono" />
              </div>
            </div>
            <div className="row">
              <div className="col-md-11 col-lg-10 col-xl-9">
                <label htmlFor="" className="form-label">Dirección</label>
                <input onChange={handleAddress} type="text" className="form-control" value={contactAdress} placeholder="Introduce la dirección postal" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary col-md-11 col-lg-10 col-xl-9 mt-4">Guardar</button>
          </form>
          <Link to="/contactslist">o regresa a tus contactos</Link>
        </div>
        <div className="col-md-6 d-none d-md-block ps-md-4">
          <img src="https://png.pngtree.com/png-vector/20240204/ourmid/pngtree-star-wars-png-free-download-png-image_11613003.png" alt="imagen de Star Wars" className="img-fluid rounded image-add-contact" />
        </div>
      </div>
    </div>
  )
}


// useNavigate()

// useParams()