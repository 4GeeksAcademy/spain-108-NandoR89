import useGlobalReducer from '../hooks/useGlobalReducer.jsx';
import { Link } from 'react-router-dom';
import { useState } from "react";


export const Planets = () => {

  const { store, dispatch } = useGlobalReducer()

  const handleFavorite = (item) => {
      dispatch({type: "favorites", payload: item.name})
  }

  return (
    <div className="bg-dark">
      <div className="container d-flex justify-content-center my-5">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
          {
            store.planets.map((item) => (
                <div key={item.uid} className="col">
                  <div className="card h-100">
                    <img src="https://static.wikia.nocookie.net/esstarwars/images/e/ee/Iego.jpg/revision/latest/thumbnail/width/360/height/360?cb=20190720040332" className="card-img-top" alt="..." />
                    <div className="card-body">
                      <h5 className="card-title">{item.name}</h5>
                      <p className="card-text">URL: {item.url}</p>
                    </div>
                    <div className="d-flex justify-content-between p-3">
                      <Link to='/planets/:id'>
                        <span className="btn btn-primary">
                          Ver Ficha
                        </span>
                      </Link>
                      <button onClick={() => handleFavorite(item)} className="btn btn-secondary rounded">
                        <i class="fa-solid fa-star"></i>
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