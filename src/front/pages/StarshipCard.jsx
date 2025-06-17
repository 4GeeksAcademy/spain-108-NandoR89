import { NavItem } from "react-bootstrap"
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer"
import { getCurrentStarship } from "../services/starwars.js";


export const StarshipCard = () => {

  const { id } = useParams()
  const { store, dispatch } = useGlobalReducer()
  const navigate = useNavigate()

  useEffect(() => {
    const getStarship = async () => {
      const starship = await getCurrentStarship(id)
      dispatch({ type: "starshipCard", payload: starship })
    }
    getStarship()
  }, [id])

  const handleErrorImage = (event) => {
    event.target.src = "https://spcdn.shortpixel.ai/spio/ret_img,q_cdnize,to_auto,s_webp:avif/www.cinemascomics.com/wp-content/uploads/2021/06/Ebon-Hawk.jpg"
  }

  const handleGoBack = () => {
    navigate('/starships')
  }

  return (
    <div className="bg-dark d-flex">
      <div className="container min-vh-100 m-auto mt-5">
        <div className="card mb-3">
          <div className="row g-0">
            <div className="col-md-4">
              <img src={`https://github.com/tbone849/star-wars-guide/blob/master/build/assets/img/starships/${id}.jpg?raw=true`} className="img-fluid rounded-start" alt="Una nave espacial" onError={handleErrorImage} />
            </div>
            <div className="col-md-8 background-card">
              <div className="card-body">
                <h1 className="card-title mb-5">{store.starshipCard.name}</h1>
                <p className="card-text"><span className="fw-bold">MODELO:</span> {store.starshipCard.model}</p>
                <p className="card-text"><span className="fw-bold">FABRICANTE:</span> {store.starshipCard.manufacturer}</p>
                <p className="card-text"><span className="fw-bold">CAPACIDAD DE TRIPULANTES:</span> {store.starshipCard.passengers}</p>
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