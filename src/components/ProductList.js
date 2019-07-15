import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import Breadcrumb from "./Breadcrumb"
function ProductList(props) {

    const renderItems = ()=> {
        if (props.searchResult === undefined){
            return <div>Bienvenido a Mercado Libre!</div>;
        }else if(props.searchResult === null){
            return (<div>
                        <h1>No hay publicaciones que coincidan con tu búsqueda.</h1>
                        <ul>
                            <li>Revisá la ortografía de la palabra.</li>
                            <li>Utilizá palabras más genéricas o menos palabras.</li>
                            <li>Navega por las categorías para encontrar un producto similar.</li>
                        </ul>
                    </div>);
        }else{
            return <div>
            <Breadcrumb categories={props.searchResult.categories} />
            <ul>
                {props.searchResult.items.map((elem) => {
                return (
                <li key={elem.id}>
                    <div>
                        <Link to={`/items/${ elem.id }`}>
                            <img src={elem.picture} alt=""/>
                        </Link>
                    </div>
                    <div className="price">
                        <span>${elem.price.amount}</span>
                    </div>
                    <div className="condition">
                        <span>{elem.condition}</span> - <span>CABA</span>
                    </div>
                    <Link to={`/items/${ elem.id }`}>
                        <h1>{elem.title}</h1>
                    </Link>
                </li>)
            })}
            </ul>
        </div>;
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
