import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function Breadcrumb({ categories }) {
  return <div className="breadcrumb">
            {
                categories.map((category, index) => {
                  let divider = '>';
                  if (index === categories.length - 1) { divider = ''; }

                  return <Link to={`/?category=${category.id}`} key={ index }> { `${category.name} ${divider}` } </Link>;

                  // let url = "";
                  // for(let i = index; i >= 0; i--){
                  //     url+="/"+categories[i].replace(/\s/g, '-').replace(',','');
                  // }
                  // console.log(url);
                  // return (<form method="POST" action={url} key={index}>
                  //             <input type="hidden" name="categoryId" value={category.id}></input>
                  //             <button>{category}</button> {divider}
                  //         </form>);
                })
            }
            </div>;
}

Breadcrumb.propTypes = {
  categories: PropTypes.array,
};

export default Breadcrumb;
