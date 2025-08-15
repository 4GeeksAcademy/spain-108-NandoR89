import { Link, useNavigate } from "react-router-dom";
import { useState } from "react"
import useGlobalReducer from '../hooks/useGlobalReducer.jsx';


export const Navbar = () => {

	const { store, dispatch } = useGlobalReducer()
	const [selectedFavorite, setSelectedFavorite] = useState(null)
	const navigate = useNavigate()

	const handleDelete = (item) => {
		dispatch({ type: "deleteFavorite", payload: item })
		setSelectedFavorite(null)
	}

const handleSignIn = () => {
    if (!store.isLogged) {
      navigate("/signin")
      return
    }
    sessionStorage.removeItem("token")
    dispatch({ type: "token", payload: null })
    dispatch({ type: "isLogged", payload: false })
    navigate("/")
  }

	return (
		<nav className="navbar navbar-dark bg-dark py-3 border-bottom">
			<div className="container d-flex flex-md-row flex-column justify-content-between">
				<Link to="/">
					<img src="https://pngimg.com/d/star_wars_logo_PNG23.png" className="mb-4 mb-md-0" alt="Logo" style={{ height: '40px' }} />
				</Link>
				<div className="text-center order-1 w-100 w-md-auto mb-2 mb-md-0">
					<div className="dropdown d-flex justify-content-between d-md-none">
						<button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
							<i className="fa-solid fa-bars"></i>
						</button>
						<ul className="dropdown-menu">
							<li className="dropdown-item mb-0 h1">
								<Link to="/planets">
									Planetas
								</Link>
							</li>
							<li className="dropdown-item mb-0 h1">
								<Link to="/characters">
									Personajes
								</Link>
							</li>
							<li className="dropdown-item mb-0 h1">
								<Link to="/starships">
									Naves
								</Link>
							</li>
							<li className="dropdown-item mb-0 h1">
								<Link to="/contactslist">
									Contactos
								</Link>
							</li>
						</ul>
						<div className="dropdown d-flex gap-3">
							<button className="btn btn-secondary dropdown-toggle dropdown-toggle position-relative" type="button" data-bs-toggle="dropdown" aria-expanded="false">
								Favoritos
								<span className="position-absolute top-0 start-100 translate-middle bg-danger border border-light rounded-circle d-flex align-items-center justify-content-center favorite-badge">
									<span>{store.favorites.length}</span>
								</span>
							</button>
									{
										!store.isLogged ?
											<button onClick={handleSignIn} class="btn btn-primary" type="button">
												Conexión
											</button>
											:
											<button onClick={handleSignIn} class="btn btn-primary" type="button">
												Desconexión
											</button>
									}
						</div>
					</div>
				</div>
				<div className="d-flex">
					<div className="d-none d-md-flex ml-auto me-5">
						<div>
							<Link to="/planets">
								<span className="navbar-brand mb-0 h1">Planetas</span>
							</Link>
							<Link to="/characters">
								<span className="navbar-brand mb-0 h1">Personajes</span>
							</Link>
							<Link to="/starships">
								<span className="navbar-brand mb-0 h1">Naves</span>
							</Link>
							<Link to="/contactslist">
								<span className="navbar-brand mb-0 h1">Contactos</span>
							</Link>
						</div>
						<div>
							<div className="dropdown d-flex gap-5">
								<button className="btn btn-secondary dropdown-toggle position-relative" type="button" data-bs-toggle="dropdown" aria-expanded="false">
									Favoritos
									<span className="position-absolute top-0 start-100 translate-middle bg-danger border border-light rounded-circle d-flex align-items-center justify-content-center favorite-badge">
										<span>{store.favorites.length}</span>
									</span>
								</button>
								<ul className="dropdown-menu">
									{store.favorites.map((item) => (
										<li key={item.id}>
											<span className="dropdown-item d-flex justify-content-between align-items-center">
												{item}
												<i className="fa-regular fa-circle-xmark fa-xl" onClick={() => handleDelete(item)}></i>
											</span>
										</li>
									))
									}
								</ul>
								<div>
									{
										!store.isLogged ?
											<button onClick={handleSignIn} class="btn btn-primary" type="button">
												Conexión
											</button>
											:
											<button onClick={handleSignIn} class="btn btn-primary" type="button">
												Desconexión
											</button>
									}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
};