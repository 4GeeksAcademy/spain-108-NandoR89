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
    <div className="container-fluid mb-5">
      <div className="text-center mt-5">
        <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            <div class="carousel-item active">
              <img src="https://i.blogs.es/2cc78a/ordenstarwars/1366_2000.jpg" class="d-block w-100" alt="..." />
            </div>
            <div class="carousel-item">
              <img src="https://sm.ign.com/t/ign_latam/screenshot/default/m4_s2py.1280.jpg" class="d-block w-100" alt="..." />
            </div>
            <div class="carousel-item">
              <img src="https://imagenes.20minutos.es/files/image_990_556/uploads/imagenes/2021/01/10/saga.jpeg" class="d-block w-100" alt="..." />
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
  );
}; 