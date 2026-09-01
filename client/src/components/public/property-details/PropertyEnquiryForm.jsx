
import { useState } from "react";

import api from "../../../services/api";

import "./PropertyEnquiryForm.css";

const PropertyEnquiryForm = ({
  property,
}) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");


  /*
  =========================================
  HANDLE CHANGE
  =========================================
  */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");

    setSuccess("");
  };


  /*
  =========================================
  SUBMIT
  =========================================
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    setSuccess("");


    try {
      /*
      =====================================
      SEND ENQUIRY
      =====================================
      */

      const response = await api.post(
        "/enquiries",
        {
          property:
            property._id,

          name:
            form.name.trim(),

          phone:
            form.phone.trim(),

          email:
            form.email.trim(),

          message:
            form.message.trim(),
        }
      );


      /*
      =====================================
      SUCCESS
      =====================================
      */

      if (response.data.success) {

     

        setForm({
          name: "",
          phone: "",
          email: "",
          message: "",
        });

      } else {

        setError(
          response.data.message ||
            "Failed to submit enquiry."
        );

      }

    } catch (error) {

      console.error(
        "Enquiry submission error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to submit enquiry. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="property-enquiry">

      {/* =================================
          HEADER
      ================================= */}

      <span className="property-section-label">
        INTERESTED?
      </span>

      <h2>
        Send an Enquiry
      </h2>

      <p>
        Interested in this property?
        Send us your details and our
        team will get back to you.
      </p>


      {/* =================================
          SUCCESS
      ================================= */}

      {success && (
        <div className="property-enquiry-success">
          {success}
        </div>
      )}


      {/* =================================
          ERROR
      ================================= */}

      {error && (
        <div className="property-enquiry-error">
          {error}
        </div>
      )}


      {/* =================================
          FORM
      ================================= */}

      <form
        onSubmit={handleSubmit}
        className="property-enquiry-form"
      >

        {/* NAME */}

        <div className="enquiry-field">

          <label htmlFor="enquiry-name">
            Name
          </label>

          <input
            id="enquiry-name"
            type="text"
            name="name"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            required
          />

        </div>


        {/* PHONE */}

        <div className="enquiry-field">

          <label htmlFor="enquiry-phone">
            Phone
          </label>

          <input
            id="enquiry-phone"
            type="tel"
            name="phone"
            placeholder="Your phone number"
            value={form.phone}
            onChange={handleChange}
            required
          />

        </div>


        {/* EMAIL */}

        <div className="enquiry-field">

          <label htmlFor="enquiry-email">
            Email
          </label>

          <input
            id="enquiry-email"
            type="email"
            name="email"
            placeholder="Your email"
            value={form.email}
            onChange={handleChange}
          />

        </div>


        {/* MESSAGE */}

        <div className="enquiry-field">

          <label htmlFor="enquiry-message">
            Message
          </label>

          <textarea
            id="enquiry-message"
            name="message"
            rows="5"
            placeholder="I'm interested in this property..."
            value={form.message}
            onChange={handleChange}
          />

        </div>


        {/* SUBMIT */}

        <button
          type="submit"
          className="property-enquiry-submit"
          disabled={loading}
        >

          {loading
            ? "Sending..."
            : "Send Enquiry"}

        </button>

      </form>

    </div>
  );
};

export default PropertyEnquiryForm;