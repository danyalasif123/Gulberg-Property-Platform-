import {
  createCategory,
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} from "../services/categoryService.js";

import slugify from "../utils/slugify.js";


/*
=========================================
CREATE CATEGORY
=========================================
*/

export const createCategoryController =
  async (req, res) => {
    try {
      const {
        name,
        description,
        image,
        isActive,
        displayOrder,
      } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message:
            "Category name is required",
        });
      }

      const slug = slugify(name);

      const existingCategory =
        await getCategoryBySlug(slug);

      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message:
            "Category already exists",
        });
      }

      const category =
        await createCategory({
          name,
          slug,
          description:
            description || "",
          image: image || "",
          isActive:
            isActive !== undefined
              ? isActive
              : true,
          displayOrder:
            displayOrder || 0,
          createdBy:
            req.admin._id,
        });

      return res.status(201).json({
        success: true,
        message:
          "Category created successfully",
        category,
      });
    } catch (error) {
      console.error(
        "Create category error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to create category",
        error: error.message,
      });
    }
  };


/*
=========================================
GET CATEGORIES
=========================================
*/

export const getCategoriesController =
  async (req, res) => {
    try {
      const {
        includeInactive,
      } = req.query;

      const categories =
        await getCategories({
          includeInactive:
            includeInactive === "true",
        });

      return res.status(200).json({
        success: true,
        categories,
      });
    } catch (error) {
      console.error(
        "Get categories error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch categories",
      });
    }
  };


/*
=========================================
GET SINGLE CATEGORY
=========================================
*/

export const getCategoryController =
  async (req, res) => {
    try {
      const category =
        await getCategoryById(
          req.params.id
        );

      if (!category) {
        return res.status(404).json({
          success: false,
          message:
            "Category not found",
        });
      }

      return res.status(200).json({
        success: true,
        category,
      });
    } catch (error) {
      console.error(
        "Get category error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch category",
      });
    }
  };


/*
=========================================
GET CATEGORY BY SLUG
=========================================
*/

export const getCategoryBySlugController =
  async (req, res) => {
    try {
      const category =
        await getCategoryBySlug(
          req.params.slug
        );

      if (!category) {
        return res.status(404).json({
          success: false,
          message:
            "Category not found",
        });
      }

      return res.status(200).json({
        success: true,
        category,
      });
    } catch (error) {
      console.error(
        "Get category by slug error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch category",
      });
    }
  };


/*
=========================================
UPDATE CATEGORY
=========================================
*/

export const updateCategoryController =
  async (req, res) => {
    try {
      const data = {
        ...req.body,
      };

      if (data.name) {
        data.slug = slugify(
          data.name
        );
      }

      const category =
        await updateCategory(
          req.params.id,
          data
        );

      if (!category) {
        return res.status(404).json({
          success: false,
          message:
            "Category not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Category updated successfully",
        category,
      });
    } catch (error) {
      console.error(
        "Update category error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update category",
      });
    }
  };


/*
=========================================
DELETE CATEGORY
=========================================
*/

export const deleteCategoryController =
  async (req, res) => {
    try {
      const category =
        await deleteCategory(
          req.params.id
        );

      if (!category) {
        return res.status(404).json({
          success: false,
          message:
            "Category not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Category deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete category error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete category",
      });
    }
  };