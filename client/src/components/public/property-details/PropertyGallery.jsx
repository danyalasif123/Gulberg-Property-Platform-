import { useState } from "react";

import "./PropertyGallery.css";

const PropertyGallery = ({
  property,
}) => {
  const [activeImage, setActiveImage] =
    useState(0);


  /*
  =========================================
  GET IMAGES
  =========================================
  */

  const images =
    property?.images?.length
      ? property.images
      : [];


  const getImageUrl = (image) => {
    if (!image) {
      return "/placeholder-property.jpg";
    }

    if (typeof image === "string") {
      return image;
    }

    return (
      image.url ||
      image.secure_url ||
      image.path ||
      "/placeholder-property.jpg"
    );
  };


  /*
  =========================================
  FALLBACK
  =========================================
  */

  if (!images.length) {
    return (
      <div className="property-gallery">

        <div className="property-gallery-main">

          <img
            src="/placeholder-property.jpg"
            alt="Property"
          />

        </div>

      </div>
    );
  }


  return (
    <div className="property-gallery">

      {/* =================================
          MAIN IMAGE
      ================================= */}

      <div className="property-gallery-main">

        <img
          src={getImageUrl(
            images[activeImage]
          )}
          alt={
            property.title ||
            "Property"
          }
        />

        {property.purpose && (
          <span className="property-gallery-purpose">
            {property.purpose}
          </span>
        )}

      </div>


      {/* =================================
          THUMBNAILS
      ================================= */}

      {images.length > 1 && (
        <div className="property-gallery-thumbnails">

          {images.map(
            (image, index) => (
              <button
                type="button"
                key={index}
                className={
                  index === activeImage
                    ? "property-gallery-thumbnail active"
                    : "property-gallery-thumbnail"
                }
                onClick={() =>
                  setActiveImage(index)
                }
              >

                <img
                  src={getImageUrl(
                    image
                  )}
                  alt={`Property ${index + 1}`}
                />

              </button>
            )
          )}

        </div>
      )}

    </div>
  );
};

export default PropertyGallery;