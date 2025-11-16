/* haku toiminto*/
import React, { useState } from "react";
import ProductList from "./ProductList";

function ProductSearch() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  async function handleFetch() {
    // UUSI API
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      const res = await fetch(
        `${API_URL}/api/product/${encodeURIComponent(input)}`
      );
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ message: "Virhe haussa" });
    }
  }

  return (
    <div className="productsearch">
      <h4>Tuotehaku</h4>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Kirjoita tuotteen nimi"
        className="haku"
      />
      <button onClick={handleFetch} className="hakunappula">
        Hae tuote
      </button>

      {Array.isArray(result) && result.length > 0 ? (
        <div class="hakutuloskentta">
          <h4>Löydetyt tuotteet:</h4>
          <ProductList products={result} />
        </div>
      ) : result && result.message ? (
        <div className="mt-4 p-4 border rounded result-box">
          <p>{result.message}</p>
        </div>
      ) : null}
    </div>
  );
}

export default ProductSearch;
