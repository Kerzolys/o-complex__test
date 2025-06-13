"use client";
import React, { useEffect, useRef, useState } from "react";
import { TProduct } from "../../types/types";
import { getProductsApi } from "../../api/getProductsApi";
import { Product } from "./components/product";

import styles from "./productsBlock.module.scss";
import { Preloader } from "../../shared/Preloader/preloader";

type ProductsBlockProps = {
  onAddToCart: (product: TProduct) => void;
  cart: TProduct[];
  onRemoveFromCart: (id: number) => void;
  quantities: Record<number, string>;
  setQuantities: (value: React.SetStateAction<Record<number, string>>) => void;
};

export const ProductsBlock: React.FC<ProductsBlockProps> = ({
  onAddToCart,
  cart,
  onRemoveFromCart,
  quantities,
  setQuantities,
}) => {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const lastProductRef = useRef<HTMLDivElement | null>(null);
  //   const [quantities, setQuantities] = useState<Record<number, string>>({});

  useEffect(() => {
    setPage(1);
  }, []);

  useEffect(() => {
    if (!lastProductRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && hasMore) {
        setPage((prev) => prev + 1);
      }
    });

    const el = lastProductRef.current;
    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [products, loading, hasMore]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (loading || !hasMore || page === 0) return;
      setLoading(true);
      const data = await getProductsApi(page);
      setProducts((prev) => [...prev, ...data.items]);
      setHasMore(data.items.length > 0);
      setLoading(false);
    };
    fetchProducts();
  }, [page]);

  const handleAddQuantity = (id: number) => {
    setQuantities((prev) => {
      const current = parseInt(prev[id] || "1", 10);
      return { ...prev, [id]: String(current + 1) };
    });
  };

  const handleRemoveQuantity = (id: number) => {
    setQuantities((prev) => {
      const current = parseInt(prev[id] || "1", 10);
      const next = current - 1;
      if (next <= 0) {
        onRemoveFromCart(id); // 👈 вызываем функцию удаления из корзины
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: String(next) };
    });
  };

  const handleChange = (id: number, value: string) => {
    if (/^\d*$/.test(value)) {
      setQuantities((prev) => {
        if (value === "0") {
          onRemoveFromCart(id); // 👈 при 0 — убираем из корзины
          const { [id]: _, ...rest } = prev;
          return rest;
        }
        return {
          ...prev,
          [id]: value,
        };
      });
    }
  };

  return (
    <div className={styles.container}>
      {products?.map((p, i) => {
        const isLast = i === products.length - 1;
        return (
          <div ref={isLast ? lastProductRef : null} key={p.id}>
            <Product
              data={p}
              onClick={() => onAddToCart(p)}
              inCart={cart.some((item) => item.id === p.id)}
              value={quantities[p.id] ?? "1"}
              onAdd={() => handleAddQuantity(p.id)}
              onRemove={() => handleRemoveQuantity(p.id)}
              onChange={(e) => handleChange(p.id, e.target.value)}
            />
          </div>
        );
      })}
      {loading && <Preloader />}
      {!hasMore && <p>There are no goods anymore :-(</p>}
    </div>
  );
};
