const user = "Fernando";
const host = `https://playground.4geeks.com/contact/agendas`;
const getUrl = `${host}/${user}`;

export const addUser = async () => {
  try {
    const checkUser = await fetch(getUrl);
    if (checkUser.status === 404) {
      const createUser = await fetch(getUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!createUser.ok) {
        console.error("Error al crear el usuario");
      }
    }
  } catch (error) {
    console.error("Error en verificar el usuario", error);
  }
};

export const getContact = async () => {
  try {
    const response = await fetch(
      `https://playground.4geeks.com/contact/agendas/${user}`
    );
    if (response.status === 404) {
      addUser();
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
    return await getContact();
  } catch (error) {
    console.error("Error al crear el contacto", error.message);
  }
};

export const putContact = async (id, userData) => {
  try {
    const response = await fetch(
      `https://playground.4geeks.com/contact/agendas/${user}/contacts/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );
    if (!response.ok) {
      console.error("Error al editar el contacto: ", response.status);
      throw error;
    }
    return await response.json();
  } catch {
    console.log("Error al editar el contacto");
  }
};

export const deleteContact = async (item) => {
  try {
    const response = await fetch(
      `https://playground.4geeks.com/contact/agendas/${user}/contacts/${item.id}`,
      { method: "DELETE" }
    );
    if (response.ok) {
      return true;
    }
  } catch (error) {
    console.log("Error al eliminar el usuario.", error);
    return false
  }
};
