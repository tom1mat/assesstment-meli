import React from "react";

class ProductDetail extends React.PureComponent {
    constructor ( props ) {
        super();
    }
    render() {
        if ( this.props.staticContext.data ){
            return <div>{this.props.staticContext.data.item.title}</div>;
        }else{
            return <div> Product not found</div>
        }
        
    }
}

export default ProductDetail;
