import { useState } from "react"
import { Link } from "react-router-dom"


export const SignIn = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isVisiblePassword, setIsVisiblePassword] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log("Email:", email, "Password:", password)
    setEmail("")
    setPassword("")
  }

  const handleEmail = (event) => {
    setEmail(event.target.value)
  }

  const handlePassword = (event) => {
    setPassword(event.target.value)
  }

  const handleShowPassword = () => {
    setIsVisiblePassword(!isVisiblePassword)
  }

  return (
    <div className="d-flex min-vh-100 m-auto">
      <main className="form-signin bg-secondary-subtle rounded w-100 m-auto p-5">
        <form onSubmit={handleSubmit}>
          <img
            className="mb-4 d-block mx-auto rounded"
            src="https://blog.camaralia.com/wp-content/uploads/2016/01/Star-Wars-Blu-ray1.jpg"
            alt="Logo"
            width="200"
            height="200"
          />
          <h1 className="h3 mb-3 fw-normal text-center">Por favor inicia sesión</h1>

          <div className="form-floating">
            <input onChange={handleEmail} type="email" className="form-control" id="floatingInput" value={email} placeholder="name@example.com" />
            <label htmlFor="floatingInput">Correo electrónico</label>
          </div>
          <div className="form-floating position-relative mt-2">
            <input onChange={handlePassword} type={isVisiblePassword ? "password" : "text"} className="form-control" id="floatingPassword" value={password} placeholder="Contraseña" />
            <label htmlFor="floatingPassword">Contraseña</label>
            <span onClick={handleShowPassword} className="position-absolute top-50 end-0 translate-middle-y pe-3" style={{ cursor: "pointer" }}>
              {
                !isVisiblePassword ?
                  <i class="fa-solid fa-eye-slash fa-xl"></i>
                  :
                  <i className="fa-solid fa-eye fa-xl text-secondary"></i>
              }

            </span>
          </div>

          <div className="checkbox mb-3 mt-2">
            <label>
              <input type="checkbox" value="remember-me" /> Recuérdame
            </label>
          </div>

          <button className="w-100 btn btn-lg btn-primary" type="submit">
            Iniciar sesión
          </button>
          <p className="text-center mt-3">No estás registrad@? Regístrate <Link to="/registerform">aquí</Link>.</p>
          <p className="mt-3 mb-3 text-muted text-center">&copy; 2025</p>
        </form>
      </main>
    </div>

  )
}