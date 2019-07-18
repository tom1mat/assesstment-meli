import { Switch, Route } from 'react-router-dom';
import React from 'react';
import Header from './Header';
import ProductDetail from './ProductDetail';
import ProductList from './ProductList';
import NotFound from './NotFound';

export default function App() {
  return (
        <div>
            <Header />
            <div className="main-container">
                <Switch>
                    <Route exact path="/" component={ ProductList } />
                    <Route path="/items/:id" component={ ProductDetail } />
                    <Route path="/404" component={ NotFound } />
                </Switch>
            </div>
        </div>
  );
}
