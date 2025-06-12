import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-dark bg-dark py-3">
			<div className="container">
				<Link to="/">
					<img src="https://pngimg.com/d/star_wars_logo_PNG23.png" className="text-light" alt="Logo" style={{ height: '40px' }} />
				</Link>
				<div className="ml-auto">
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
			</div>
		</nav>
	);
};