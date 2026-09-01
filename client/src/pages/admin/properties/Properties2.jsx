import { useEffect, useState } from "react";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminNavbar from "../../../components/admin/AdminNavbar";

import PropertyHeader from "../../../components/admin/Properties/PropertyHeader2";
import PropertyToolbar from "../../../components/admin/Properties/PropertyToolbar2";
import PropertyTable from "../../../components/admin/Properties/PropertyTable2";
import PropertyPagination from "../../../components/admin/Properties/PropertyPagination2";

import api from "../../../services/api";

import "./Properties2.css";
import "../../../components/admin/properties/propertiesComponents2.css"
const Properties = () => {
  const [properties, setProperties] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    limit: 20,
  });

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/properties", {
        params: {
          search: search || undefined,
          status: status || undefined,
          page,
          limit: 20,
        },
      });

      setProperties(response.data.properties);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load properties"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page, status]);

  const handleSearch = (e) => {
    e.preventDefault();

    setPage(1);
    fetchProperties();
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPage(1);
  };

  const handleStatusChange = async (
    propertyId,
    newStatus
  ) => {
    try {
      await api.patch(
        `/admin/properties/${propertyId}/status`,
        {
          status: newStatus,
        }
      );

      fetchProperties();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update status"
      );
    }
  };

const handleDelete = async (propertyId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this property?"
  );

  if (!confirmed) return;

  try {
    setLoading(true);

    await api.delete(
      `/properties/${propertyId}`
    );

    await fetchProperties();

  } catch (error) {
    console.error(
      "Delete property error:",
      error
    );

    alert(
      error.response?.data?.message ||
        "Failed to delete property"
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-main">

        <AdminNavbar />

        <main className="properties-content">

          <PropertyHeader />

          <PropertyToolbar
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            onSearch={handleSearch}
            onClear={clearFilters}
          />

          {error && (
            <div className="properties-error">
              {error}
            </div>
          )}

          <PropertyTable
            properties={properties}
            loading={loading}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />

          <PropertyPagination
            page={page}
            pagination={pagination}
            setPage={setPage}
          />

        </main>

      </div>

    </div>
  );
};

export default Properties;