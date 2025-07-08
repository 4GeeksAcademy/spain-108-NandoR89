// Import necessary components and functions from react-router-dom.

import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { ContactsList } from "./pages/ContactsList.jsx";
import { AddNewContact } from "./pages/AddNewContact.jsx";
import { Planets } from "./pages/Planets.jsx";
import { Characters } from "./pages/Characters.jsx";
import { Starships } from "./pages/Starships.jsx";
import { CharacterCard } from "./pages/CharacterCard.jsx";
import { PlanetCard } from "./pages/PlanetCard.jsx";
import { StarshipCard } from "./pages/StarshipCard.jsx";
import { SignIn } from "./pages/SignIn.jsx"
import { RegisterForm } from "./pages/RegisterForm.jsx";


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
        <Route path= "/" element={<Home />} />
        <Route path="/single/:theId" element={ <Single />} />  {/* Dynamic route for single items */}
        <Route path="/demo" element={<Demo />} />
        <Route path="/planets" element={<Planets />} />
        <Route path="/planets/:id" element={<PlanetCard />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/characters/:id" element={<CharacterCard />} />
        <Route path="/starships" element={<Starships />} />
        <Route path="/starships/:id" element={<StarshipCard />} />
        <Route path="/contactslist" element={<ContactsList />} />
        <Route path="/addnewcontact" element={<AddNewContact />} />
        <Route path="/editcontact/:id" element={<AddNewContact />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/registerform" element={<RegisterForm />} />

      </Route>
    )
);