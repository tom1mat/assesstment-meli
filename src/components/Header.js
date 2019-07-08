import React from "react";

export default function Header() {
    return (
        <header>
            <img
                src="https://http2.mlstatic.com/ui/navigation/4.4.2/mercadolibre/logo__large_plus.png"
                alt="Meli"
            />
            <form action="" method="GET">
                <input type="text" placeholder="Search" />
            </form>
        </header>
    );
}
