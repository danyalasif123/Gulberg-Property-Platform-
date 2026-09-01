import {
  createLocation,
  getLocations,
  getLocationById,
  getLocationBySlug,
  updateLocation,
  deleteLocation,
} from "../services/locationService.js";

import slugify from "../utils/slugify.js";

/*
=========================================
CREATE LOCATION
=========================================
*/

export const createLocationController = async (
  req,
  res
) => {
  try {
    const {
      name,
      description,
      image,
      type,
      parentLocation,
      isActive,
      displayOrder,
    } = req.body;

    console.log(
      "Create location body:",
      req.body
    );

    /*
    =========================================
    VALIDATE NAME
    =========================================
    */

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Location name is required",
      });
    }

    /*
    =========================================
    VALIDATE TYPE
    =========================================
    */

    const allowedTypes = [
      "society",
      "block",
      "area",
    ];

    const locationType =
      type || "area";

    if (
      !allowedTypes.includes(
        locationType
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid location type",
      });
    }

    /*
    =========================================
    BLOCK MUST HAVE PARENT
    =========================================
    */

    if (
      locationType === "block" &&
      !parentLocation
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A block must belong to a society",
      });
    }

    /*
    =========================================
    SOCIETY / AREA MUST NOT HAVE PARENT
    =========================================
    */

    const finalParentLocation =
      locationType === "block"
        ? parentLocation
        : null;

    /*
    =========================================
    VERIFY PARENT SOCIETY
    =========================================
    */

    if (
      locationType === "block"
    ) {
      const parent =
        await getLocationById(
          parentLocation
        );

      if (!parent) {
        return res.status(404).json({
          success: false,
          message:
            "Parent society not found",
        });
      }

      if (
        parent.type !== "society"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "A block can only belong to a society",
        });
      }
    }

    /*
    =========================================
    GENERATE SLUG
    =========================================
    */

    const slug = slugify(
      name.trim()
    );

    /*
    =========================================
    CHECK DUPLICATE
    =========================================
    */

    const existingLocation =
      await getLocationBySlug(
        slug
      );

    if (existingLocation) {
      return res.status(409).json({
        success: false,
        message:
          "Location already exists",
      });
    }

    /*
    =========================================
    CREATE LOCATION
    =========================================
    */

    const location =
      await createLocation({
        name: name.trim(),

        slug,

        description:
          description?.trim() || "",

        image:
          image?.trim() || "",

        type: locationType,

        parentLocation:
          finalParentLocation,

        isActive:
          isActive !== undefined
            ? Boolean(isActive)
            : true,

        displayOrder:
          displayOrder !== undefined
            ? Number(displayOrder)
            : 0,

        createdBy:
          req.admin._id,
      });

    /*
    =========================================
    SUCCESS
    =========================================
    */

    return res.status(201).json({
      success: true,
      message:
        "Location created successfully",
      location,
    });
  } catch (error) {
    console.error(
      "Create location error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create location",
      error: error.message,
    });
  }
};


/*
=========================================
GET LOCATIONS
=========================================
*/

export const getLocationsController =
  async (req, res) => {
    try {
      const {
        includeInactive,
        type,
        parentLocation,
      } = req.query;

      const locations =
        await getLocations({
          includeInactive:
            includeInactive ===
            "true",

          type,

          parentLocation,
        });

      return res.status(200).json({
        success: true,
        locations,
      });
    } catch (error) {
      console.error(
        "Get locations error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch locations",
        error: error.message,
      });
    }
  };


/*
=========================================
GET SINGLE LOCATION
=========================================
*/

export const getLocationController =
  async (req, res) => {
    try {
      const location =
        await getLocationById(
          req.params.id
        );

      if (!location) {
        return res.status(404).json({
          success: false,
          message:
            "Location not found",
        });
      }

      return res.status(200).json({
        success: true,
        location,
      });
    } catch (error) {
      console.error(
        "Get location error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch location",
        error: error.message,
      });
    }
  };


/*
=========================================
GET BY SLUG
=========================================
*/

export const getLocationBySlugController =
  async (req, res) => {
    try {
      const location =
        await getLocationBySlug(
          req.params.slug
        );

      if (!location) {
        return res.status(404).json({
          success: false,
          message:
            "Location not found",
        });
      }

      return res.status(200).json({
        success: true,
        location,
      });
    } catch (error) {
      console.error(
        "Get location by slug error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch location",
        error: error.message,
      });
    }
  };


/*
=========================================
UPDATE LOCATION
=========================================
*/

export const updateLocationController =
  async (req, res) => {
    try {
      const data = {
        ...req.body,
      };

      /*
      =========================================
      NAME / SLUG
      =========================================
      */

      if (data.name) {
        data.name =
          data.name.trim();

        data.slug =
          slugify(data.name);
      }

      /*
      =========================================
      TYPE
      =========================================
      */

      const locationType =
        data.type;

      /*
      =========================================
      BLOCK VALIDATION
      =========================================
      */

      if (
        locationType === "block" &&
        !data.parentLocation
      ) {
        return res.status(400).json({
          success: false,
          message:
            "A block must belong to a society",
        });
      }

      /*
      =========================================
      REMOVE PARENT FROM SOCIETY / AREA
      =========================================
      */

      if (
        locationType === "society" ||
        locationType === "area"
      ) {
        data.parentLocation =
          null;
      }

      /*
      =========================================
      VERIFY PARENT SOCIETY
      =========================================
      */

      if (
        locationType === "block" &&
        data.parentLocation
      ) {
        const parent =
          await getLocationById(
            data.parentLocation
          );

        if (!parent) {
          return res.status(404).json({
            success: false,
            message:
              "Parent society not found",
          });
        }

        if (
          parent.type !== "society"
        ) {
          return res.status(400).json({
            success: false,
            message:
              "A block can only belong to a society",
          });
        }
      }

      /*
      =========================================
      DISPLAY ORDER
      =========================================
      */

      if (
        data.displayOrder !==
        undefined
      ) {
        data.displayOrder =
          Number(
            data.displayOrder
          );
      }

      /*
      =========================================
      UPDATE
      =========================================
      */

      const location =
        await updateLocation(
          req.params.id,
          data
        );

      if (!location) {
        return res.status(404).json({
          success: false,
          message:
            "Location not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Location updated successfully",
        location,
      });
    } catch (error) {
      console.error(
        "Update location error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update location",
        error: error.message,
      });
    }
  };


/*
=========================================
DELETE LOCATION
=========================================
*/

export const deleteLocationController =
  async (req, res) => {
    try {
      /*
      =========================================
      FIND LOCATION FIRST
      =========================================
      */

      const location =
        await getLocationById(
          req.params.id
        );

      if (!location) {
        return res.status(404).json({
          success: false,
          message:
            "Location not found",
        });
      }

      /*
      =========================================
      PREVENT DELETING SOCIETY WITH BLOCKS
      =========================================
      */

      if (
        location.type === "society"
      ) {
        const childLocations =
          await getLocations({
            includeInactive: true,
            parentLocation:
              location._id,
          });

        if (
          childLocations.length > 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Cannot delete this society because it contains blocks. Delete or move the blocks first.",
          });
        }
      }

      /*
      =========================================
      DELETE
      =========================================
      */

      await deleteLocation(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message:
          "Location deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete location error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete location",
        error: error.message,
      });
    }
  };