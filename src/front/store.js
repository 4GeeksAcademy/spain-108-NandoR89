export const initialStore = () => {
  return {
    message: null,
    user: "Fernando",
    contacts: [],
    characters: [],
    planets: [],
    starships: [],
    favorites: [],
    characterCard: {},
    planetCard: {},
    starshipCard: {},
    currentCard: [],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return { ...store, message: action.payload };
    case "contacts":
      return { ...store, contacts: action.payload };
    case "EDIT_CONTACT":
      return { ...store, contacts: action.payload };
    case "DELETE_CONTACT":
      return {
        ...store,
        contacts: store.contacts.filter(
          (contact) => contact.id !== action.payload
        ),
      };
    case "characters":
      return { ...store, characters: action.payload };
    case "planets":
      return { ...store, planets: action.payload };
    case "starships":
      return { ...store, starships: action.payload };
    case "favorites":
      return {
        ...store,
        favorites: store.favorites.includes(action.payload)
          ? store.favorites.filter((name) => name !== action.payload)
          : [...store.favorites, action.payload],
      };
      case "deleteFavorite":
      return {
        ...store,
        favorites: store.favorites.filter(
          (favorite) => favorite !== action.payload
        ),
      };
    case "characterCard":
      return { ...store, characterCard: action.payload };
    case "planetCard":
      return { ...store, planetCard: action.payload };
    case "starshipCard":
      return { ...store, starshipCard: action.payload };
    case "currentCard":
      return { ...store, currentCard: action.payload };

    default:
      throw Error("Unknown action.");
  }
}
