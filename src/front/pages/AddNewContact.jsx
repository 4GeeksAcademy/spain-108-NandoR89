import { useState } from "react"
import { Link } from "react-router-dom"


export const AddNewContact = () => {

  const userName = "NandoR89"
  const host = 'https://playground.4geeks.com/contact'
  const getUrl = `${host}/agendas/${userName}`
  const postUrlUser = `${host}/agendas/${userName}`
  const postUrl = `${host}/agendas/${userName}/contacts`


  const [contactName, setContactName] = useState('')
  const [contactPhoneNumber, setContactPhoneNumber] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactAdress, setContactAdress] = useState('')
  const [contacts, setContacts] = useState([])

  const handleFullName = event => setContactName(event.target.value)
  const handleEmail = event => setContactEmail(event.target.value)
  const handlePhone = event => setContactPhoneNumber(event.target.value)
  const handleAddress = event => setContactAdress(event.target.value)

  const getContacts = async () => {
    try {
      const response = await fetch(getUrl)
      if (!response.ok && response.status === 404) {
        addUser()
        return
      }
      const data = await response.json()
      setContacts(Array.isArray(data) ? data : data.contacts || [])
    } catch (error) {
      console.error("Error al cargar las tareas", error)
    }
  }

  const addUser = async () => {
    try {
      const response = await fetch(postUrlUser, {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (response.ok) {
        getContacts()
      }
    } catch (error) {
      console.error("Error al crear el contacto", error)
    }
  }


  const handleSubmit = async (event) => {
    event.preventDefault()

    setContactName('')
    setContactPhoneNumber('')
    setContactEmail('')
    setContactAdress('')
  }

  return (
    <div className="container m-auto">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-10 col-lg-8 col-xl-6">
            <label htmlFor="fullname" className="form-label">Full Name</label>
            <input onChange={handleFullName} id="fullname" type="text" className="form-control" value={contactName} placeholder="Enter full name" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-10 col-lg-8 col-xl-6">
            <label htmlFor="" className="form-label">Email</label>
            <input onChange={handleEmail} type="email" className="form-control" value={contactEmail} placeholder="Enter email" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-10 col-lg-8 col-xl-6">
            <label htmlFor="" className="form-label">Phone</label>
            <input onChange={handlePhone} type="tel" className="form-control" value={contactPhoneNumber} placeholder="Enter phone" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-10 col-lg-8 col-xl-6">
            <label htmlFor="" className="form-label">Address</label>
            <input onChange={handleAddress} type="text" className="form-control" value={contactAdress} placeholder="Enter address" />
          </div>
        </div>
        <button type="submit" className="btn btn-primary col-12 col-md-10 col-lg-8 col-xl-6 mt-4">Save</button>
      </form>
      <Link to="/contact">or get back to contact</Link>
    </div>
  )
}