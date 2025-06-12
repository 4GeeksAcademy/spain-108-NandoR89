import useGlobalReducer from "../hooks/useGlobalReducer"
import storeReducer from "../store"

export const Starships = () => {

  const { store } = useGlobalReducer()

  return (
    <div className="bg-dark">
      <div className="container d-flex justify-content-center my-5">
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
          {
            store.starships.map((item) => {
              return (
                <div class="col">
                  <div class="card h-100">
                    <img src="https://pm1.aminoapps.com/6232/3ea3c67056ca775aa75e535e5980f15cd3c8659a_hq.jpg" class="card-img-top" alt="Nave de Star Wars" />
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
    </div>

  )
}