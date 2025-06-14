import { NavItem } from "react-bootstrap"
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer"
import { getCurrentPlanet } from "../services/starwars.js";


export const PlanetCard = () => {

  const { id } = useParams()
  const { store, dispatch } = useGlobalReducer()
  const navigate = useNavigate()

  useEffect(() => {
    const getPlanet = async () => {
      const planet = await getCurrentPlanet(id)
      dispatch({ type: "planetCard", payload: planet })
    }
    getPlanet()
  }, [id])

  const hangleErrorImage = (event) => {
    event.target.src = "https://m.media-amazon.com/images/I/610s6UBlWgS.jpg"
  }

  const handleGoBack = () => {
    navigate('/planets')
  }

  return (
    <div className="bg-dark d-flex">
      <div className="container justify-content-center min-vh-100 m-auto mt-5">
        <div className="card mb-3">
          <div className="row g-0">
            <div className="col-md-4">
              <img src={`https://github.com/tbone849/star-wars-guide/blob/master/build/assets/img/planets/${id}.jpg?raw=true`} className="img-fluid rounded-start" alt="Un planeta de la saga Star Wars" onError={hangleErrorImage}/>
            </div>
            <div className="col-md-8 card-body background-card">
              <div>
                <h1 className="card-title mb-5">{store.planetCard.name}</h1>
                <p className="card-text"><span className="fw-bold">CLIMA:</span> {store.planetCard.climate}</p>
                <p className="card-text"><span className="fw-bold">TERRENO:</span> {store.planetCard.terrain}</p>
                <p className="card-text"><span className="fw-bold">DIAMETRO:</span> {store.planetCard.diameter}</p>
                <p className="card-text"><span className="fw-bold">DURACION DE ROTACIÓN:</span> {store.planetCard.rotation_period}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-end">
          <span onClick={handleGoBack} className="col-3 btn btn-outline-primary mt-5">
            Volver
          </span>
        </div>
      </div>
    </div>
  )
}