import {
  createProperty,
  getProperties,
  getPropertyById,
  getPropertyBySlug,
  updateProperty,
  deleteProperty
} from "../services/propertyService.js";

import generatePropertyId from "../utils/generatePropertyId.js";
import slugify from "../utils/slugify.js";


/*
=========================================
CREATE PROPERTY
=========================================
*/

export const createPropertyController =
  async (req, res) => {

    try {

      const {
        title,
        propertyType,
        purpose,
        category,
        society,
        block,
        plotNumber,
        street,
        size,
        price,
        description,
        features,
        location,
        images,
        status,
        verificationStatus,
        isFeatured
      } = req.body;


      /*
      =====================================
      REQUIRED FIELDS
      =====================================
      */

      if (
        !title ||
        !propertyType ||
        !purpose ||
        !category ||
        !society ||
        !size ||
        !price ||
        !description
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Required property fields are missing"
        });

      }


      /*
      =====================================
      PROPERTY ID
      =====================================
      */

      const propertyId =
        generatePropertyId({
          society,
          block,
          plotNumber
        });


      /*
      =====================================
      SLUG
      =====================================
      */

      const slug =
        slugify(
          `${title}-${society}-${block || ""}-${plotNumber || ""}`
        );


      /*
      =====================================
      CREATE
      =====================================
      */

      const property =
        await createProperty({

          propertyId,

          title,

          slug,

          propertyType,

          purpose,

          category,

          society,

          block,

          plotNumber,

          street,

          size,

          price,

          description,

          features,

          location,

          images,

          status:
            status || "draft",

          verificationStatus:
            verificationStatus ||
            "pending",

          isFeatured:
            isFeatured || false,

          createdBy:
            req.admin._id

        });


      return res.status(201).json({

        success: true,

        message:
          "Property created successfully",

        property

      });

    } catch (error) {

      console.error(
        "Create property error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to create property",

        error:
          error.message

      });

    }

  };


/*
=========================================
GET PROPERTIES
=========================================
*/

export const getPropertiesController =
  async (req, res) => {

    try {

      const {
        page,
        limit,
        search,
        propertyType,
        purpose,
        society,
        block,
        category,
        minPrice,
        maxPrice,
        minSize,
        maxSize,
        status,
        sort
      } = req.query;


      const result =
        await getProperties({

          page,

          limit,

          search,

          propertyType,

          purpose,

          society,

          block,

          /*
          Category is a slug here.

          Example:
          category=houses
          */

          category,

          minPrice,

          maxPrice,

          minSize,

          maxSize,

          status,

          sort

        });


      return res.status(200).json({

        success: true,

        ...result

      });

    } catch (error) {

      console.error(
        "Get properties error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch properties",

        error:
          error.message

      });

    }

  };


/*
=========================================
GET PROPERTY BY ID
=========================================
*/

export const getPropertyController =
  async (req, res) => {

    try {

      const property =
        await getPropertyById(
          req.params.id
        );


      if (!property) {

        return res.status(404).json({

          success: false,

          message:
            "Property not found"

        });

      }


      return res.status(200).json({

        success: true,

        property

      });

    } catch (error) {

      console.error(
        "Get property error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch property"

      });

    }

  };


/*
=========================================
UPDATE PROPERTY
=========================================
*/

export const updatePropertyController =
  async (req, res) => {

    try {

      const property =
        await updateProperty(
          req.params.id,
          req.body
        );


      if (!property) {

        return res.status(404).json({

          success: false,

          message:
            "Property not found"

        });

      }


      return res.status(200).json({

        success: true,

        message:
          "Property updated successfully",

        property

      });

    } catch (error) {

      console.error(
        "Update property error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to update property",

        error:
          error.message

      });

    }

  };


/*
=========================================
DELETE PROPERTY
=========================================
*/

export const deletePropertyController =
  async (req, res) => {

    try {

      const property =
        await deleteProperty(
          req.params.id
        );


      if (!property) {

        return res.status(404).json({

          success: false,

          message:
            "Property not found"

        });

      }


      return res.status(200).json({

        success: true,

        message:
          "Property deleted successfully"

      });

    } catch (error) {

      console.error(
        "Delete property error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to delete property",

        error:
          error.message

      });

    }

  };


/*
=========================================
UPDATE PROPERTY STATUS
=========================================
*/

export const updatePropertyStatusController =
  async (req, res) => {

    try {

      const { status } =
        req.body;


      const allowedStatuses = [
        "draft",
        "pending",
        "published",
        "reserved",
        "sold",
        "rejected"
      ];


      if (
        !allowedStatuses.includes(
          status
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid property status"

        });

      }


      const property =
        await updateProperty(
          req.params.id,
          {
            status
          }
        );


      if (!property) {

        return res.status(404).json({

          success: false,

          message:
            "Property not found"

        });

      }


      return res.status(200).json({

        success: true,

        message:
          `Property status changed to ${status}`,

        property

      });

    } catch (error) {

      console.error(
        "Update property status error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to update property status",

        error:
          error.message

      });

    }

  };


/*
=========================================
GET PROPERTY BY SLUG
=========================================
*/

export const getPropertyBySlugController =
  async (req, res) => {

    try {

      const property =
        await getPropertyBySlug(
          req.params.slug
        );


      if (!property) {

        return res.status(404).json({

          success: false,

          message:
            "Property not found"

        });

      }


      /*
      Increment views
      */

      property.views += 1;

      await property.save();


      return res.status(200).json({

        success: true,

        property

      });

    } catch (error) {

      console.error(
        "Get property by slug error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch property"

      });

    }

  };