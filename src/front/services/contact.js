const user = "fernando";
const host = `https://playground.4geeks.com/contact/agendas`;
const getUrl = `${host}/${user}`;
  // const postUrlUser = `${host}/${userName}`
  // const postUrlContacts = `${host}/${userName}/contacts`

export const addUser = async () => {
    try {
      const checkUser = await fetch(getUrl)
      if (checkUser.status === 404) {
        const createUser = await fetch(getUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        })
        if (!createUser.ok) {
          console.error("Error al crear el usuario")
        }
      }
    }
    catch (error) {
      console.error("Error en verificar el usuario", error)
    }
  }

export const getContact = async () => {
  try {
    const response = await fetch(
      `https://playground.4geeks.com/contact/agendas/${user}`
    );
    if (response.status === 404) {
      // todo: llamar al fetch que crea el usuario
    }
    const data = await response.json();
    console.log(data);
    return data.contacts;
  } catch {
    console.log("Error");
    return false;
  }
};

export const postNewContact = async (userData) => {
  try {
    const response = await fetch(
      `https://playground.4geeks.com/contact/agendas/${user}/contacts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );
    if (!response.ok) {
      console.error("Error al añadir el contacto: ", response.status);
      throw error;
    }
    return (data = getContact());
  } catch (error) {
    console.error("Error al crear el contacto", error.message);
  }
};
