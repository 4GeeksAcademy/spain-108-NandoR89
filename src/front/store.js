export const initialStore = () => {
  return {
    message: null,
    contacts: [],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return { ...store, message: action.payload };
    case "contacts":
      return { ...store, contacts: action.payload };

    default:
      throw Error("Unknown action.");
  }
}
