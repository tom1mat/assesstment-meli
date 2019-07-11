import React from 'react';

export default function Breadcrumb({categories}){
    return <div className="breadcrumb">
                {
                    categories.map((category, index)=>{
                        let divider = "-";
                        if(index === categories.length-1)
                            divider = "";

                        return (<span key={index}><a href="/">{category}</a> {divider} </span>);
                    })
                }
            </div>;
}