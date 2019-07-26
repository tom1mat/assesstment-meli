import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function Header() {
  return (
        <header style={ { height: 50 } }>
            <div className="mesh-row mr-0">
                <div className="mesh-col-s-2 mesh-col-xxs-12">
                    <Link to="/">
                        <img
                            className="logo logo-large"
                            src="img/logo-large.png"
                            alt="Meli"
                        />
                        <img
                            className="logo logo-small"
                            src="img/logo-small_50x37.png"
                            alt="Meli"
                        />
                    </Link>
                </div>
                <div className="mesh-col-s-8 mesh-col-xxs-12 text-center">
                    <form method="GET" action="/" className="form-search">
                        <input type="text" placeholder="Search" name="q"/>
                        <button>
                            <img className="img-search" src="img/icon-search_25x25.png" alt="search"></img>
                        </button>
                    </form>
                </div>
            </div>
        </header>
  );
}

Header.propTypes = {
  categories: PropTypes.object,
};

export default Header;
