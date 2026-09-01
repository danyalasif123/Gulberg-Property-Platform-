import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminNavbar from "../../../components/admin/AdminNavbar";

import api from "../../../services/api";

import "./AddProperty2.css";

const initialForm = {
  title: "",
  propertyType: "plot",
  purpose: "sale",

  // Category MongoDB ID
  category: "",

  // Location names
  society: "",
  block: "",
  plotNumber: "",
  street: "",

  sizeValue: "",
  sizeUnit: "marla",

  priceAmount: "",
  currency: "PKR",

  description: "",
  features: "",

  address: "",
  latitude: "",
  longitude: "",

  status: "draft",
  isFeatured: false,
};

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const AddProperty = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);

  /*
   * =========================================
   * CATEGORIES
   * =========================================
   */

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  /*
   * =========================================
   * LOCATIONS
   * =========================================
   */

  const [societies, setSocieties] = useState([]);
  const [blocks, setBlocks] = useState([]);

  const [societiesLoading, setSocietiesLoading] =
    useState(true);

  const [blocksLoading, setBlocksLoading] =
    useState(false);

  /*
   * =========================================
   * IMAGES
   * =========================================
   */

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] =
    useState([]);

  /*
   * =========================================
   * FORM STATE
   * =========================================
   */

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   * =========================================
   * FETCH CATEGORIES + SOCIETIES
   * =========================================
   */

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setCategoriesLoading(true);
        setSocietiesLoading(true);

        const [
          categoriesResponse,
          societiesResponse,
        ] = await Promise.all([
          api.get("/categories"),
          api.get("/locations?type=society"),
        ]);

        const fetchedCategories =
          categoriesResponse.data?.categories || [];

        const fetchedSocieties =
          societiesResponse.data?.locations || [];

        setCategories(fetchedCategories);
        setSocieties(fetchedSocieties);

        // Do not automatically select a society.
        // The admin must explicitly choose one.
      } catch (error) {
        console.error(
          "Fetch property form data error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load categories and locations."
        );
      } finally {
        setCategoriesLoading(false);
        setSocietiesLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  /*
   * =========================================
   * FETCH BLOCKS
   * =========================================
   */

  useEffect(() => {
    const fetchBlocks = async () => {
      if (!form.society) {
        setBlocks([]);
        return;
      }

      try {
        setBlocksLoading(true);

        const selectedSociety = societies.find(
          (society) => society.name === form.society
        );

        if (!selectedSociety?._id) {
          setBlocks([]);
          return;
        }

        const response = await api.get(
          "/locations",
          {
            params: {
              type: "block",
              parentLocation: selectedSociety._id,
            },
          }
        );

        const fetchedBlocks =
          response.data?.locations || [];

        setBlocks(fetchedBlocks);
      } catch (error) {
        console.error(
          "Fetch blocks error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load blocks."
        );
      } finally {
        setBlocksLoading(false);
      }
    };

    fetchBlocks();
  }, [form.society, societies]);

  /*
   * =========================================
   * HANDLE FORM CHANGE
   * =========================================
   */

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    /*
     * When society changes,
     * reset block.
     */

    if (name === "society") {
      setForm((previous) => ({
        ...previous,
        society: value,
        block: "",
      }));
    }
  };

  /*
   * =========================================
   * HANDLE IMAGE SELECTION
   * =========================================
   */

  const handleImagesChange = (e) => {
    const selectedFiles = Array.from(
      e.target.files || []
    );

    setError("");

    if (selectedFiles.length === 0) {
      return;
    }

    /*
     * Maximum number of images
     */

    if (selectedFiles.length > MAX_IMAGES) {
      setError(
        `You can upload a maximum of ${MAX_IMAGES} images.`
      );

      e.target.value = "";

      return;
    }

    /*
     * Validate file type
     */

    const invalidFiles =
      selectedFiles.filter(
        (file) =>
          !file.type.startsWith("image/")
      );

    if (invalidFiles.length > 0) {
      setError(
        "Only image files are allowed."
      );

      e.target.value = "";

      return;
    }

    /*
     * Validate file size
     */

    const oversizedFiles =
      selectedFiles.filter(
        (file) =>
          file.size > MAX_FILE_SIZE
      );

    if (oversizedFiles.length > 0) {
      setError(
        "Each image must be smaller than 5 MB."
      );

      e.target.value = "";

      return;
    }

    /*
     * Clean previous previews
     */

    imagePreviews.forEach((preview) => {
      if (preview?.url) {
        URL.revokeObjectURL(
          preview.url
        );
      }
    });

    /*
     * Create previews
     */

    const previews =
      selectedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));

    setImages(selectedFiles);
    setImagePreviews(previews);

    /*
     * Reset input so same file
     * can be selected again.
     */

    e.target.value = "";
  };

  /*
   * =========================================
   * REMOVE IMAGE
   * =========================================
   */

  const removeImage = (index) => {
    const preview =
      imagePreviews[index];

    if (preview?.url) {
      URL.revokeObjectURL(
        preview.url
      );
    }

    setImages((prev) =>
      prev.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );

    setImagePreviews((prev) =>
      prev.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
  };

  /*
   * =========================================
   * CLEAN UP IMAGE URLS
   * =========================================
   */

  useEffect(() => {
    return () => {
      imagePreviews.forEach(
        (preview) => {
          if (preview?.url) {
            URL.revokeObjectURL(
              preview.url
            );
          }
        }
      );
    };
  }, [imagePreviews]);

  /*
   * =========================================
   * SUBMIT PROPERTY
   * =========================================
   */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    /*
     * Basic validation
     */

    if (!form.title.trim()) {
      setError(
        "Property title is required."
      );

      return;
    }

    if (!form.category) {
      setError(
        "Please select a category."
      );

      return;
    }

    if (!form.society) {
      setError(
        "Please select a society."
      );

      return;
    }

    if (!form.sizeValue) {
      setError(
        "Property size is required."
      );

      return;
    }

    if (!form.priceAmount) {
      setError(
        "Property price is required."
      );

      return;
    }

    if (!form.description.trim()) {
      setError(
        "Property description is required."
      );

      return;
    }

    setLoading(true);

    try {
      let uploadedImages = [];

      /*
       * =======================================
       * UPLOAD IMAGES TO CLOUDINARY
       * =======================================
       */

      if (images.length > 0) {
        const imageFormData =
          new FormData();

        images.forEach((image) => {
          imageFormData.append(
            "images",
            image
          );
        });

        const uploadResponse =
          await api.post(
            "/uploads/property-images",
            imageFormData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        uploadedImages =
          uploadResponse.data?.images ||
          [];
      }

      /*
       * =======================================
       * CREATE PROPERTY PAYLOAD
       * =======================================
       */

      const payload = {
        title: form.title.trim(),

        propertyType:
          form.propertyType,

        purpose:
          form.purpose,

        /*
         * MongoDB Category ID
         */

        category:
          form.category,

        /*
         * Location names
         */

        society:
          form.society,

        block:
          form.block.trim(),

        plotNumber:
          form.plotNumber.trim(),

        street:
          form.street.trim(),

        size: {
          value: Number(
            form.sizeValue
          ),

          unit:
            form.sizeUnit,
        },

        price: {
          amount: Number(
            form.priceAmount
          ),

          currency:
            form.currency,
        },

        description:
          form.description.trim(),

        features:
          form.features
            .split(",")
            .map((feature) =>
              feature.trim()
            )
            .filter(Boolean),

        location: {
          address:
            form.address.trim(),

          latitude:
            form.latitude
              ? Number(
                  form.latitude
                )
              : undefined,

          longitude:
            form.longitude
              ? Number(
                  form.longitude
                )
              : undefined,
        },

        images:
          uploadedImages,

        status:
          form.status,

        isFeatured:
          form.isFeatured,
      };

      /*
       * =======================================
       * CREATE PROPERTY
       * =======================================
       */

      await api.post(
        "/properties",
        payload
      );

      setSuccess(
        "Property created successfully."
      );

      /*
       * Redirect
       */

      setTimeout(() => {
        navigate(
          "/admin/properties"
        );
      }, 1000);

    } catch (error) {
      console.error(
        "Create property error:",
        error
      );

      const validationErrors =
        error.response?.data
          ?.errors;

      if (
        validationErrors?.length
      ) {
        setError(
          validationErrors
            .map(
              (item) =>
                item.message
            )
            .join(" ")
        );
      } else {
        setError(
          error.response?.data
            ?.message ||
            "Failed to create property."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================
   * RENDER
   * =========================================
   */

  return (
    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-main">

        <AdminNavbar />

        <main className="add-property-content">

          {/* =================================
              HEADER
          ================================= */}

          <div className="add-property-header">

            <div>

              <h2>
                Add Property
              </h2>

              <p>
                Create a new property
                listing.
              </p>

            </div>

            <button
              type="button"
              className="back-button"
              onClick={() =>
                navigate(
                  "/admin/properties"
                )
              }
            >
              Back to Properties
            </button>

          </div>

          {/* =================================
              ALERTS
          ================================= */}

          {error && (
            <div className="form-alert form-alert-error">
              {error}
            </div>
          )}

          {success && (
            <div className="form-alert form-alert-success">
              {success}
            </div>
          )}

          {/* =================================
              FORM
          ================================= */}

          <form
            className="property-form"
            onSubmit={handleSubmit}
          >

            {/* =================================
                PROPERTY INFORMATION
            ================================= */}

            <section className="form-section">

              <div className="form-section-header">

                <h3>
                  Property Information
                </h3>

                <p>
                  Basic information about
                  the property.
                </p>

              </div>

              <div className="form-grid">

                {/* Title */}

                <div className="form-field full-width">

                  <label>
                    Property Title *
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. 7 Marla Residential Plot"
                    required
                  />

                </div>

                {/* Property Type */}

                <div className="form-field">

                  <label>
                    Property Type *
                  </label>

                  <select
                    name="propertyType"
                    value={
                      form.propertyType
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="plot">
                      Plot
                    </option>

                    <option value="house">
                      House
                    </option>

                    <option value="apartment">
                      Apartment
                    </option>

                    <option value="farmhouse">
                      Farmhouse
                    </option>

                    <option value="commercial">
                      Commercial
                    </option>

                  </select>

                </div>

                {/* Purpose */}

                <div className="form-field">

                  <label>
                    Purpose *
                  </label>

                  <select
                    name="purpose"
                    value={
                      form.purpose
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="sale">
                      Sale
                    </option>

                    <option value="rent">
                      Rent
                    </option>

                  </select>

                </div>

                {/* CATEGORY */}

                <div className="form-field">

                  <label>
                    Category *
                  </label>

                  <select
                    name="category"
                    value={
                      form.category
                    }
                    onChange={
                      handleChange
                    }
                    required
                    disabled={
                      categoriesLoading ||
                      loading
                    }
                  >

                    <option value="">
                      {categoriesLoading
                        ? "Loading categories..."
                        : "Select category"}
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={
                            category._id
                          }
                          value={
                            category._id
                          }
                        >
                          {
                            category.name
                          }
                        </option>
                      )
                    )}

                  </select>

                  {!categoriesLoading &&
                    categories.length ===
                      0 && (
                      <small className="field-help-error">
                        No categories available.
                        Create a category first.
                      </small>
                    )}

                </div>

              </div>

            </section>


            {/* =================================
                LOCATION
            ================================= */}

            <section className="form-section">

              <div className="form-section-header">

                <h3>
                  Location
                </h3>

                <p>
                  Select the society and
                  block from your managed
                  locations.
                </p>

              </div>

              <div className="form-grid">

                {/* SOCIETY FROM BACKEND */}

                <div className="form-field">

                  <label>
                    Society *
                  </label>

                  <select
                    name="society"
                    value={
                      form.society
                    }
                    onChange={
                      handleChange
                    }
                    required
                    disabled={
                      societiesLoading ||
                      loading
                    }
                  >

                    <option value="">
                      {societiesLoading
                        ? "Loading societies..."
                        : "Select society"}
                    </option>

                    {societies.map(
                      (society) => (
                        <option
                          key={
                            society._id
                          }
                          value={
                            society.name
                          }
                        >
                          {
                            society.name
                          }
                        </option>
                      )
                    )}

                  </select>

                  {!societiesLoading &&
                    societies.length ===
                      0 && (
                      <small className="field-help-error">
                        No societies available.
                        Create one from
                        Admin → Locations.
                      </small>
                    )}

                </div>


                {/* BLOCK FROM BACKEND */}

                <div className="form-field">

                  <label>
                    Block
                  </label>

                  <select
                    name="block"
                    value={
                      form.block
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      blocksLoading ||
                      loading ||
                      !form.society
                    }
                  >

                    <option value="">
                      {blocksLoading
                        ? "Loading blocks..."
                        : !form.society
                        ? "Select society first"
                        : "Select block"}
                    </option>

                    {blocks.map(
                      (block) => (
                        <option
                          key={
                            block._id
                          }
                          value={
                            block.name
                          }
                        >
                          {
                            block.name
                          }
                        </option>
                      )
                    )}

                  </select>

                  {!blocksLoading &&
                    form.society &&
                    blocks.length ===
                      0 && (
                      <small className="field-help-error">
                        No blocks available.
                        Create blocks from
                        Admin → Locations.
                      </small>
                    )}

                </div>


                {/* Plot Number */}

                <div className="form-field">

                  <label>
                    Plot Number
                  </label>

                  <input
                    type="text"
                    name="plotNumber"
                    value={
                      form.plotNumber
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. 125"
                  />

                </div>


                {/* Street */}

                <div className="form-field">

                  <label>
                    Street
                  </label>

                  <input
                    type="text"
                    name="street"
                    value={
                      form.street
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. 18"
                  />

                </div>


                {/* Address */}

                <div className="form-field full-width">

                  <label>
                    Address
                  </label>

                  <input
                    type="text"
                    name="address"
                    value={
                      form.address
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Full property address"
                  />

                </div>


                {/* Latitude */}

                <div className="form-field">

                  <label>
                    Latitude
                  </label>

                  <input
                    type="number"
                    name="latitude"
                    value={
                      form.latitude
                    }
                    onChange={
                      handleChange
                    }
                    step="any"
                    placeholder="e.g. 33.6844"
                  />

                </div>


                {/* Longitude */}

                <div className="form-field">

                  <label>
                    Longitude
                  </label>

                  <input
                    type="number"
                    name="longitude"
                    value={
                      form.longitude
                    }
                    onChange={
                      handleChange
                    }
                    step="any"
                    placeholder="e.g. 73.0479"
                  />

                </div>

              </div>

            </section>


            {/* =================================
                SIZE & PRICE
            ================================= */}

            <section className="form-section">

              <div className="form-section-header">

                <h3>
                  Size & Price
                </h3>

                <p>
                  Enter property size and
                  pricing.
                </p>

              </div>

              <div className="form-grid">

                {/* Size */}

                <div className="form-field">

                  <label>
                    Size *
                  </label>

                  <input
                    type="number"
                    name="sizeValue"
                    value={
                      form.sizeValue
                    }
                    onChange={
                      handleChange
                    }
                    min="0"
                    step="0.01"
                    placeholder="e.g. 7"
                    required
                  />

                </div>


                {/* Unit */}

                <div className="form-field">

                  <label>
                    Unit *
                  </label>

                  <select
                    name="sizeUnit"
                    value={
                      form.sizeUnit
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="marla">
                      Marla
                    </option>

                    <option value="kanal">
                      Kanal
                    </option>

                    <option value="sqft">
                      Sq Ft
                    </option>

                  </select>

                </div>


                {/* Price */}

                <div className="form-field">

                  <label>
                    Price *
                  </label>

                  <input
                    type="number"
                    name="priceAmount"
                    value={
                      form.priceAmount
                    }
                    onChange={
                      handleChange
                    }
                    min="0"
                    placeholder="e.g. 13500000"
                    required
                  />

                </div>


                {/* Currency */}

                <div className="form-field">

                  <label>
                    Currency
                  </label>

                  <select
                    name="currency"
                    value={
                      form.currency
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="PKR">
                      PKR
                    </option>

                  </select>

                </div>

              </div>

            </section>


            {/* =================================
                DESCRIPTION
            ================================= */}

            <section className="form-section">

              <div className="form-section-header">

                <h3>
                  Description
                </h3>

                <p>
                  Give buyers useful
                  information about the
                  property.
                </p>

              </div>

              <div className="form-field">

                <label>
                  Description *
                </label>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Describe the property..."
                  rows="6"
                  required
                />

              </div>

            </section>


            {/* =================================
                FEATURES
            ================================= */}

            <section className="form-section">

              <div className="form-section-header">

                <h3>
                  Features
                </h3>

                <p>
                  Separate features using
                  commas.
                </p>

              </div>

              <div className="form-field">

                <label>
                  Features
                </label>

                <input
                  type="text"
                  name="features"
                  value={
                    form.features
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Corner, Possession, Developed Area"
                />

              </div>

            </section>


            {/* =================================
                IMAGES
            ================================= */}

            <section className="form-section">

              <div className="form-section-header">

                <h3>
                  Property Images
                </h3>

                <p>
                  Add up to 10 images.
                  The first image will
                  be used as the cover
                  image.
                </p>

              </div>

              <div className="image-upload">

                <label
                  htmlFor="property-images"
                  className="image-upload-box"
                >

                  <div className="upload-icon">
                    +
                  </div>

                  <strong>
                    Choose property
                    images
                  </strong>

                  <span>
                    PNG, JPG or WEBP ·
                    Maximum 5 MB each
                  </span>

                </label>

                <input
                  id="property-images"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  onChange={
                    handleImagesChange
                  }
                  hidden
                />

              </div>

              {images.length > 0 && (
                <div className="image-preview-section">

                  <div className="image-preview-header">

                    <span>
                      {images.length}{" "}
                      {images.length === 1
                        ? "image"
                        : "images"}{" "}
                      selected
                    </span>

                    <small>
                      First image = Cover
                    </small>

                  </div>

                  <div className="image-preview-grid">

                    {images.map(
                      (image, index) => (
                        <div
                          className={`image-preview-card ${
                            index === 0
                              ? "cover-image"
                              : ""
                          }`}
                          key={`${image.name}-${index}`}
                        >

                          <img
                            src={
                              imagePreviews[
                                index
                              ]?.url
                            }
                            alt={`Property ${
                              index + 1
                            }`}
                          />

                          {index === 0 && (
                            <span className="cover-label">
                              Cover
                            </span>
                          )}

                          <button
                            type="button"
                            className="remove-image-button"
                            onClick={() =>
                              removeImage(
                                index
                              )
                            }
                            aria-label={`Remove image ${
                              index + 1
                            }`}
                          >
                            ×
                          </button>

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

            </section>


            {/* =================================
                PUBLISHING
            ================================= */}

            <section className="form-section">

              <div className="form-section-header">

                <h3>
                  Publishing
                </h3>

                <p>
                  Control the visibility
                  of the property.
                </p>

              </div>

              <div className="form-grid">

                {/* Status */}

                <div className="form-field">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      form.status
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="draft">
                      Draft
                    </option>

                    <option value="pending">
                      Pending
                    </option>

                    <option value="published">
                      Published
                    </option>

                  </select>

                </div>


                {/* Featured */}

                <div className="featured-field">

                  <label className="checkbox-label">

                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={
                        form.isFeatured
                      }
                      onChange={
                        handleChange
                      }
                    />

                    <span>
                      Featured Property
                    </span>

                  </label>

                  <small>
                    Featured properties
                    can be highlighted on
                    the public website.
                  </small>

                </div>

              </div>

            </section>


            {/* =================================
                ACTIONS
            ================================= */}

            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() =>
                  navigate(
                    "/admin/properties"
                  )
                }
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-property-button"
                disabled={
                  loading ||
                  categoriesLoading ||
                  societiesLoading ||
                  categories.length === 0 ||
                  societies.length === 0
                }
              >
                {loading
                  ? "Creating..."
                  : "Create Property"}
              </button>

            </div>

          </form>

        </main>

      </div>

    </div>
  );
};

export default AddProperty;