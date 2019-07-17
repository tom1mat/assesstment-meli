import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import Breadcrumb from "./Breadcrumb"
import { numberWithDots } from "../utils";

function ProductList({searchResult}) {

    const renderItems = () => {
        if (searchResult === undefined){
            return <div className="mesh-row">
                        <div className="mesh-col-12"> 
                            <h1>Bienvenido a Mercado Libre!</h1>
                        </div>
                    </div>;
        }else if(searchResult === null){
            return (<div className="mesh-row">
                        <div className="mesh-col-12"> 
                            <h1>No hay publicaciones que coincidan con tu búsqueda.</h1>
                            <ul>
                                <li>Revisá la ortografía de la palabra.</li>
                                <li>Utilizá palabras más genéricas o menos palabras.</li>
                                <li>Navega por las categorías para encontrar un producto similar.</li>
                            </ul>
                        </div>
                    </div>);
        }else{
            return (<div className="mesh-row">
                        <div className="mesh-col-12 pl-0">
                            <Breadcrumb categories={searchResult.categories} />
                        </div>
                        <div className="container mesh-col-12 mr-0">
                            <ul>
                                {
                                    searchResult.items.map((elem, index) => {
                                        if(elem.condition === "new"){
                                            elem.condition = "Nuevo";
                                        }else if(elem.condition === "used"){
                                            elem.condition = "Usado";
                                        }else{
                                            elem.condition = "";
                                        }
                                        return (
                                            <li key={elem.id}>
                                                <div className="mesh-row">
                                                    <div className="mesh-col-2">
                                                        <Link to={`/items/${ elem.id }`}>
                                                            <img src={elem.picture} alt={elem.title} className="thumbnail"/>
                                                        </Link>
                                                    </div>
                                                    <div className="mesh-col-7">
                                                        <div className="mesh-col-12 item-price">
                                                            <span className="item-price-amount">${numberWithDots(elem.price.amount)}</span>
                                                            <span className="item-price-cents">{elem.price.decimals}</span>
                                                        </div>
                                                        <div className="mesh-col-12">
                                                            <Link to={`/items/${ elem.id }`}>
                                                                <h1>{elem.title}</h1>
                                                            </Link>
                                                        </div>
                                                        <div className="condition mesh-col-12">
                                                            {elem.condition}
                                                        </div>
                                                    </div>
                                                    <div className="mesh-col-3">
                                                        {elem.state}
                                                    </div>
                                                </div>
                                                {searchResult.items.length - 1 !== index ? <hr/> : null}
                                            </li>
                                            )
                                    })
                                }
                            </ul>
                        </div>
                    </div>);
        }
    }

    return (<div>
                {renderItems()}
            </div>);
}

const mapStateToProps = ( state ) =>({
    searchResult: state.searchResult,
});

export default connect( mapStateToProps )( ProductList );
