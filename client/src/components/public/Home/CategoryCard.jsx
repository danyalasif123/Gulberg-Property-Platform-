import { Link } from "react-router-dom";

import "./CategoryCard.css";

const CategoryCard = ({ category }) => {
  /*
  =========================================
  CATEGORY IMAGE
  =========================================
  */

  const getCategoryImage = () => {
    if (!category?.image) {
      return "";
    }

    if (typeof category.image === "string") {
      return category.image;
    }

    if (typeof category.image === "object") {
      return (
        category.image.url ||
        category.image.secure_url ||
        category.image.src ||
        ""
      );
    }

    return "";
  };


  /*
  =========================================
  CATEGORY NAME
  =========================================
  */

  const getCategoryName = () => {
    return (
      category?.name ||
      category?.title ||
      "Property"
    );
  };


  /*
  =========================================
  CATEGORY ID
  =========================================
  
  IMPORTANT:

  Property.category is stored as:

  ObjectId

  Therefore we send _id instead of slug.
  =========================================
  */

  const getCategoryId = () => {
    return category?._id || "";
  };


  const image =
    getCategoryImage();

  const name =
    getCategoryName();

  const categoryId =
    getCategoryId();


  return (
    <Link
      to={`/properties?category=${categoryId}`}
      className="category-card"
    >

      {/* =================================
          IMAGE
      ================================= */}

      <div className="category-card-image">

        {image ? (

          <img
            src={image}
            alt={name}
          />

        ) : (

          <div className="category-card-placeholder">
            <span>G</span>
          </div>

        )}

        <div className="category-card-overlay" />


        {/* =================================
            CONTENT
        ================================= */}

        <div className="category-card-content">

          <div>

            <span className="category-card-label">
              EXPLORE
            </span>

            <h3>
              {name}
            </h3>

          </div>

          <span className="category-card-arrow">
            →
          </span>

        </div>

      </div>

    </Link>
  );
};

export default CategoryCard;