
import Property from "../models/Property.js";
import { getDashboardStats } from "../services/dashboardService.js";
export const getAdminProperties = async (req, res) => {
  try {
    const {
      status,
      search,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i"
          }
        },
        {
          propertyId: {
            $regex: search,
            $options: "i"
          }
        },
        {
          society: {
            $regex: search,
            $options: "i"
          }
        },
        {
          block: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [properties, total] = await Promise.all([
      Property.find(query)
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      Property.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      properties,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Admin properties error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch admin properties"
    });
  }
};
export const getAdminProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      admin: req.admin
    });
  } catch (error) {
    console.error("Get admin profile error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
export const getAdminProperty = async (req, res) => {
  try {
    const property = await Property.findById(
      req.params.id
    ).populate(
      "createdBy",
      "name email"
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    res.status(200).json({
      success: true,
      property
    });
  } catch (error) {
    console.error("Get admin property error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch property"
    });
  }
};
export const getDashboardController = async (req, res) => {
  try {
    const dashboard = await getDashboardStats();

    res.status(200).json({
      success: true,
      ...dashboard
    });
  } catch (error) {
    console.error(
      "Dashboard error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard"
    });
  }
};