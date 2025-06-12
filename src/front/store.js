export const initialStore = () => {
  return {
    message: null,
    user: "Fernando",
    contacts: [],
    characters: [],
    planets: [],
    starships: [],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return { ...store, message: action.payload };
    case "contacts":
      return { ...store, contacts: action.payload };
    case "EDIT_CONTACT":
      return { ...store, contacts: action.payload};
    case "DELETE_CONTACT":
      return { ...store, contacts: store.contacts.filter(
          contact => contact.id !== action.payload)};
    case "characters":
      return { ...store, characters: action.payload}
    case "planets":
      return { ...store, planets: action.payload}
    case "starships":
      return { ...store, starships: action.payload}

    default:
      throw Error("Unknown action.");
  }
}
