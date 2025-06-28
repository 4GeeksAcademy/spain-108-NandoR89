import { getCurrentCharacter } from "../services/starwars";
import { NavItem } from "react-bootstrap"
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer"


export const CharacterCard = () => {

  const { id } = useParams()
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate()

  useEffect(() => {
    const getCharacter = async () => {
      const character = await getCurrentCharacter(id)
      dispatch({ type: "characterCard", payload: character })
    }
    getCharacter()
  }, [id])

  const handleGoBack = () => {
    navigate('/characters')
  }

  return (
    <div className="bg-dark d-flex">
      <div className="container justify-content-center min-vh-100 m-auto mt-5">
        <div className="card mb-3">
          <div className="row g-0">
            <div className="col-md-4">
              <img src={`https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/characters/${id}.jpg`} className="img-fluid rounded-start" alt={`${store.characterCard.uid}`} />
            </div>
            <div className="col-md-8 background-card">
              <div className="card-body">
                <h1 className="card-title mb-5">{store.characterCard.name}</h1>
                <p className="card-text"><span className="fw-bold">GÉNERO: </span>{store.characterCard.gender}</p>
                <p className="card-text"><span className="fw-bold">AÑO DE NACIMIENTO: </span>{store.characterCard.birth_year}</p>
                <p className="card-title mb-3"><span className="fw-bold">Altura: </span>{store.characterCard.height}cm</p>
                <p className="card-text"><span className="fw-bold">MASA: </span>{store.characterCard.mass}</p>
                <p className="card-text"><span className="fw-bold">COLOR DE OJOS: </span>{store.characterCard.eye_color}</p>
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