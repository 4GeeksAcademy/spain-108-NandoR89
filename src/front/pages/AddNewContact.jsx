import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"
import { postNewContact } from "../services/contact.js"
import { addUser } from "../services/contact.js"
import { getContact } from "../services/contact.js"


export const AddNewContact = () => {

  const { dispatch } = useGlobalReducer()

  const [contactName, setContactName] = useState('')
  const [contactPhoneNumber, setContactPhoneNumber] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactAdress, setContactAdress] = useState('')
  const navigate = useNavigate()

  const handleFullName = event => setContactName(event.target.value)
  const handleEmail = event => setContactEmail(event.target.value)
  const handlePhone = event => setContactPhoneNumber(event.target.value)
  const handleAddress = event => setContactAdress(event.target.value)

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
      await postNewContact(userData)
      const newContact = await getContact()
      navigate("/contactslist")
      if (newContact) {
        dispatch({type: "contacts", payload: newContact})
      }      
      
    } catch (error) {
      console.error("Error en el formulario:", error);
    }
  }

  return (
    <div className="container m-auto">
      <form onSubmit={handleSubmit}>
        <div className="row mb-2">
          <div className="col-md-10 col-lg-8 col-xl-6">
            <label htmlFor="fullname" className="form-label">Nombre y Apellidos</label>
            <input onChange={handleFullName} id="fullname" type="text" className="form-control" value={contactName} placeholder="Introduce el nombre completo" />
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-md-10 col-lg-8 col-xl-6">
            <label htmlFor="" className="form-label">Correo electrónico</label>
            <input onChange={handleEmail} type="email" className="form-control" value={contactEmail} placeholder="Introduce el email" />
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-md-10 col-lg-8 col-xl-6">
            <label htmlFor="" className="form-label">Teléfono</label>
            <input onChange={handlePhone} type="tel" className="form-control" value={contactPhoneNumber} placeholder="Introduce el número de teléfono" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-10 col-lg-8 col-xl-6">
            <label htmlFor="" className="form-label">Dirección</label>
            <input onChange={handleAddress} type="text" className="form-control" value={contactAdress} placeholder="Introduce la dirección postal" />
          </div>
        </div>
        <button type="submit" className="btn btn-primary col-12 col-md-10 col-lg-8 col-xl-6 mt-4">Guardar</button>
      </form>
      <Link to="/contactslist">o regresa a tus contactos</Link>
    </div>
  )
}


// useNavigate()

// useParams()