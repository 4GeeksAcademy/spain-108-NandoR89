import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import storeReducer from '../store';
import useGlobalReducer from '../hooks/useGlobalReducer.jsx';
import { Link, useNavigate } from 'react-router-dom';


export const Planets = () => {

  const { store, dispatch } = useGlobalReducer()
  const navigate = useNavigate()

  const handleUniqueCard = (item) => {
    dispatch({type: "currentCard", payload: item })
    navigate(`/planets/${item.uid}`)
  }

  const isFavorite = (planetName) => {
    return store.favorites.includes(planetName)
  }

  const handleFavorite = (item) => {
    dispatch({ type: "favorites", payload: item.name })
  }

    const handleErrorImage = (event) => {
    event.target.src = "https://m.media-amazon.com/images/I/610s6UBlWgS.jpg"
  }

  return (
    <div className="bg-dark">
      <div className="container d-flex justify-content-center my-5">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
          {
            store.planets.map((item) => (
              <div key={item.uid} className="col">
                <div className="card h-100">
                  <img src={`https://github.com/tbone849/star-wars-guide/blob/master/build/assets/img/planets/${item.uid}.jpg?raw=true`} onError={handleErrorImage} className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                  </div>
                  <div className="d-flex justify-content-between p-3">
                    <span onClick={() => handleUniqueCard(item)} className="btn btn-primary">
                      Ver Ficha
                    </span>
                    <button onClick={() => handleFavorite(item)} className="btn btn-secondary rounded">
                      <i class={`fa-solid fa-star ${isFavorite(item.name) ? "text-warning" : ""}`}></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}