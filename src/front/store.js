export const initialStore = () => {
  return {
    message: null,
    user: "Fernando",
    contacts: [],
    characters: [],
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
    default:
      throw Error("Unknown action.");
  }
}
