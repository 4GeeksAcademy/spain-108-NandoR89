import { Link } from "react-router-dom"

export const Contact = () => {

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-end">
        <Link to="/addnewcontact" className="btn btn-success m-2">
          Add New Contact
        </Link>
      </div>
      <div className="card my-3">
        <div className="row g-0">
          <div className="col-md-4">
            <img src="..." className="img-fluid rounded-start" alt="..." />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">Card title</h5>
              <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
              <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p>
            </div>
          </div>
        </div>
      </div>
    </div>


  )
}