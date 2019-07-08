import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./components/App";
import "./styles/styles.scss";

const jsx = <Router><App /></Router>;

const app = document.getElementById( "app" );
ReactDOM.hydrate( jsx, app );
