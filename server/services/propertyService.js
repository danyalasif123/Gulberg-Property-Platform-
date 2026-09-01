import Property from "../models/Property.js";


/*
=========================================
CREATE PROPERTY
=========================================
*/

export const createProperty = async (
  propertyData
) => {

  return await Property.create(
    propertyData
  );

};


/*
=========================================
GET PROPERTIES
=========================================
*/

export const getProperties = async ({
  page = 1,
  limit = 12,

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

  status = "published",

  sort = "newest"

}) => {

  const query = {
    status
  };


  /*
  =======================================
  SEARCH
  =======================================
  */

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
      },

      {
        plotNumber: {
          $regex: search,
          $options: "i"
        }
      }

    ];

  }


  /*
  =======================================
  PROPERTY TYPE
  =======================================
  */

  if (propertyType) {

    query.propertyType =
      propertyType;

  }


  /*
  =======================================
  PURPOSE
  =======================================
  */

  if (purpose) {

    query.purpose =
      purpose;

  }


  /*
  =======================================
  SOCIETY
  =======================================
  
  Property.society is String.

  Example:

  "Gulberg Greens"
  =======================================
  */

  if (society) {

    query.society =
      society;

  }


  /*
  =======================================
  BLOCK
  =======================================
  
  Property.block is String.

  Example:

  "Block A"
  =======================================
  */

  if (block) {

    query.block =
      block;

  }


  /*
  =======================================
  CATEGORY
  =======================================
  
  Property.category is ObjectId.

  Therefore the frontend sends:

  category=<MongoDB Category _id>

  and we directly query it.
  =======================================
  */

  if (category) {

    query.category =
      category;

  }


  /*
  =======================================
  PRICE FILTER
  =======================================
  */

  if (
    minPrice ||
    maxPrice
  ) {

    query[
      "price.amount"
    ] = {};


    if (minPrice) {

      query[
        "price.amount"
      ].$gte =
        Number(minPrice);

    }


    if (maxPrice) {

      query[
        "price.amount"
      ].$lte =
        Number(maxPrice);

    }

  }


  /*
  =======================================
  SIZE FILTER
  =======================================
  */

  if (
    minSize ||
    maxSize
  ) {

    query[
      "size.value"
    ] = {};


    if (minSize) {

      query[
        "size.value"
      ].$gte =
        Number(minSize);

    }


    if (maxSize) {

      query[
        "size.value"
      ].$lte =
        Number(maxSize);

    }

  }


  /*
  =======================================
  SORT
  =======================================
  */

  let sortOption = {
    createdAt: -1
  };


  if (
    sort === "oldest"
  ) {

    sortOption = {
      createdAt: 1
    };

  }


  if (
    sort === "price_low" ||
    sort === "price_asc"
  ) {

    sortOption = {
      "price.amount": 1
    };

  }


  if (
    sort === "price_high" ||
    sort === "price_desc"
  ) {

    sortOption = {
      "price.amount": -1
    };

  }


  if (
    sort === "views"
  ) {

    sortOption = {
      views: -1
    };

  }


  /*
  =======================================
  PAGINATION
  =======================================
  */

  const pageNumber =
    Number(page) || 1;

  const limitNumber =
    Number(limit) || 12;


  const skip =
    (pageNumber - 1) *
    limitNumber;


  /*
  =======================================
  DATABASE QUERY
  =======================================
  */

  const [
    properties,
    total
  ] = await Promise.all([

    Property.find(query)

      .sort(
        sortOption
      )

      .skip(
        skip
      )

      .limit(
        limitNumber
      )

      .populate(
        "createdBy",
        "name email"
      )

      .populate(
        "category",
        "name slug"
      ),

    Property.countDocuments(
      query
    )

  ]);


  /*
  =======================================
  RETURN
  =======================================
  */

  return {

    properties,

    total,

    page:
      pageNumber,

    limit:
      limitNumber,

    totalPages:
      Math.ceil(
        total /
        limitNumber
      )

  };

};


/*
=========================================
GET PROPERTY BY ID
=========================================
*/

export const getPropertyById =
  async (id) => {

    return await Property.findById(
      id
    )
      .populate(
        "category",
        "name slug"
      )
      .populate(
        "createdBy",
        "name email"
      );

  };


/*
=========================================
UPDATE PROPERTY
=========================================
*/

export const updateProperty =
  async (
    id,
    updateData
  ) => {

    return await Property.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

  };


/*
=========================================
DELETE PROPERTY
=========================================
*/

export const deleteProperty =
  async (id) => {

    return await Property.findByIdAndDelete(
      id
    );

  };


/*
=========================================
GET PROPERTY BY SLUG
=========================================
*/

export const getPropertyBySlug =
  async (slug) => {

    return await Property.findOne({

      slug,

      status: "published"

    })

      .populate(
        "createdBy",
        "name"
      )

      .populate(
        "category",
        "name slug"
      );

  };