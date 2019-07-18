/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Breadcrumb from './Breadcrumb';
import { numberWithDots } from '../utils';

function ProductDetail({ itemResult }) {
  if (itemResult) {
    let condition = '';
    if (itemResult.condition === 'new') {
      condition = 'Nuevo';
    } else if (itemResult.condition === 'used') {
      condition = 'Usado';
    }

    return (<div className="mesh-row">
                    <div className="mesh-col-12 pl-0">
                        <Breadcrumb categories={itemResult.item.categories} />
                    </div>
                    <div className="container detail mesh-col-12 mr-0">
                        <div className="mesh-col-xxs-12 mesh-col-m-8">
                            <img className="image-detail" src={itemResult.picture} alt={itemResult.item.title}></img>
                        </div>
                        <div className="mesh-col-xxs-12 mesh-col-m-4">
                            <div className="mesh-col-xxs-6 mesh-col-m-12">
                                <div className="mesh-col-12 detail-header">
                                    <span className="condition">{condition}</span>
                                    <span> - {itemResult.sold_quantity} unidades</span>
                                </div>
                                <div className="mesh-col-12">
                                    <h1>{itemResult.item.title}</h1>
                                </div>
                                <div className="mesh-col-12 detail-price">
                                    <span className="detail-price-amount">${numberWithDots(itemResult.item.price.amount)}</span>
                                    <span className="detail-price-cents">{itemResult.item.price.decimals}</span>
                                </div>
                            {itemResult.free_shipping ? (
                                <div className="mesh-col-12">
                                    Envío gratis
                                </div>
                            ) : null}
                            </div>
                            <div className="mesh-col-xxs-6 mesh-col-m-12">
                                <button className="button-buy">Comprar ahora</button>
                            </div>
                        </div>
                        <div className="mesh-col-12">
                            <hr/>
                        </div>
                        <div className="mesh-col-12 detail-description">
                            <h2>Descripción del producto</h2>
                            <p>{itemResult.description}</p>
                        </div>
                    </div>
                </div>);
  }
  return <div className="mesh-row">
                    <div className="mesh-col-12 container p-10 text-center">
                        <h1>Producto no encontrado</h1>
                    </div>
                </div>;
}

const mapStateToProps = state => ({
  itemResult: state.itemResult,
});

ProductDetail.propTypes = {
    itemResult: PropTypes.object,
};

export default connect(mapStateToProps)(ProductDetail);
