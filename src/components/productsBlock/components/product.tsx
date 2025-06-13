import React from "react";
import { TProduct } from "../../../types/types";
import styles from "./product.module.scss";
import Image from "next/image";

type ProductProps = {
  data: TProduct;
  onClick: () => void;
  inCart?: boolean;
  value: string;
  onAdd: () => void;
  onRemove: () => void;
  onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Product: React.FC<ProductProps> = ({
  data,
  onClick,
  inCart,
  value,
  onAdd,
  onRemove,
  onChange,
}) => {
  const quantityLayout = (
    <div className={styles.container__quantityLayout}>
      <button onClick={onRemove}>-</button>
      <input type="text" value={value} onChange={onChange} name="quantity" />
      <button onClick={onAdd}>+</button>
    </div>
  );

  return (
    <div className={styles.container}>
      <Image
        src={data.image_url}
        alt={data.title}
        width={281}
        height={366}
        className={styles.container__img}
      />
      <h2 className={styles.container__title}>{data.title}</h2>
      <p className={styles.container__description}>{data.description}</p>
      <span className={styles.container__price}>Цена: {data.price}</span>
      {inCart ? quantityLayout : <button onClick={onClick}>Купить</button>}
    </div>
  );
};
