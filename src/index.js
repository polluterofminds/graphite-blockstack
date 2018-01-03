import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import ReactDOM from "react-dom";

import App from "./components/App";

// Require Sass file so webpack can build it
import style from "./styles/style.css";
if (process.env.NODE_ENV !== "production") {
  console.log("Looks like we are in development mode!");
}

ReactDOM.render(<App />, document.getElementById("root"));
