export const getCharacters = async() => {
    try {
    const response = await fetch('https://www.swapi.tech/api/people')
    if (!response.ok) {
        throw new Error(`Error status: ${response.status}`)
    }
    const data = await response.json()
    console.log(data)
    return data.results
    } catch (error) {
        console.error("Error al cargar los personajes", error)
        throw error
    }
}