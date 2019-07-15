import React from "react";
import { Link } from "react-router-dom";

const NotFound = () =>{
    return (<div>
                <h1>Parece que esta página no existe</h1>
                <h2><Link to="/">Ir a la página principal</Link></h2>
            </div>)
}

export default NotFound;