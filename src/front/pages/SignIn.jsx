import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { login } from "../services/auth"

export const SignIn = () => {
  const { dispatch } = useGlobalReducer()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [isVisiblePassword, setIsVisiblePassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const result = await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      })

      const token = result?.access_token ?? result?.token
      if (!token) {
        console.error("login sin token", result)
        return
      }

      sessionStorage.setItem("token", token)
      if (result?.results) {
        sessionStorage.setItem("currentUser", JSON.stringify(result.results))
        dispatch({ type: "currentUser", payload: result.results })
      }
      dispatch({ type: "token", payload: token })
      dispatch({ type: "isLogged", payload: true })

      navigate("/")
    } catch (err) {
      console.error(err)
    }
  }

  const handleEmail = e => setFormData(prev => ({ ...prev, email: e.target.value }))
  const handlePassword = e => setFormData(prev => ({ ...prev, password: e.target.value }))
  const handleShowPassword = () => setIsVisiblePassword(v => !v)

  return (
    <div className="d-flex min-vh-100 m-auto">
      <main className="form-signin bg-secondary-subtle rounded w-100 m-auto p-5">
        <form onSubmit={handleSubmit}>
          <img className="mb-4 d-block mx-auto rounded" src="https://blog.camaralia.com/wp-content/uploads/2016/01/Star-Wars-Blu-ray1.jpg" alt="Logo" width="200" height="200" />
          <h1 className="h3 mb-3 fw-normal text-center">Por favor inicia sesión</h1>

          <div className="form-floating">
            <input
              onChange={handleEmail}
              type="email"
              className="form-control"
              id="floatingInput"
              value={formData.email}
              placeholder="name@example.com"
              autoComplete="email"
              required
            />
            <label htmlFor="floatingInput">Correo electrónico</label>
          </div>

          <div className="form-floating position-relative mt-2">
            <input
              onChange={handlePassword}
              type={isVisiblePassword ? "text" : "password"}
              className="form-control"
              id="floatingPassword"
              value={formData.password}
              placeholder="Contraseña"
              autoComplete="current-password"
              required
            />
            <label htmlFor="floatingPassword">Contraseña</label>
            <span
              onClick={handleShowPassword}
              className="position-absolute top-50 end-0 translate-middle-y pe-3"
              style={{ cursor: "pointer" }}
              aria-label={isVisiblePassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {!isVisiblePassword ? <i className="fa-solid fa-eye-slash fa-xl" /> : <i className="fa-solid fa-eye fa-xl text-secondary" />}
            </span>
          </div>

          <button className="w-100 btn btn-lg btn-primary" type="submit">Iniciar sesión</button>
          <p className="text-center mt-3">No estás registrad@ Regístrate <Link to="/registerform">aquí</Link></p>
          <p className="mt-3 mb-3 text-muted text-center">© 2025</p>
        </form>
      </main>
    </div>
  )
}