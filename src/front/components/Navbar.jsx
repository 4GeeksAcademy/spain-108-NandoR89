import { Link } from "react-router-dom";
import useGlobalReducer from '../hooks/useGlobalReducer.jsx';


export const Navbar = () => {

	const { store } = useGlobalReducer()

	return (
		<nav className="navbar navbar-dark bg-dark py-3 border-bottom">
			<div className="container d-flex justify-content-between">
				<Link to="/">
					<img src="https://pngimg.com/d/star_wars_logo_PNG23.png" className="text-light" alt="Logo" style={{ height: '40px' }} />
				</Link>
				<div className="d-flex">
					<div className="ml-auto me-5">
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
					<div class="dropdown">
						<button class="btn btn-secondary dropdown-toggle position-relative" type="button" data-bs-toggle="dropdown" aria-expanded="false">
							Favoritos
							<span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
								<span>{store.favorites.length}</span>
							</span>
						</button>
						<ul class="dropdown-menu">
							{store.favorites.map((item) => (
								<li><span class="dropdown-item">{item}</span></li>
							))
							}

						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};