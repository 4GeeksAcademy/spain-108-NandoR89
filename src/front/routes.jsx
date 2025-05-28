// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Login } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Admin } from "./pages/AdminLogin";
import { AlumnosProfile } from "./pages/AlumnosProfile";
import { Signup } from "./pages/ChangeSingup";
import { AdminAlumnosNotas } from "./pages/AdminAlumnosNotas";
import { AdminAlumnosAsistencia } from "./pages/AdminAlumnosAsistencia";
import { AdminAlumnosPagos } from "./pages/AdminAlumnosPagos";
import { AdminProfesores } from "./pages/AdminProfesores";
import { AdminSolicitudes } from "./pages/AdminSolicitudes";
import { ProfesoresProfile } from "./pages/ProfesoresProfile";
import { AdminProfile } from "./pages/AdminProfile";
import { ProfesoresAlumnosNotas } from "./pages/ProfesoresAlumnosNotas";
import { ProfesoresAlumnosAsistencia } from "./pages/ProfesoresAlumnosAsistencia";
import { ProfesoresHorario } from "./pages/ProfesoresHorario";
import { AlumnosNotas } from "./pages/AlumnosNotas";
import { AlumnosHorario } from "./pages/AlumnosHorario";
import { AlumnosPagos } from "./pages/AlumnosPagos";

export const router = createBrowserRouter(
  createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

    // Root Route: All navigation will start from here.
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
      <Route path="/" element={<Login />} />
      <Route path="/single/:theId" element={<Single />} />  {/* Dynamic route for single items */}
      <Route path="/demo" element={<Demo />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/alumnos/profile" element={<AlumnosProfile />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin/profile" element={<AdminProfile />} />
      <Route path="/admin/alumnos/notas" element={<AdminAlumnosNotas />} />
      <Route path="/admin/alumnos/asistencia" element={<AdminAlumnosAsistencia />} />
      <Route path="/admin/alumnos/pagos" element={<AdminAlumnosPagos />} />
      <Route path="/admin/profesores" element={<AdminProfesores />} />
      <Route path="/admin/solicitudes" element={<AdminSolicitudes />} />
      <Route path="/profesores/profile" element={<ProfesoresProfile />} />
      <Route path="/profesores/alumnos/notas" element={<ProfesoresAlumnosNotas />} />
      <Route path="/profesores/alumnos/asistencia" element={<ProfesoresAlumnosAsistencia />} />
      <Route path="/profesores/horario" element={<ProfesoresHorario />} />
      <Route path="/alumnos/notas" element={<AlumnosNotas />} />
      <Route path="/alumnos/horario" element={<AlumnosHorario />} />
      <Route path="/alumnos/pagos" element={<AlumnosPagos />} />
    </Route>
  )
);