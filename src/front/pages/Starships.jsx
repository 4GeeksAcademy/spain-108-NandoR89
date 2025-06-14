import useGlobalReducer from "../hooks/useGlobalReducer"
import { Link, useNavigate } from "react-router-dom"
import storeReducer from "../store"

export const Starships = () => {

  const { store, dispatch } = useGlobalReducer()
  const navigate = useNavigate()

  const handleUniqueCard = (item) => {
    dispatch({ type: "currentCard", payload: item })
    navigate(`/starships/${item.uid}`)
  }

  const isFavorite = (starshipsName) => {
    return store.favorites.includes(starshipsName)
  }

  const handleFavorite = (item) => {
    dispatch({ type: "favorites", payload: item.name })
  }

  const handleErrorImage = (event) => {
    event.target.src = "https://spcdn.shortpixel.ai/spio/ret_img,q_cdnize,to_auto,s_webp:avif/www.cinemascomics.com/wp-content/uploads/2021/06/Ebon-Hawk.jpg"
  }

  return (
    <div className="bg-dark">
      <div className="container d-flex justify-content-center my-5">
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
          {
            store.starships.map((item) => (
              <div key={item.uid} class="col">
                <div class="card h-100">
                  <img src={`https://github.com/tbone849/star-wars-guide/blob/master/build/assets/img/starships/${item.uid}.jpg?raw=true`} onError={handleErrorImage} class="card-img-top" alt="Nave de Star Wars" />
                  <div class="card-body">
                    <h5 class="card-title">{item.name}</h5>
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