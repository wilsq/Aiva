import React, { useState } from "react";
import ProductView from "./ProductView";

function ProductList({products}) {
    const [valittuTuote, setValittuTuote] = useState(null);

    if (!Array.isArray(products) || products.length === 0) {
        return <p>Tuotteita ei löytynyt.</p>;
    }

    if (valittuTuote) {
        return (
            <ProductView product={valittuTuote} onBack={() => setValittuTuote(null)} />
        );
    }

    return (
          <div className="tuotelista">
            <div className="tuotekaruselli">
                {products.map((item, index) => (
                    <div key={index} className="tulos" onClick={() => setValittuTuote(item)}>
                        <img src={item.imageUrl} alt={item.name} />
                        <strong>{item.name}</strong> <br />
                        <span>Hinta: {item.price}€</span>
                    </div>
            ))}
            </div>
          </div>

    );
}

export default ProductList;