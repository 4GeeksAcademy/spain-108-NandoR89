import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import storeReducer from '../store';
import useGlobalReducer from '../hooks/useGlobalReducer.jsx';


export const Characters = () => {

  const { store } = useGlobalReducer()

  return (
    <div className='bg-dark'>
    <div className="container d-flex justify-content-center gap-2 my-5">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
        {
          store.characters.map((item) => {
            return (
              <div className="col">
                <div key={item.uid} className="card h-100">
                  <img src={`https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/characters/${item.uid}.jpg`} className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">URL: {item.url}</p>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
    </div>


  )
}



