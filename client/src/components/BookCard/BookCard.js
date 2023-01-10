import React from "react";

function ProductCard(props) {
  const { data } = props;

  return (
    <div className="grid-item">
      <img className="book-item" src="../../media/book_image.jpg" alt="" />
      <div className="book-card-info-container">
        <p>{data.title}</p>
        <p>{data.author}</p>
        <p>{data.price}</p>
      </div>
    </div>
  );
}

export default ProductCard;
