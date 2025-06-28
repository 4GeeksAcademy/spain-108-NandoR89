import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import storeReducer from '../store';
import useGlobalReducer from '../hooks/useGlobalReducer.jsx';
import { Link, useNavigate } from 'react-router-dom';

export const Characters = () => {

  const { store, dispatch } = useGlobalReducer()
  const navigate = useNavigate()

  const handleUniqueCard = (item) => {
    dispatch({type: "characterCard", payload: item })
    navigate(`/characters/${item.uid}`)
  }

  const isFavorite = (characterName) => {
    return store.favorites.includes(characterName)
  }

  const handleFavorite = (item) => {
    dispatch({ type: "favorites", payload: item.name })
  }

  const handleErrorImage = (event) => {
    event.target.src = "https://bloygo.yoigo.com/embed/06df78ef5e7a52369a260caf55561651650902/Guia-personajes-Star-Wars.jpg?imagick=1&size=1000"
  }

  return (
    <div className='bg-dark'>
      <div className="container d-flex justify-content-center gap-2 my-5">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
          {
            store.characters.map((item) => (
              <div key={item.uid} className="col">
                <div className="card h-100">
                  <img src={`https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/characters/${item.uid}.jpg`} onError={handleErrorImage} className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                  </div>
                  <div className="d-flex justify-content-between p-3">
                      <span onClick={() => handleUniqueCard(item)}  className="btn btn-primary">
                        Ver Ficha
                      </span>
                    <button onClick={() => handleFavorite(item)} className="btn btn-secondary rounded">
                      <i class={`fa-solid fa-star ${isFavorite(item.name) ? "text-warning" : ""} `}></i>
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



