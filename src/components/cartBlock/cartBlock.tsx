"use client";
import { IMaskInput } from "react-imask";
import { TProduct, TProductOrder } from "../../types/types";
import { useEffect, useState } from "react";
import { orderApi } from "../../api/orderApi";

import styles from "./cartBlock.module.scss";
import { Modal } from "../../shared/Modal/modal";

type CartBlockProps = {
  cart: TProduct[];
  setCart: React.Dispatch<React.SetStateAction<TProduct[]>>;
  quantities: Record<number, string>;
  setQuantities: (value: React.SetStateAction<Record<number, string>>) => void;
};

export const CartBlock: React.FC<CartBlockProps> = ({
  cart,
  setCart,
  quantities,
  setQuantities,
}) => {
  const [values, setValues] = useState<{ phone: string }>({
    phone:
      typeof window !== "undefined" ? localStorage.getItem("phone") || "" : "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("quantities", JSON.stringify(quantities));
  }, [quantities]);

  useEffect(() => {
    localStorage.setItem("phone", values.phone);
  }, [values.phone]);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = evt.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();

    setError(null);
    const orderItems = cart
      .map((product) => {
        const quantity = parseInt(quantities[product.id] || "1", 10);
        if (!quantity || isNaN(quantity)) return null;
        return { id: product.id, quantity };
      })
      .filter(Boolean) as TProductOrder[];

    const phone = values.phone.replace(/\D/g, "");

    try {
      const result = await orderApi({ phone: phone, cart: orderItems });
      if (result.success === 0) {
        setError(result.error);
        handleOpenModal();
        return;
      }
      handleOpenModal();
      setValues({ phone: "" });
      setCart([]);
      setQuantities({});
      localStorage.removeItem("cart");
      localStorage.removeItem("quantities");
      localStorage.removeItem("phone");
      return result;
    } catch (err) {
      setError("Что-то пошло не так. Попробуйте ещё раз.");
      handleOpenModal();
    }
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  const modalLayout = (
    <>
      <Modal onClose={handleCloseModal}>
        {error ? (
          <h2 style={{ fontSize: 36 }}>Ошибка: {error}</h2>
        ) : (
          <h2 style={{ fontSize: 36 }}>Поздравляем с покупкой!</h2>
        )}
      </Modal>
    </>
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.container__title}>Добавленные товары</h2>
      <div className={styles.container__productList}>
        {cart.map((c) => (
          <div className={styles.container__productList__item} key={c.id}>
            <span className={styles.container__productList__item__title}>
              {c.title}
            </span>
            <span className={styles.container__productList__item__quantity}>
              x{quantities[c.id] || 1}
            </span>
            <span className={styles.container__productList__item__price}>
              {c.price * (Number(quantities[c.id]) || 1)} ₽
            </span>
          </div>
        ))}
      </div>
      <form className={styles.container__form} onSubmit={handleSubmit}>
        <IMaskInput
          mask="+7 (000) 000-00-00"
          placeholder="+7 (___) ___ __-__"
          value={values.phone}
          onChange={handleChange}
          name="phone"
          className={styles.container__form__input}
        />
        <button type="submit" disabled={!values.phone}>
          заказать
        </button>
      </form>
      {isOpen && modalLayout}
    </div>
  );
};
