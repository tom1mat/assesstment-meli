import express from 'express';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import fetch from 'isomorphic-fetch';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import '@babel/polyfill';

import App from './components/App';
import reducer from './reducer';
import config from './config.json';

const app = express();
const port = process.env.PORT || config.APP_PORT;
const apiQueryLimit = 4;


/**
 * Makes the HTML template
 * @param {String} reactDom the HTML builded by React
 * @param {Object} state The state passed to Redux
 * @return {Array} The HTML returned to the client.
 */
const htmlTemplate = (reactDom, state) => `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta id="viewport" name="viewport" content ="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <title>Assesstment Meli</title>
            <base href="/">
            <link rel="stylesheet" type="text/css" href="app.styles.css">
            <link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />
        </head>
        
        <body>
            <div id="app">${reactDom}</div>
            <script>
                window.___REDUX_STATE = ${JSON.stringify(state)}
            </script>
            <script type="text/jsx" src="app.bundle.js"></script>
        </body>
        </html>
    `;
/**
 * Converts the React code to HTML.
 * @param {String} location The location for React Router
 * @param {Object} state The state passed to Redux
 * @return {String} The bundled HTML
 */
const renderApp = (location, state = { }) => {
  const store = createStore(reducer, state);
  const jsx = (
                <Provider store={ store }>
                    <StaticRouter context={ { } } location={ location } >
                        <App />
                    </StaticRouter>
                </Provider>);
  return htmlTemplate(renderToString(jsx), store.getState());
};

/**
 * Splits the price dividing decimal part from integer part
 * @param {Number} price
 * @return {Array} [amount, decimals]
 */
const formatPrice = price => String(price).split('.');

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

app.use(express.static(path.resolve(__dirname, '../dist')));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Allow', 'GET');
  res.header('Content-Type', 'application/json');
  next();
});

app.get('/items/:id', async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });

  const productId = req.params.id;

  try {
    const [itemResponse, descriptionResponse] = await Promise.all([
      fetch(`${config.API_URL}items/${productId}`),
      fetch(`${config.API_URL}items/${productId}/description`),
    ]);

    if (itemResponse.status !== 200 || descriptionResponse.status !== 200) {
      return res.end(renderApp(req.url));
    }
    const [item, description] = await Promise.all([
      itemResponse.json(),
      descriptionResponse.json(),
    ]);

    const categoriesResponse = await fetch(`${config.API_URL}categories/${item.category_id}`);
    const categoriesData = await categoriesResponse.json();

    if (categoriesResponse.status !== 200 || !categoriesData.id) {
      // We check the value id for knowing if a category was found.
      return res.end(renderApp(req.url));
    }

    const categories = [];

    categories.push(...categoriesData.path_from_root.map(category => ({
      id: category.id,
      name: category.name,
    })));

    const [amount, decimals] = formatPrice(item.price);
    const dataFormated = {
      author: {
        name: 'Tomas',
        lastname: 'Mateo',
      },
    };

    dataFormated.item = {
      id: item.id,
      title: item.title,
      price: {
        currency: item.currency_id,
        amount,
        decimals: decimals || '00',
      },
      categories,
    };
    dataFormated.picture = item.thumbnail;
    dataFormated.condition = item.condition;
    dataFormated.free_shipping = item.shipping.free_shipping;
    dataFormated.sold_quantity = item.sold_quantity;
    dataFormated.description = description.plain_text;
    return res.end(renderApp(req.url, { itemResult: dataFormated }));
  } catch (error) {
    console.error(error);
    return res.end(renderApp(req.url));
  }
});

app.get('/', async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  if (req.query.q || req.query.category) {
    const search = req.query.q ? `q=${req.query.q}&` : '';
    const categorySearch = req.query.category ? `category=${req.query.category}&` : '';
    try {
      const url = `${config.API_URL}sites/MLA/search?limit=${apiQueryLimit}&${search}${categorySearch}`;
      const response = await fetch(url);
      if (response.status === 200) {
        const data = await response.json();

        if (data.results && data.results.length === 0) {
          return res.end(renderApp(req.url, { searchResult: null }));
        }

        // const categories = new Set();
        // const category_available_filters = data.available_filters.filter( filter => filter.id === "category" );
        // if ( category_available_filters && category_available_filters.length > 0 ) {
        //     category_available_filters[ 0 ].values.map( value => categories.add( value.name ) );
        // }
        // const category_filters = data.filters.filter( filter => filter.id === "category" );
        // if ( category_filters && category_filters.length > 0 ) {
        //     category_filters[ 0 ].values.forEach( value => categories.add( value.name ) );
        // }

        const categories = [];
        const filters = data.filters.filter(filter => filter.id === 'category');
        if (filters.length > 0) {
          const category = filters[0];

          if (category.values[0].path_from_root) {
            categories.push(...category.values[0].path_from_root.map(eachCat => ({
              id: eachCat.id,
              name: eachCat.name,
            })));
          }
        } else {
          const availableFilters = data.available_filters.filter(filter => filter.id === 'category');
          if (availableFilters.length > 0) {
            const categoryId = availableFilters[0].values[0].id;
            const categoryResponse = await fetch(`${config.API_URL}/categories/${categoryId}`);

            if (categoryResponse.status === 200) {
              const categoryData = await categoryResponse.json();
              if (categoryData.path_from_root) {
                categories.push(...categoryData.path_from_root.map(category => ({
                  id: category.id,
                  name: category.name,
                })));
              }
            }
          }
        }

        const dataFormated = {
          author: {
            name: 'Tomas',
            lastname: 'Mateo',
          },
        };

        dataFormated.items = data.results.map((item) => {
          const [amount, decimals] = formatPrice(item.price);
          return {
            id: item.id,
            title: item.title,
            price: {
              currency: item.currency_id,
              amount,
              decimals: decimals || '00',
            },
            picture: item.thumbnail,
            condition: item.condition,
            free_shipping: item.shipping.free_shipping,
            state: item.seller_address.state.name,
          };
        });

        dataFormated.categories = categories;
        return res.end(renderApp(req.url, { searchResult: dataFormated }));
      }// END if response.status === 200
      return res.end(renderApp(req.url));
    } catch (error) {
      console.error(error);
      return res.end(renderApp(req.url, { searchResult: null }));
    }
  } else { // If we dont recieve a search keyword or category, we return the HTML without data.
    return res.end(renderApp(req.url));
  }
});

app.get('*', (req, res) => { // If the request does
  res.writeHead(200, { 'Content-Type': 'text/html' });
  return res.end(renderApp('/404'));
});
