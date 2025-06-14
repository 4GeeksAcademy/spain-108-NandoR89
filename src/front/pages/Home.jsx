import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {

  const { store, dispatch } = useGlobalReducer()

  const loadMessage = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL

      if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

      const response = await fetch(backendUrl + "/api/hello")
      const data = await response.json()

      if (response.ok) dispatch({ type: "set_hello", payload: data.message })

      return data

    } catch (error) {
      if (error.message) throw new Error(
        `Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
      );
    }

  }

  useEffect(() => {
    loadMessage()
  }, [])

  return (
    <div className="bg-dark">
      <div className="container mb-5 min-vh-100 m-auto">
        <div className="text-center mt-5">
          <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img src="https://m.media-amazon.com/images/I/71OnL9mzN4L._AC_SY879_.jpg" class="d-block w-50 mx-auto" alt="Primera película" />
              </div>
              <div class="carousel-item">
                <img src="https://m.media-amazon.com/images/I/61tcoH8SYRL._AC_SY879_.jpg" class="d-block w-50 mx-auto" alt="Segunda película" />
              </div>
              <div class="carousel-item">
                <img src="https://m.media-amazon.com/images/I/61c7U8DqV3L._AC_SY879_.jpg" class="d-block w-50 mx-auto" alt="Tercera película" />
              </div>
              <div class="carousel-item">
                <img src="https://m.media-amazon.com/images/I/61+lrYp-EIL._AC_SY300_SX300_.jpg" class="d-block w-50 mx-auto" alt="Cuarta película" />
              </div>
              <div class="carousel-item">
                <img src="https://m.media-amazon.com/images/I/61vPfJJdjbL._AC_SY879_.jpg" class="d-block w-50 mx-auto" alt="Quinta película" />
              </div>
              <div class="carousel-item">
                <img src="https://m.media-amazon.com/images/I/71MKj4j-isL.__AC_SX300_SY300_QL70_ML2_.jpg" class="d-block w-50 mx-auto" alt="Sexta película" />
              </div>
              <div class="carousel-item">
                <img src="https://m.media-amazon.com/images/I/8104RMlgxWL._AC_SY879_.jpg" class="d-block w-50 mx-auto" alt="Séptima película" />
              </div>
              <div class="carousel-item">
                <img src="https://m.media-amazon.com/images/I/814vN545qRL._AC_SY879_.jpg" class="d-block w-50 mx-auto" alt="Octava película" />
              </div>
              <div class="carousel-item">
                <img src="https://static.posters.cz/image/750webp/81802.webp" class="d-block w-50 mx-auto" alt="Novena película" />
              </div>
              <div class="carousel-item">
                <img src="https://pics.filmaffinity.com/solo_a_star_wars_story-540929627-large.jpg" class="d-block w-50 mx-auto" alt="Décima película" />
              </div>
              <div class="carousel-item">
                <img src="https://www.originalfilmart.com/cdn/shop/products/rogue_one_2016_intl_original_film_art_5000x.jpg?v=1569448809" class="d-block w-50 mx-auto" alt="Decimoprimera película" />
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 