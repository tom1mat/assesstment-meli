import express from "express";
import path from "path";

import React from "react";
import { renderToString } from "react-dom/server";
import App from "./components/App";

import fetch from 'isomorphic-fetch';
import "@babel/polyfill";

import { StaticRouter } from "react-router-dom";

const app = express();
const port = 2048;
const apiQueryLimit = 4;
//app.use(express.static(path.resolve(__dirname, "../dist")));
app.use(express.static(path.resolve(__dirname, "../dist")));
app.use((req, res, next) => {
    // res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Allow', 'GET');
    res.header('Content-Type', 'application/json');
    next();
});
app.get("/api/items", async (req, res) => {
    const search = req.query.q;
    try {
        const response = await fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${search}&limit=${apiQueryLimit}`)
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        const data = await response.json();
        res.status(200).send(JSON.stringify(data));
    } catch (error) {
        console.error(error);
        res.status(404).send({error: "No data found"});
    }
});

app.get("/api/items/:id", async (req, res) => {
    const searchId = req.params.id;
    try {
        const [itemResponse, descriptionResponse] = await Promise.all([
            fetch(`https://api.mercadolibre.com/items/${searchId}`),
            fetch(`https://api.mercadolibre.com/items/${searchId}/description`),
        ]);
    
        const [item, description] = await Promise.all([
            itemResponse.json(),
            descriptionResponse.json()
        ])    
    } catch (error) {
        console.error(error);
    }

    console.log(item.title);
    console.log(description.plain_text);
});

app.get("/*", (req, res) => {
    const jsx = <StaticRouter context={ {} } location={ req.url }>
                    <App />
                </StaticRouter>;
        
    const reactDom = renderToString(jsx);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(htmlTemplate(reactDom));
});

app.listen(port, ()=>{
    console.log("Server listening on "+port);
});

function htmlTemplate(reactDom) {
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