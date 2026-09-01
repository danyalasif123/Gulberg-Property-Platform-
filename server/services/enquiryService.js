import Enquiry from "../models/Enquiry.js";

export const createEnquiry = async (
  data
) => {
  return await Enquiry.create(data);
};

export const getEnquiries = async ({
  page = 1,
  limit = 20,
  status,
  search
}) => {
  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i"
        }
      },
      {
        phone: {
          $regex: search,
          $options: "i"
        }
      },
      {
        email: {
          $regex: search,
          $options: "i"
        }
      }
    ];
  }

  const skip =
    (Number(page) - 1) *
    Number(limit);

  const [enquiries, total] =
    await Promise.all([
      Enquiry.find(filter)
        .populate(
          "property",
          "title propertyId price society block"
        )
        .sort({
          createdAt: -1
        })
        .skip(skip)
        .limit(Number(limit)),

      Enquiry.countDocuments(filter)
    ]);

  return {
    enquiries,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(
        total / Number(limit)
      )
    }
  };
};

export const getEnquiryById = async (
  id
) => {
  return await Enquiry.findById(id)
    .populate(
      "property",
      "title propertyId price society block plotNumber"
    );
};

export const updateEnquiry = async (
  id,
  data
) => {
  return await Enquiry.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true
    }
  ).populate(
    "property",
    "title propertyId price society block plotNumber"
  );
};

export const deleteEnquiry = async (
  id
) => {
  return await Enquiry.findByIdAndDelete(
    id
  );
};