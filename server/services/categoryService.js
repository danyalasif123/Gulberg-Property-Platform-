import Category from "../models/Category.js";

export const createCategory = async (
  categoryData
) => {
  return await Category.create(
    categoryData
  );
};

export const getCategories = async ({
  includeInactive = false,
} = {}) => {
  const filter = {};

  if (!includeInactive) {
    filter.isActive = true;
  }

  return await Category.find(filter)
    .sort({
      displayOrder: 1,
      name: 1,
    })
    .lean();
};

export const getCategoryById = async (
  id
) => {
  return await Category.findById(id);
};

export const getCategoryBySlug = async (
  slug
) => {
  return await Category.findOne({
    slug: slug.toLowerCase(),
  });
};

export const updateCategory = async (
  id,
  categoryData
) => {
  return await Category.findByIdAndUpdate(
    id,
    categoryData,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteCategory = async (
  id
) => {
  return await Category.findByIdAndDelete(
    id
  );
};