import useGlobalReducer from '../hooks/useGlobalReducer.jsx';


export const Planets = () => {

  const { store } = useGlobalReducer()

  return (
    <div className="bg-dark">
      <div className="container d-flex justify-content-center my-5">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
          {
            store.planets.map((item) => {
              return (
                <div className="col">
                  <div className="card h-100">
                    <img src="https://static.wikia.nocookie.net/esstarwars/images/e/ee/Iego.jpg/revision/latest/thumbnail/width/360/height/360?cb=20190720040332" className="card-img-top" alt="..." />
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