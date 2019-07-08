import { Switch, Route } from "react-router-dom";
import React from "react";
import Header from "./Header";
import ProductDetail from "./ProductDetail";
import ProductList from "./ProductList";

export default function App() {
    return (
        <div>
            <Header />
            <div className="container">
                <div className="breadcrumb">
                    <a href="/">Categoría</a> -<a href="/">Sub categoría</a> -
                    <a href="/">Sub Sub Categoría</a>
                </div>
                <Switch>
                    <Route exact path="/" component={ ProductList } />
                    <Route path="/items/:id" component={ ProductDetail } />
                </Switch>
            </div>
        </div>
    );
}
