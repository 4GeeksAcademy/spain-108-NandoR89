import useGlobalReducer from "../hooks/useGlobalReducer";

export const getCharacters = async () => {

  const savedCharacter = localStorage.getItem("characters");
  if (savedCharacter) {
    return JSON.parse(savedCharacter);
  }

  try {
    const response = await fetch("https://www.swapi.tech/api/people");
    if (!response.ok) {
      throw new Error(`Error status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    localStorage.setItem("characters", JSON.stringify(data.results));
    return data.results;
  } catch (error) {
    console.error("Error al cargar los personajes", error);
    throw error;
  }
};

export const getPlanets = async () => {
    const savedPlanets = localStorage.getItem("planets");
  if (savedPlanets) {
    return JSON.parse(savedPlanets);
  }
  try {
    const response = await fetch("https://www.swapi.tech/api/planets");
    if (!response.ok) {
      console.error("Error al cargar los planetas");
    }
    const data = await response.json();
    console.log(data);
    localStorage.setItem("planets", JSON.stringify(data.results));
    return data.results;
  } catch (error) {
    console.log("Error ", error);
  }
};

export const getStarships = async () => {
  const savedStarships = localStorage.getItem("starships");
  if (savedStarships) {
    return JSON.parse(savedStarships);
  }

  try {
    const response = await fetch("https://www.swapi.tech/api/starships");
    if (!response.ok) {
      console.error("Error al cargar las naves");
    }
    const data = await response.json();
    console.log(data);
    localStorage.setItem("starships", JSON.stringify(data.results));
    return data.results;
  } catch (error) {
    console.error("Error: ", error);
  }
};

export const getCurrentCharacter = async (id) => {
  try {
    const response = await fetch(`https://www.swapi.tech/api/people/${id}`);
    if (!response.ok) {
      console.error("Error al cargar datos del planeta");
    }
    const data = await response.json();
    return data.result.properties;
  } catch (error) {
    console.error("Error al cargar los datos: ", error);
  }
};

export const getCurrentPlanet = async (id) => {
  try {
    const response = await fetch(`https://www.swapi.tech/api/planets/${id}`);
    if (!response.ok) {
      console.error("Error al cargar los planetas");
    }
    const data = await response.json();
    return data.result.properties;
  } catch (error) {
    console.error("Error al cargar los planetas", error);
  }
};

export const getCurrentStarship = async (id) => {
  try {
    const response = await fetch(`https://www.swapi.tech/api/starships/${id}`);
    if (!response.ok) {
      console.error("Error al cargar las naves");
    }
    const data = await response.json();
    return data.result.properties;
  } catch (error) {
    console.error("Error al cargar las naves, error");
  }
};
