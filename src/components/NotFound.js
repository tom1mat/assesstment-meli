import React from "react";
import { Link } from "react-router-dom";

const NotFound = () =>{
    return (<div className="mesh-row">
                <div className="mesh-col-12 container p-10 text-center">
                    <h1 className="mb-10">Parece que esta página no existe</h1>
                    <h2><Link to="/">Ir a la página principal</Link></h2>
                </div>
            </div>)
}

export default NotFound;