//Tuotenäkymä, jos klikkaa hakulistauksessa olevaa tuotekorttia
import React from "react";

function ProductView({ product, onBack }) {
  if (!product) return <p>Tuotetta ei löytynyt</p>;

  return (
    <div className="tuotenakyma">

      <div class="product-image-container">
        <img src={product.imageUrl} alt={product.name} />
      </div>

      <div class="product-description-container">
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

      <div class="takaisinNappula-container">
        <button onClick={onBack} className="takaisinNappula">
          Takaisin
        </button>
      </div>

    </div>
  );
}

export default ProductView;
