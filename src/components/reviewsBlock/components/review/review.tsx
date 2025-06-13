import { TReview } from "../../../../types/types";
import DOMPurify from "dompurify";
import styles from "./review.module.scss";

type ReviewProps = {
  data: TReview;
};

export const Review: React.FC<ReviewProps> = ({ data }) => {
  return (
    <div className={styles.container}>
      <div
        className={styles.container__content}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.text) }}
      />
    </div>
  );
};
