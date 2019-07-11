import React from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "./Breadcrumb"
function ProductList(props) {

    const renderItems = ()=>{
        if(props.staticContext.data){
            return <div>
                        <Breadcrumb categories={props.staticContext.data.categories} />
                        <ul>
                            {props.staticContext.data.items.map((elem) => {
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
        }else{
            return <div>No data</div>;
        }
    }

    return (<div>
                {renderItems()}
            </div>);
}

export default ProductList;
