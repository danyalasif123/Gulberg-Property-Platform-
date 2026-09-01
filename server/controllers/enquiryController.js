import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry
} from "../services/enquiryService.js";

/*
 * PUBLIC
 * Create enquiry
 */
export const createEnquiryController =
  async (req, res) => {
    try {
      const {
        property,
        name,
        phone,
        email,
        message
      } = req.body;

      if (
        !property ||
        !name ||
        !phone
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Property, name and phone are required"
        });
      }

      const enquiry =
        await createEnquiry({
          property,
          name,
          phone,
          email,
          message
        });

      res.status(201).json({
        success: true,
        message:
          "Enquiry submitted successfully",
        enquiry
      });
    } catch (error) {
      console.error(
        "Create enquiry error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to submit enquiry"
      });
    }
  };

/*
 * ADMIN
 * Get enquiries
 */
export const getEnquiriesController =
  async (req, res) => {
    try {
      const {
        page,
        limit,
        status,
        search
      } = req.query;

      const result =
        await getEnquiries({
          page,
          limit,
          status,
          search
        });

      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error(
        "Get enquiries error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch enquiries"
      });
    }
  };

/*
 * ADMIN
 * Get single enquiry
 */
export const getEnquiryController =
  async (req, res) => {
    try {
      const enquiry =
        await getEnquiryById(
          req.params.id
        );

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message:
            "Enquiry not found"
        });
      }

      res.status(200).json({
        success: true,
        enquiry
      });
    } catch (error) {
      console.error(
        "Get enquiry error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch enquiry"
      });
    }
  };

/*
 * ADMIN
 * Update enquiry
 */
export const updateEnquiryController =
  async (req, res) => {
    try {
      const {
        status,
        notes
      } = req.body;

      const allowedStatuses = [
        "new",
        "contacted",
        "closed"
      ];

      if (
        status &&
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid enquiry status"
        });
      }

      const enquiry =
        await updateEnquiry(
          req.params.id,
          {
            ...(status && {
              status
            }),
            ...(notes !== undefined && {
              notes
            })
          }
        );

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message:
            "Enquiry not found"
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Enquiry updated successfully",
        enquiry
      });
    } catch (error) {
      console.error(
        "Update enquiry error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update enquiry"
      });
    }
  };

/*
 * ADMIN
 * Delete enquiry
 */
export const deleteEnquiryController =
  async (req, res) => {
    try {
      const enquiry =
        await deleteEnquiry(
          req.params.id
        );

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message:
            "Enquiry not found"
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Enquiry deleted successfully"
      });
    } catch (error) {
      console.error(
        "Delete enquiry error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete enquiry"
      });
    }
  };