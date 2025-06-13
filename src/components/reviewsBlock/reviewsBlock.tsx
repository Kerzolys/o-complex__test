"use client";
import { useEffect, useState } from "react";
import { getReviewsApi } from "../../api/getReviewsApi";
import { TReview } from "../../types/types";
import { Review } from "./components/review/review";
import styles from "./reviewsBlock.module.scss";

export const ReviewsBlock = () => {
  const [reviews, setReviews] = useState<TReview[] | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      const data = await getReviewsApi();
      setReviews(data);
    };
    fetchReviews();
  }, []);
  return (
    <div className={styles.container}>
      {reviews?.map((r) => (
        <Review data={r} key={r.id}/>
      ))}
    </div>
  );
};
