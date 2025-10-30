import React from "react";

function ProductList({products}) {
    if (!Array.isArray(products) || products.length === 0) {
        return <p>Tuotteita ei löytynyt.</p>;
    }

    return (
          <div className="tuotelista">
            <div className="tuotekaruselli">
                {products.map((item, index) => (
                    <div key={index} className="tulos">
                        <strong>{item.name}</strong> <br />
                        <span>Hinta: {item.price}</span>
                    </div>
            ))}
            </div>
          </div>

    );
}

export default ProductList;