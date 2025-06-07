import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { useEffect } from "react"
import { getContact } from "../services/contact.js"
import useGlobalReduce from "../hooks/useGlobalReducer.jsx"

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    const {dispatch} = useGlobalReduce()

    useEffect( () => {
        const get = async () => {
            const data = await getContact()
            dispatch({type: "contacts", payload: data})
        }
        get()
    }, [])

    return (
        <ScrollToTop>
            <Navbar />
                <Outlet />
            <Footer />
        </ScrollToTop>
    )
}