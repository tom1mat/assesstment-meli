import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Breadcrumb from './Breadcrumb';
import { numberWithDots } from '../utils';

function ProductList({ searchResult }) {
  const renderItems = () => {
    if (searchResult === undefined) {
      return <div className="mesh-row">
                        <div className="mesh-col-12 container p-10 text-center">
                            <h1>Bienvenido a Mercado Libre</h1>
                        </div>
                    </div>;
    } if (searchResult === null) {
      return (<div className="mesh-row">
                        <div className="mesh-col-12 container text-center">
                            <h1 className="mb-2">No hay publicaciones que coincidan con tu búsqueda.</h1>
                            <ul>
                                <li>Revisá la ortografía de la palabra.</li>
                                <li>Utilizá palabras más genéricas o menos palabras.</li>
                                <li>Navega por las categorías para encontrar un producto similar.</li>
                            </ul>
                        </div>
                    </div>);
    }
    return (<div className="mesh-row">
                <div className="mesh-col-12 pl-0">
                    <Breadcrumb categories={searchResult.categories} />
                </div>
                <div className="container mesh-col-12 mr-0">
                    <ul>
                        {
                            searchResult.items.map((elem, index) => {
                              let condition = '';
                              if (elem.condition === 'new') {
                                condition = 'Nuevo';
                              } else if (elem.condition === 'used') {
                                condition = 'Usado';
                              }
                              return (
                                    <li key={elem.id}>
                                        <div className="mesh-row">
                                            <div className="mesh-col-m-3 mesh-col-xxs-12">
                                                <Link to={`/items/${elem.id}`}>
                                                    <img src={elem.picture} alt={elem.title} className="thumbnail"/>
                                                </Link>
                                            </div>
                                            <div className="mesh-col-m-7 mesh-col-xxs-12">
                                                <div className="mesh-col-12 item-price">
                                                    <span className="item-price-amount">${numberWithDots(elem.price.amount)}</span>
                                                    <span className="item-price-cents">{elem.price.decimals}</span>
                                                </div>
                                                <div className="mesh-col-12">
                                                    <Link to={`/items/${elem.id}`}>
                                                        <span className="item-title">{elem.title}</span>
                                                    </Link>
                                                </div>
                                                <div className="condition mesh-col-12">
                                                    {condition}
                                                </div>
                                            </div>
                                            <div className="mesh-col-m-2 mesh-col-xxs-12 item-state">
                                                {elem.state}
                                            </div>
                                        </div>
                                        {searchResult.items.length - 1 !== index ? <hr/> : null}
                                    </li>
                              );
                            })
                        }
                    </ul>
                </div>
                </div>);
  };

  return (<div>
                {renderItems()}
            </div>);
}


const mapStateToProps = state => ({
  searchResult: state.searchResult,
});

ProductList.propTypes = {
  searchResult: PropTypes.object,
};

export default connect(mapStateToProps)(ProductList);
