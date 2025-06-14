import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { useEffect } from "react"
import { getContact } from "../services/contact.js"
import { getCharacters, getPlanets, getStarships, getCurrentCharacter, getCurrentPlanet, getCurrentStarship } from "../services/starwars.js"
import useGlobalReduce from "../hooks/useGlobalReducer.jsx"

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    const { dispatch } = useGlobalReduce()

    // useEffect(() => {
    //     const get = async () => {
    //         const data = await getContact()
    //         dispatch({ type: "contacts", payload: data })
    //     }
    //     get()
    // }, [])

    useEffect(() => {
        const getFetch = async () => {
            const dataContact = await getContact()
            dispatch({ type: "contacts", payload: dataContact })
            const dataCharacter = await getCharacters()
            dispatch({ type: 'characters', payload: dataCharacter })
            const dataPlanets = await getPlanets()
            dispatch({ type: 'planets', payload: dataPlanets })
            const dataStarships = await getStarships()
            dispatch({ type: 'starships', payload: dataStarships })
            const dataCurrentCharacter = await getCurrentCharacter()
            dispatch({ type: 'characterCard', payload: getCurrentCharacter })
            const dataCurrentPlanet = await getCurrentPlanet()
            dispatch({ type: 'planetCard', payload: getCurrentPlanet })
            const dataCurrentStarship = await getCurrentStarship()
            dispatch({ type: 'starshipCard', payload: getCurrentStarship })
        }
        getFetch()
    }, [])

    return (
        <ScrollToTop>
            <Navbar />
            <Outlet />
            <Footer />
        </ScrollToTop>
    )
}