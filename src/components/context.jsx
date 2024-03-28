import React from "react";

const context = React.createContext({
  token: "",
  setToken: () => {},
});

export default context;
