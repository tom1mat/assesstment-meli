import express from "express";
import path from "path";
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import fetch from "isomorphic-fetch";
import { createStore } from "redux";
import { Provider } from "react-redux";
import "@babel/polyfill";

import App from "./components/App";
import reducer from "./reducer";

const app = express();
const port = process.env.PORT || 3000;
const apiQueryLimit = 4;

const renderApp = ( location, data={ } )=>{
    const store = createStore( reducer, data );
    const jsx = (
                <Provider store={ store }>
                    <StaticRouter context={ { } } location={ location } >
                        <App />
                    </StaticRouter>
                </Provider>);
    return htmlTemplate( renderToString( jsx ), store.getState() );
}

const formatPrice = ( price ) =>{
    return String(price).split('.');
}
const htmlTemplate = ( reactDom, state ) =>{
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Assesstment Meli</title>
            <base href="/">
            <link rel="stylesheet" type="text/css" href="app.styles.css">
            <link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />
        </head>
        
        <body>
            <div id="app">${ reactDom }</div>
            <script>
                window.___REDUX_STATE = ${ JSON.stringify( state ) }
            </script>
            <script type="text/jsx" src="app.bundle.js"></script>
        </body>
        </html>
    `;
}


app.listen( port, () => {
    console.log( `Server listening on ${ port }` );
} );

app.use( express.static( path.resolve( __dirname, "../dist" ) ) );
app.use( ( req, res, next ) => {
    res.header( "Access-Control-Allow-Methods", "GET" );
    res.header( "Allow", "GET" );
    res.header( "Content-Type", "application/json" );
    next();
} );

app.get( "/items/:id", async ( req, res ) => {
    console.log(req.url);

    const productId = req.params.id;
    if(req.url.includes('items'));
        res.writeHead( 200, { "Content-Type": "text/html" } );

    try {
        const [ itemResponse, descriptionResponse ] = await Promise.all( [
            fetch( `https://api.mercadolibre.com/items/${ productId }` ),
            fetch( `https://api.mercadolibre.com/items/${ productId }/description` ),
        ] );

        if(itemResponse.status != 200 || descriptionResponse.status != 200) {
            return res.end( renderApp( req.url ) );
        }else{
            const [ item, description ] = await Promise.all( [
                itemResponse.json(),
                descriptionResponse.json(),
            ] );

            const categoriesResponse = await fetch( `https://api.mercadolibre.com/categories/${ item.category_id }` );
            const categoriesData = await categoriesResponse.json();

            if(categoriesResponse.status != 200 || !categoriesData.id ){
                // We check the value id for knowing if a category was found.
                return res.end( renderApp( req.url ) );
            }

            const categories = [];

            categories.push(...categoriesData.path_from_root.map( (category) => { 
                return {
                    id: category.id,
                    name: category.name
                }
             } ));
            
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
                categories,
            }
            dataFormated.picture = item.thumbnail;
            dataFormated.condition = item.condition;
            dataFormated.free_shipping = item.shipping.free_shipping;
            dataFormated.sold_quantity = item.sold_quantity;
            dataFormated.sold_quantity = description.plain_text;
            res.end( renderApp( req.url, { itemResult: dataFormated } ) );
        }
    } catch ( error ) {
        console.error( error );
        res.end( renderApp( req.url ) );
    }
} );

app.get( "/", async ( req, res ) => {
    console.log(req.url);
    res.writeHead( 200, { "Content-Type": "text/html" } );
    if ( req.query.q  || req.query.category ) {
        const search = req.query.q ? `q=${ req.query.q }&` : "";
        const category =  req.query.category ? `category=${ req.query.category }&` : ""; 
        try {
            const url = `https://api.mercadolibre.com/sites/MLA/search?limit=${ apiQueryLimit }&${ search }${ category }`;
            const response = await fetch( url );
            if ( response.status === 200 ) {
                const data = await response.json();

                if(data.results && data.results.length === 0){
                    return res.end( renderApp( req.url, { searchResult: null } ) );
                }

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
                        categories.push(...category.values[0].path_from_root.map( (category) => { 
                            return {
                                id: category.id,
                                name: category.name
                            }
                         } ));
                    }
                }else{
                    const available_filters = data.available_filters.filter( filter => filter.id === "category" );
                    if ( available_filters.length > 0 ) {
                        const categoryId = available_filters[0].values[0].id;
                        const categoryResponse = await fetch( `https://api.mercadolibre.com/categories/${ categoryId }` );

                        if(categoryResponse.status == 200){
                            const categoryData = await categoryResponse.json();
                            if(categoryData.path_from_root){
                                categories.push(...categoryData.path_from_root.map( (category) => {
                                    return {
                                        id: category.id,
                                        name: category.name
                                    }
                                } ));
                            }
                        }
                    }
                }
    
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
                return res.end( renderApp( req.url, { searchResult: dataFormated } ) );
            }else{// END if response.status === 200
                return res.end( renderApp( req.url ) );
            }
        } catch ( error ) {
            console.error( error );
            return res.end( renderApp( req.url, { searchResult: null } ) );
        }
    }else{
        return res.end( renderApp( req.url ) );
    }
} );

app.get('*', (req, res, next)=>{
    res.writeHead( 200, { "Content-Type": "text/html" } );
    return res.end( renderApp( "/404" ) );
});