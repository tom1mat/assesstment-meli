import React from "react";

function ProductList() {
  return (
    <ul>
    <li>
        <div>
        <img
            src="http://mla-s2-p.mlstatic.com/912815-MLA31150221316_062019-I.jpg"
            alt=""
        />
        </div>
        <div className="price">
        <span>$20.000</span>
        </div>
        <div className="condition">
        <span>Usado</span> - <span>CABA</span>
        </div>
        <h1>Titulo</h1>
    </li>
    </ul>
  );
}

export default ProductList;