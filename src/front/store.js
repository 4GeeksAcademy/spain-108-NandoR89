export const initialStore = () => {
  return {
    message: null,
    user: "Fernando",
    contacts: [],
    characters: [],
    planets: [],
    starships: [],
    favorites: [],
    card: {},
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
    case "favorites":
      return { ...store, favorites: [...store.favorites, action.payload]}
    case "card":
      return { ...store, card: action.payload}

    default:
      throw Error("Unknown action.");
  }
}
