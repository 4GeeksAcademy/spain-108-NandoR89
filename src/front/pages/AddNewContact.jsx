import { useState } from "react"
import { Link } from "react-router-dom"


export const AddNewContact = () => {

  const userName = "Eva123"
  const host = `https://playground.4geeks.com/contact/agendas`
  const getUrl = `${host}/${userName}`
  const postUrlUser = `${host}/${userName}`
  const postUrlContacts = `${host}/${userName}/contacts`

  const [contactName, setContactName] = useState('')
  const [contactPhoneNumber, setContactPhoneNumber] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactAdress, setContactAdress] = useState('')
  const [contacts, setContacts] = useState([])

  const handleFullName = event => setContactName(event.target.value)
  const handleEmail = event => setContactEmail(event.target.value)
  const handlePhone = event => setContactPhoneNumber(event.target.value)
  const handleAddress = event => setContactAdress(event.target.value)

  const postNewContact = async (userData) => {
    try {
      const response = await fetch(postUrlContacts, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      })
      if (!response.ok) {
        console.error("Error al añadir el contacto: ", response.status)
        throw error
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error al crear el contacto", error.message)
    }
  }

  // const getContact = async () => {
  //   try {
  //     const response = await fetch(getUrl)
  //     if (!response.ok) {
  //       console.error(`${response.status}`)
  //     }
  //     const data = await response.json()
  //     return data
  //   }
  //   catch (error) {
  //     console.error('Error al importar los contactos: ', error.message)
  //   }
  //   }
  //   getContact()

  const addUser = async () => {
    try {
      const checkUser = await fetch(getUrl)
      if (checkUser.status === 404) {
        const createUser = await fetch(getUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        })
        if (!createUser.ok) {
          console.error("Error al crear el usuario")
        }
      }
    }
    catch (error) {
      console.error("Error en verificar el usuario", error)
    }
  }

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

      setContactName('')
      setContactPhoneNumber('')
      setContactEmail('')
      setContactAdress('')
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
            <input onChange={handleFullName} id="fullname" type="text" className="form-control" value={contactName} placeholder="Introduce tu nombre completo" />
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-md-10 col-lg-8 col-xl-6">
            <label htmlFor="" className="form-label">Correo electrónico</label>
            <input onChange={handleEmail} type="email" className="form-control" value={contactEmail} placeholder="Introduce tu email" />
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-md-10 col-lg-8 col-xl-6">
            <label htmlFor="" className="form-label">Teléfono</label>
            <input onChange={handlePhone} type="tel" className="form-control" value={contactPhoneNumber} placeholder="Introduce tu número de teléfono" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-10 col-lg-8 col-xl-6">
            <label htmlFor="" className="form-label">Dirección</label>
            <input onChange={handleAddress} type="text" className="form-control" value={contactAdress} placeholder="Introduce tu dirección postal" />
          </div>
        </div>
        <button type="submit" className="btn btn-primary col-12 col-md-10 col-lg-8 col-xl-6 mt-4">Guardar</button>
      </form>
      <Link to="/contact">o regresa a tus contactos</Link>
    </div>
  )
}