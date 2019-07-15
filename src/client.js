import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducer from "./reducer";

import "./styles/styles.scss";
import App from "./components/App";

const jsx = (<Provider store ={ createStore( reducer, window.___REDUX_STATE ) }>
                <Router>
                    <App />
                </Router>
            </Provider>);

const app = document.getElementById( "app" );
ReactDOM.hydrate( jsx, app );
