import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/public/Home/Navbar";
import Footer from "../../components/public/Home/Footer";

import PropertyGallery from "../../components/public/property-details/PropertyGallery";
import PropertyOverview from "../../components/public/property-details/PropertyOverview";
import PropertyInfo from "../../components/public/property-details/PropertyInfo";
import PropertyLocation from "../../components/public/property-details/PropertyLocation";
import PropertyEnquiryForm from "../../components/public/property-details/PropertyEnquiryForm";

import api from "../../services/api";

import "./PropertyDetails.css";

const PropertyDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [property, setProperty] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  /*
  =========================================
  FETCH PROPERTY
  =========================================
  */

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/properties/${id}`
        );

        setProperty(
          response.data.property
        );
      } catch (error) {
        console.error(
          "Fetch property error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load property."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);


  /*
  =========================================
  LOADING
  =========================================
  */

  if (loading) {
    return (
      <div className="property-details-page">
<Navbar />

        <main className="property-details-loading">

          <div className="property-details-spinner" />

          <p>
            Loading property...
          </p>

        </main>

        <Footer />

      </div>
    );
  }


  /*
  =========================================
  ERROR
  =========================================
  */

  if (error || !property) {
    return (
      <div className="property-details-page">

        <Navbar />

        <main className="property-details-error-page">

          <div className="property-details-error-icon">
            G
          </div>

          <h1>
            Property Not Found
          </h1>

          <p>
            {error ||
              "The property you are looking for does not exist."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/properties")
            }
          >
            Back to Properties
          </button>

        </main>

        <Footer />

      </div>
    );
  }


  return (
    <div className="property-details-page">

      <Navbar />

      <main>

        <div className="property-details-container">


          {/* =================================
              BREADCRUMB
          ================================= */}

          <div className="property-breadcrumb">

            <Link to="/">
              Home
            </Link>

            <span>/</span>

            <Link to="/properties">
              Properties
            </Link>

            <span>/</span>

            <strong>
              {property.title ||
                "Property"}
            </strong>

          </div>


          {/* =================================
              GALLERY
          ================================= */}

          <PropertyGallery
            property={property}
          />


          {/* =================================
              MAIN CONTENT
          ================================= */}

          <div className="property-details-layout">

            {/* LEFT */}

            <div className="property-details-main">

              <PropertyOverview
                property={property}
              />

              <PropertyInfo
                property={property}
              />

              <PropertyLocation
                property={property}
              />

            </div>


            {/* RIGHT */}

            <aside className="property-details-sidebar">

              <PropertyEnquiryForm
                property={property}
              />

            </aside>

          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
};

export default PropertyDetails;