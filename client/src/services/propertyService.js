import api from "./api";

export const getProperties = async (params = {}) => {
  const response = await api.get("/properties", {
    params
  });

  return response.data;
};

export const getPropertyBySlug = async (slug) => {
  const response = await api.get(
    `/properties/slug/${slug}`
  );

  return response.data;
};

export const submitEnquiry = async (data) => {
  const response = await api.post(
    "/enquiries",
    data
  );

  return response.data;
};