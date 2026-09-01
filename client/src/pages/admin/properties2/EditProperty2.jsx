import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminNavbar from "../../../components/admin/AdminNavbar";

import api from "../../../services/api";

import "./AddProperty.css";

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /*
   * =========================================
   * FORM
   * =========================================
   */

  const [form, setForm] = useState({
    title: "",
    propertyType: "plot",
    purpose: "sale",

    // Category ID from backend
    category: "",

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
  });

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
   * EXISTING IMAGES
   * =========================================
   */

  const [existingImages, setExistingImages] =
    useState([]);

  const [imagesToDelete, setImagesToDelete] =
    useState([]);

  /*
   * =========================================
   * NEW IMAGES
   * =========================================
   */

  const [newImages, setNewImages] =
    useState([]);

  const [newImagePreviews, setNewImagePreviews] =
    useState([]);

  /*
   * =========================================
   * STATES
   * =========================================
   */

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /*
   * =========================================
   * FETCH CATEGORIES
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
          api.get("/locations", {
            params: { type: "society" },
          }),
        ]);

        setCategories(
          categoriesResponse.data?.categories || []
        );

        setSocieties(
          societiesResponse.data?.locations || []
        );
      } catch (err) {
        console.error(
          "Fetch categories and locations error:",
          err
        );

        setError(
          err.response?.data?.message ||
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
   * LOAD PROPERTY
   * =========================================
   */

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get(
            `/properties/${id}`
          );

        const property =
          response.data?.property ||
          response.data?.data ||
          response.data;

        /*
         * Category can be:
         *
         * "68abc123..."
         *
         * OR
         *
         * {
         *   _id: "...",
         *   name: "Residential"
         * }
         */

        let categoryId = "";

        if (
          property.category &&
          typeof property.category ===
            "object"
        ) {
          categoryId =
            property.category._id || "";
        } else {
          categoryId =
            property.category || "";
        }

        setForm({
          title:
            property.title || "",

          propertyType:
            property.propertyType ||
            "plot",

          purpose:
            property.purpose ||
            "sale",

          category:
            categoryId,

          society:
            property.society ||
            "",

          block:
            property.block || "",

          plotNumber:
            property.plotNumber || "",

          street:
            property.street || "",

          sizeValue:
            property.size?.value || "",

          sizeUnit:
            property.size?.unit ||
            "marla",

          priceAmount:
            property.price?.amount || "",

          currency:
            property.price?.currency ||
            "PKR",

          description:
            property.description || "",

          features:
            Array.isArray(
              property.features
            )
              ? property.features.join(
                  ", "
                )
              : "",

          address:
            property.location?.address ||
            "",

          latitude:
            property.location?.latitude ??
            "",

          longitude:
            property.location?.longitude ??
            "",

          status:
            property.status ||
            "draft",

          isFeatured:
            property.isFeatured ||
            false,
        });

        setExistingImages(
          property.images || []
        );
      } catch (err) {
        console.error(
          "Fetch property error:",
          err
        );

        setError(
          err.response?.data?.message ||
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
   * =========================================
   * FETCH BLOCKS FOR SELECTED SOCIETY
   * =========================================
   */

  useEffect(() => {
    const fetchBlocks = async () => {
      if (!form.society) {
        setBlocks([]);
        return;
      }

      const selectedSociety = societies.find(
        (society) => society.name === form.society
      );

      if (!selectedSociety?._id) {
        setBlocks([]);
        return;
      }

      try {
        setBlocksLoading(true);

        const response = await api.get(
          "/locations",
          {
            params: {
              type: "block",
              parentLocation: selectedSociety._id,
            },
          }
        );

        setBlocks(
          response.data?.locations || []
        );
      } catch (err) {
        console.error(
          "Fetch blocks error:",
          err
        );

        setBlocks([]);
        setError(
          err.response?.data?.message ||
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
   * CLEANUP NEW IMAGE PREVIEWS
   * =========================================
   */

  useEffect(() => {
    return () => {
      newImagePreviews.forEach(
        (preview) => {
          if (preview?.url) {
            URL.revokeObjectURL(
              preview.url
            );
          }
        }
      );
    };
  }, [newImagePreviews]);

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

      ...(name === "society"
        ? { block: "" }
        : {}),
    }));
  };

  /*
   * =========================================
   * REMOVE EXISTING IMAGE
   * =========================================
   */

  const removeExistingImage = (
    index
  ) => {
    const image =
      existingImages[index];

    if (image?.publicId) {
      setImagesToDelete((prev) => [
        ...prev,
        image.publicId,
      ]);
    }

    setExistingImages((prev) =>
      prev.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
  };

  /*
   * =========================================
   * ADD NEW IMAGES
   * =========================================
   */

  const handleNewImages = (e) => {
    const selectedFiles =
      Array.from(
        e.target.files || []
      );

    setError("");

    if (!selectedFiles.length) {
      return;
    }

    /*
     * Maximum images
     */

    const totalImages =
      existingImages.length +
      newImages.length +
      selectedFiles.length;

    if (totalImages > MAX_IMAGES) {
      setError(
        `A property can have a maximum of ${MAX_IMAGES} images.`
      );

      e.target.value = "";

      return;
    }

    /*
     * File type
     */

    const invalidFiles =
      selectedFiles.filter(
        (file) =>
          !file.type.startsWith(
            "image/"
          )
      );

    if (invalidFiles.length) {
      setError(
        "Only image files are allowed."
      );

      e.target.value = "";

      return;
    }

    /*
     * File size
     */

    const oversizedFiles =
      selectedFiles.filter(
        (file) =>
          file.size >
          MAX_FILE_SIZE
      );

    if (oversizedFiles.length) {
      setError(
        "Each image must be smaller than 5 MB."
      );

      e.target.value = "";

      return;
    }

    /*
     * Create previews
     */

    const previews =
      selectedFiles.map(
        (file) => ({
          file,
          url: URL.createObjectURL(
            file
          ),
        })
      );

    setNewImages((prev) => [
      ...prev,
      ...selectedFiles,
    ]);

    setNewImagePreviews((prev) => [
      ...prev,
      ...previews,
    ]);

    e.target.value = "";
  };

  /*
   * =========================================
   * REMOVE NEW IMAGE
   * =========================================
   */

  const removeNewImage = (
    index
  ) => {
    const preview =
      newImagePreviews[index];

    if (preview?.url) {
      URL.revokeObjectURL(
        preview.url
      );
    }

    setNewImages((prev) =>
      prev.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );

    setNewImagePreviews((prev) =>
      prev.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
  };

  /*
   * =========================================
   * SAVE CHANGES
   * =========================================
   */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    /*
     * Validation
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

    /*
     * Require at least one image
     */

    if (
      existingImages.length +
        newImages.length ===
      0
    ) {
      setError(
        "Please keep at least one property image."
      );

      return;
    }

    setSaving(true);

    try {
      /*
       * =======================================
       * UPLOAD NEW IMAGES
       * =======================================
       */

      let uploadedImages = [];

      if (newImages.length > 0) {
        const imageFormData =
          new FormData();

        newImages.forEach((image) => {
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
          uploadResponse.data
            ?.images || [];
      }

      /*
       * =======================================
       * FINAL IMAGES
       * =======================================
       */

      const finalImages = [
        ...existingImages,
        ...uploadedImages,
      ];

      /*
       * =======================================
       * UPDATE PROPERTY
       * =======================================
       */

      await api.put(
        `/properties/${id}`,
        {
          title:
            form.title.trim(),

          propertyType:
            form.propertyType,

          purpose:
            form.purpose,

          /*
           * IMPORTANT
           *
           * Send Category MongoDB ID
           */

          category:
            form.category,

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
            finalImages,

          imagesToDelete,

          status:
            form.status,

          isFeatured:
            form.isFeatured,
        }
      );

      setSuccess(
        "Property updated successfully."
      );

      /*
       * Redirect after save
       */

      setTimeout(() => {
        navigate(
          "/admin/properties"
        );
      }, 1000);

    } catch (err) {
      console.error(
        "Update property error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update property."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * =========================================
   * LOADING
   * =========================================
   */

  if (loading) {
    return (
      <div className="admin-layout">

        <AdminSidebar />

        <div className="admin-main">

          <AdminNavbar />

          <main className="add-property-content">

            <div className="form-section">
              Loading property...
            </div>

          </main>

        </div>

      </div>
    );
  }

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
                Edit Property
              </h2>

              <p>
                Update property
                information and images.
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
                    value={
                      form.title
                    }
                    onChange={
                      handleChange
                    }
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

                {/* =================================
                    CATEGORY FROM BACKEND
                ================================= */}

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
                      saving
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
                        No categories
                        available. Create
                        a category first.
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
                  Specify the property's
                  location.
                </p>

              </div>

              <div className="form-grid">

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
                      saving
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
                          key={society._id}
                          value={society.name}
                        >
                          {society.name}
                        </option>
                      )
                    )}

                  </select>

                  {!societiesLoading &&
                    societies.length === 0 && (
                      <small className="field-help-error">
                        No societies available.
                        Create one from Admin → Locations.
                      </small>
                    )}

                </div>

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
                      saving ||
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
                          key={block._id}
                          value={block.name}
                        >
                          {block.name}
                        </option>
                      )
                    )}
                  </select>

                  {!blocksLoading &&
                    form.society &&
                    blocks.length === 0 && (
                      <small className="field-help-error">
                        No blocks available for this society.
                      </small>
                    )}

                </div>

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
                  />

                </div>

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
                  />

                </div>

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
                  />

                </div>

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
                  />

                </div>

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

              </div>

              <div className="form-grid">

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
                    required
                  />

                </div>

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
                    required
                  />

                </div>

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
                EXISTING IMAGES
            ================================= */}

            <section className="form-section">

              <div className="form-section-header">

                <h3>
                  Existing Images
                </h3>

                <p>
                  Remove images that you
                  no longer want.
                </p>

              </div>

              {existingImages.length ===
              0 ? (
                <div className="empty-image-message">
                  No existing images.
                </div>
              ) : (
                <div className="image-preview-grid">

                  {existingImages.map(
                    (image, index) => (
                      <div
                        className={`image-preview-card ${
                          index === 0
                            ? "cover-image"
                            : ""
                        }`}
                        key={
                          image.publicId ||
                          image.url ||
                          index
                        }
                      >

                        <img
                          src={
                            image.url
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
                            removeExistingImage(
                              index
                            )
                          }
                        >
                          ×
                        </button>

                      </div>
                    )
                  )}

                </div>
              )}

            </section>

            {/* =================================
                NEW IMAGES
            ================================= */}

            <section className="form-section">

              <div className="form-section-header">

                <h3>
                  Add New Images
                </h3>

                <p>
                  Add additional property
                  images.
                </p>

              </div>

              <div className="image-upload">

                <label
                  htmlFor="new-property-images"
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
                  id="new-property-images"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  onChange={
                    handleNewImages
                  }
                  hidden
                />

              </div>

              {newImages.length > 0 && (
                <div className="image-preview-section">

                  <div className="image-preview-header">

                    <span>
                      {newImages.length}{" "}
                      new{" "}
                      {newImages.length ===
                      1
                        ? "image"
                        : "images"}
                    </span>

                  </div>

                  <div className="image-preview-grid">

                    {newImages.map(
                      (image, index) => (
                        <div
                          className="image-preview-card"
                          key={`${image.name}-${index}`}
                        >

                          <img
                            src={
                              newImagePreviews[
                                index
                              ]?.url
                            }
                            alt={`New property ${
                              index + 1
                            }`}
                          />

                          <span className="new-image-label">
                            New
                          </span>

                          <button
                            type="button"
                            className="remove-image-button"
                            onClick={() =>
                              removeNewImage(
                                index
                              )
                            }
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

              </div>

              <div className="form-grid">

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
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-property-button"
                disabled={
                  saving ||
                  categoriesLoading ||
                  categories.length === 0
                }
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </form>

        </main>

      </div>

    </div>
  );
};

export default EditProperty;