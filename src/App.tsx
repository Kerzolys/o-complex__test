import { ProductsBlock } from "./components/productsBlock/productsBlock";
import { ReviewsBlock } from "./components/reviewsBlock/reviewsBlock";
import { CartBlock } from "./components/cartBlock/cartBlock";
import { TProduct } from "./types/types";
import { useState } from "react";

import "./App.css";

export default function App() {
  const [cart, setCart] = useState<TProduct[]>(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [quantities, setQuantities] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem("quantities");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleAddToCart = (product: TProduct) => {
    setCart((prev) => [...prev, product]);
  };
  
  const handleRemoveFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <ReviewsBlock />
      <CartBlock
        cart={cart}
        quantities={quantities}
        setCart={setCart}
        setQuantities={setQuantities}
      />
      <ProductsBlock
        onAddToCart={handleAddToCart}
        cart={cart}
        onRemoveFromCart={handleRemoveFromCart}
        quantities={quantities}
        setQuantities={setQuantities}
      />
    </>
  );
}
