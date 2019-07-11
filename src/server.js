import express from "express";
import path from "path";
import { StaticRouter } from "react-router-dom";
import fetch from "isomorphic-fetch";
import "@babel/polyfill";

import React from "react";
import { renderToString } from "react-dom/server";
import App from "./components/App";

const app = express();
const port = 1234;
const apiQueryLimit = 4;

const formatPrice = ( price ) =>{
    return String(price).split('.');
}
const htmlTemplate = ( reactDom ) =>{
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Assesstment Meli</title>
        </head>
        
        <body>
            <div id="app">${ reactDom }</div>
            <script type="text/jsx" src="./app.bundle.js"></script>
        </body>
        </html>
    `;
}

const renderApp = ( location, data=null )=>{
    const jsx = <StaticRouter context={ { data } } location={ location } ><App /></StaticRouter>;
    return htmlTemplate( renderToString( jsx ) );
}



app.use( express.static( path.resolve( __dirname, "../dist" ) ) );
app.use( ( req, res, next ) => {
    res.header( "Access-Control-Allow-Methods", "GET" );
    res.header( "Allow", "GET" );
    res.header( "Content-Type", "application/json" );
    next();
} );

app.get( "/items/:id", async ( req, res ) => {
    const productId = req.params.id;

    res.writeHead( 200, { "Content-Type": "text/html" } );

    try {
        const [ itemResponse, descriptionResponse ] = await Promise.all( [
            fetch( `https://api.mercadolibre.com/items/${ productId }` ),
            fetch( `https://api.mercadolibre.com/items/${ productId }/description` ),
        ] );

        if(itemResponse.status != 200 || descriptionResponse.status != 200) {
            res.end( renderApp( req.url ) );
        }else{
            const [ item, description ] = await Promise.all( [
                itemResponse.json(),
                descriptionResponse.json(),
            ] );

            const [amount, decimals] = formatPrice(item.price);
            const dataFormated = {
                author:{
                    name: "Tomas",
                    lastname: "Mateo",
                }
            };

            dataFormated.item = {
                id: item.id,
                title: item.title,
                price: {
                    currency: item.currency_id,
                    amount,
                    decimals: decimals || 0
                },
            }
            dataFormated.picture = item.thumbnail;
            dataFormated.condition = item.condition;
            dataFormated.free_shipping = item.shipping.free_shipping;
            dataFormated.sold_quantity = item.sold_quantity;
            dataFormated.sold_quantity = description.plain_text;

            res.end( renderApp( req.url, dataFormated ) );
        }
    } catch ( error ) {
        console.error( error );
        res.end( renderApp( req.url ) );
    }
} );

app.get( "/", async ( req, res ) => {
    res.writeHead( 200, { "Content-Type": "text/html" } );
    if ( req.query.q ) {
        const search = req.query.q;
        try {
            const url = `https://api.mercadolibre.com/sites/MLA/search?q=${ search }&limit=${ apiQueryLimit }`;
            console.log(url);
            const response = await fetch( url );
            if ( response.status === 200 ) {
                const data = await response.json();

                //const categories = new Set();
                // const category_available_filters = data.available_filters.filter( filter => filter.id === "category" );
                // if ( category_available_filters && category_available_filters.length > 0 ) {
                //     category_available_filters[ 0 ].values.map( value => categories.add( value.name ) );
                // }
                // const category_filters = data.filters.filter( filter => filter.id === "category" );
                // if ( category_filters && category_filters.length > 0 ) {
                //     category_filters[ 0 ].values.forEach( value => categories.add( value.name ) );
                // }

                const categories = [];
                const filters = data.filters.filter( filter => filter.id === "category" );
                if ( filters.length > 0 ) {
                    const category = filters[0];
                    
                    if(category.values[0].path_from_root){
                        categories.push(...category.values[0].path_from_root.map( category => category.name ));
                    }
                }else{
                    const available_filters = data.available_filters.filter( filter => filter.id === "category" );
                    if ( available_filters.length > 0 ) {
                        const categoryId = available_filters[0].values[0].id;
                        const categoryResponse = await fetch( `https://api.mercadolibre.com/categories/${ categoryId }` );

                        if(categoryResponse.status == 200){
                            const categoryData = await categoryResponse.json();
                            if(categoryData.path_from_root){
                                categories.push(...categoryData.path_from_root.map( category => category.name ));
                            }
                        }
                    }
                }

                console.log(categories);
    
                const dataFormated = {
                    author:{
                        name: "Tomas",
                        lastname: "Mateo",
                    }
                }
    
                dataFormated.items = data.results.map((item)=>{
                    const [amount, decimals] = formatPrice(item.price);
                    return {
                        id: item.id,
                        title: item.title,
                        price: {
                            currency: item.currency_id,
                            amount,
                            decimals: decimals || 0
                        },
                        picture: item.thumbnail,
                        condition: item.condition,
                        free_shipping: item.shipping.free_shipping
                    }
                });
    
                dataFormated.categories = categories;
    
                res.end( renderApp( req.url, dataFormated ) );
            }else{// END if response.status === 200
                return res.end( renderApp( req.url ) );
            }
        } catch ( error ) {
            console.error( error );
            res.end( renderApp( req.url ) );
        }
    }else{
        res.end( renderApp( req.url ) );
    }
} );

// app.get( "/*", ( req, res ) => {
//     const jsx = <StaticRouter context={ {} } location={ req.url }><App /></StaticRouter>;
//     const reactDom = renderToString( jsx );

//     res.writeHead( 200, { "Content-Type": "text/html" } );
//     res.end( htmlTemplate( reactDom ) );
// } );

app.listen( port, () => {
    console.log( `Server listening on ${ port }` );
} );