import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
    const handleSubmit = (event)=>{
        event.preventDefault();
    }
    return (
        <header>
            <Link to="/">
                <img
                    src="https://http2.mlstatic.com/ui/navigation/4.4.2/mercadolibre/logo__large_plus.png"
                    alt="Meli"
                />
            </Link>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Search"/>
            </form>
        </header>
    );
}
