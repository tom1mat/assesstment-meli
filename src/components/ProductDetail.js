import React from "react";
import { connect } from "react-redux";

import Breadcrumb from "./Breadcrumb";

function ProductDetail( props ) {
    if ( props.itemResult ){
        return (<div>
                    <Breadcrumb categories={props.itemResult.item.categories} />
                    {props.itemResult.item.title}
                </div>);
    }else{
        return <div>Product not found</div>
    }
}

const mapStateToProps = ( state ) =>({
    itemResult: state.itemResult
});

export default connect( mapStateToProps )( ProductDetail );
