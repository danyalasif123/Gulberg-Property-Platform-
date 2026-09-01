import Location from "../models/Location.js";

/*
=========================================
CREATE
=========================================
*/

export const createLocation = async (
  locationData
) => {
  return await Location.create(
    locationData
  );
};


/*
=========================================
GET LOCATIONS
=========================================
*/

export const getLocations = async ({
  includeInactive = false,
  type,
  parentLocation,
} = {}) => {
  const filter = {};

  if (!includeInactive) {
    filter.isActive = true;
  }

  if (type) {
    filter.type = type;
  }

  /*
   * Only apply parent filtering when
   * parentLocation is provided.
   */

  if (parentLocation) {
    filter.parentLocation =
      parentLocation;
  }

  return await Location.find(filter)
    .sort({
      displayOrder: 1,
      name: 1,
    })
    .lean();
};


/*
=========================================
GET BY ID
=========================================
*/

export const getLocationById = async (
  id
) => {
  return await Location.findById(id);
};


/*
=========================================
GET BY SLUG
=========================================
*/

export const getLocationBySlug = async (
  slug
) => {
  return await Location.findOne({
    slug: slug.toLowerCase(),
  });
};


/*
=========================================
UPDATE
=========================================
*/

export const updateLocation = async (
  id,
  locationData
) => {
  return await Location.findByIdAndUpdate(
    id,
    locationData,
    {
      new: true,
      runValidators: true,
    }
  );
};


/*
=========================================
DELETE
=========================================
*/

export const deleteLocation = async (
  id
) => {
  return await Location.findByIdAndDelete(
    id
  );
};