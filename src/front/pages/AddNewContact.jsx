import { useState } from "react"


export const AddNewContact = () => {

    const [contactName, setContactName] = useState('')
    const [contactPhoneNumber, setContactPhoneNumber] = useState('')
    const [contactEmail, setContactEmail] = useState('')
    const [contactAdress, setContactAdress] = useState('')

    const handleFullName = event => setContactName(event.target.value)
    const handleEmail = event => setContactEmail(event.target.value)
    const handlePhone = event => setContactPhoneNumber(event.target.value)
    const handleAddress = event => setContactAdress(event.target.value)

    const handleSubmit = (event) => {
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
        </div>
    )
}