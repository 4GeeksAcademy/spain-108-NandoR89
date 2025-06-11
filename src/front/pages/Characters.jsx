import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import storeReducer from '../store';
import useGlobalReducer from '../hooks/useGlobalReducer.jsx';


export const Characters = () => {

  const { store } = useGlobalReducer()

  return (

    <div className="container d-flex justify-content-center gap-2 mt-5">
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
        {
          store.characters.map((item) => {
            return (
              <div class="col">
                <div key={item.uid} class="card h-100">
                  <img src={`https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/characters/${item.uid}.jpg`} class="card-img-top" alt="..." />
                  <div class="card-body">
                    <h5 class="card-title">{item.name}</h5>
                    <p class="card-text">URL: {item.url}</p>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}



