//Tuotenäkymä, jos klikkaa hakulistauksessa olevaa tuotekorttia
import React from "react";

function ProductView({ product, onBack }) {
  if (!product) return <p>Tuotetta ei löytynyt</p>;

  return (
    <div className="tuotenakyma">
      <button onClick={onBack} className="takaisinNappula">
        Takaisin
      </button>
      <img src={product.imageUrl} alt={product.name} />

      <h2>{product.name}</h2>
      <p>
        <strong>Hinta:</strong> {product.price}€
      </p>
      <p>
        <strong>Merkki:</strong> {product.brand}
      </p>
      <p>
        <strong>Malli:</strong> {product.model}
      </p>
      <p>
        <strong>Koko:</strong> {product.sizeInches}"
      </p>
      <p>
        <strong>Kuvaus:</strong> {product.description}
      </p>
    </div>
  );
}

export default ProductView;
