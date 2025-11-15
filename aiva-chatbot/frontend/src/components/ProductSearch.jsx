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
      <h3>Tuotehaku</h3>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Kirjoita tuotteen nimi"
        className="border p-2 m-2"
      />
      <button onClick={handleFetch} className="bg-blue-500 text-white p-2">
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
