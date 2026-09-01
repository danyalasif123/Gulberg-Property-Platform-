import Property from "../models/Property.js";
import Enquiry from "../models/Enquiry.js";

export const getDashboardStats = async () => {
  const [
    totalProperties,
    publishedProperties,
    pendingProperties,
    soldProperties,
    totalEnquiries,
    newEnquiries,
    recentProperties,
    recentEnquiries
  ] = await Promise.all([
    Property.countDocuments(),

    Property.countDocuments({
      status: "published"
    }),

    Property.countDocuments({
      status: "pending"
    }),

    Property.countDocuments({
      status: "sold"
    }),

    Enquiry.countDocuments(),

    Enquiry.countDocuments({
      status: "new"
    }),

    Property.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select(
        "propertyId title propertyType purpose price size society block status createdAt"
      ),

    Enquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate(
        "property",
        "propertyId title"
      )
  ]);

  return {
    stats: {
      totalProperties,
      publishedProperties,
      pendingProperties,
      soldProperties,
      totalEnquiries,
      newEnquiries
    },

    recentProperties,

    recentEnquiries
  };
};