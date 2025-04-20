import { useNavigate, Link } from "react-router-dom";
import "./Styles/Navbar.css";
import LogoFrame from "./Logo";
import { useTheme } from '../Contexts/ThemeContext.jsx';
import { useState, useEffect } from "react";
import Shop from "../pages/shop.jsx";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Manejo reactivo del estado de login
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access_token"));

  // FUNCION DEL BOTON LOGOUT
  const LogoutButton = () => {
    localStorage.removeItem("access_token");
    console.log('Token eliminado:', localStorage.getItem("access_token")); // aviso en consola del token eliminado
    setIsLoggedIn(false); // Actualiza el estado después de hacer logout
    navigate("/login");
  };

  // Monitorear cambios en localStorage y actualizar el estado
  useEffect(() => {
    const checkLoginStatus = () => {
      // Actualiza el estado de login directamente desde localStorage
      setIsLoggedIn(!!localStorage.getItem("access_token"));
    };

    // Inicializa el estado al cargar el componente
    checkLoginStatus();

    // Escuchar cambios en localStorage
    window.addEventListener("storage", checkLoginStatus);
    
    // Limpiar el listener cuando el componente se desmonte
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []); // Solo se ejecuta una vez al montar el componente

  return (
    <nav>
      <div className="nav-content">
        <div className="logo">
          <LogoFrame />
        </div>

        <div className="nav_buttons">
          {!isLoggedIn && (
            <>
              <Link to="/" className="nav-btn">Register</Link>
              <Link to="/login" className="nav-btn">Login</Link>
            </>
          )}
          <Link to="/home" className="nav-btn">Home</Link>
          
          {isLoggedIn && (
            <>
              <Link to="/inventory" className="nav-btn">Inventario</Link>
              <Link to="/admin/store-settings" className="nav-btn">Datos del Comercio</Link>
              <Link to="/cart" className="nav-btn">Cart</Link>
              <button className="nav-btn"  onClick={() => navigate("/Shop")}>Shop</button> {/* BOTÓN SHOP */}
              <button className="nav-btn logout-btn" onClick={LogoutButton}>Cerrar sesión</button>
            </>
          )}
          
          {/* BOTÓN DE CAMBIO DE TEMA */}
          <button
            onClick={toggleTheme}
            className="nav-btn theme-btn"
            style={{
              backgroundColor: "var(--primary)",
              color: "white",
              borderRadius: "5px",
              padding: "5px 10px",
            }}
          >
            {theme === "light" ? "Oscuro" : "Claro"}
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;