import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <div className="mesh-row">
            <div className="mesh-col-12">
                <header>
                    <Link to="/">
                        <img
                            src="https://http2.mlstatic.com/ui/navigation/4.4.2/mercadolibre/logo__large_plus.png"
                            alt="Meli"
                        />
                    </Link>
                    <form method="GET" action="/">
                        <input type="text" placeholder="Search" name="q" />
                    </form>
                </header>
            </div>
        </div>
    );
}
