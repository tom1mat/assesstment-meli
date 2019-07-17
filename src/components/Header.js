import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header style={{height: 50}}>
            <div className="mesh-row">
                <div className="mesh-col-2">
                    <Link to="/">
                        <img
                            className="logo logo-large"
                            src="img/logo-large.png"
                            alt="Meli"
                        />
                        <img
                            className="logo logo-small"
                            src="img/logo-small.png"
                            alt="Meli"
                        />
                    </Link>                
                </div>
                <div className="mesh-col-8" style={{textAlign: "center"}}>
                    <form method="GET" action="/" className="form-search">
                        <input type="text" placeholder="Search" name="q" style={{width: "90%"}}/>
                        <button>
                            <img className="img-search" src="img/icon-search.png" alt="search"></img>
                        </button>
                    </form>
                </div>
            </div>
        </header>
    );
}
