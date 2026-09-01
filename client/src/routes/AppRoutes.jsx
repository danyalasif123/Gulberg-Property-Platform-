import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AdminLogin from "../pages/auth/AdminLogin";

import Dashboard from "../pages/admin/Dashboard";

import Properties from "../pages/admin/properties/Properties";
import AddProperty from "../pages/admin/properties/AddProperty";
import EditProperty from "../pages/admin/properties/EditProperty";
import ViewProperty from "../pages/admin/properties/ViewProperty";

import PropertyDetails from "../pages/admin/properties/PropertyDetails";

import Enquiries from "../pages/admin/enquiries/enquiries";
import Categories from "../pages/admin/categories/categories";
import Locations from "../pages/admin/Locations/Locations";
import EnquiryView from "../pages/admin/Enquiries/EnquiryView";
import Home from "../pages/public/Home";
import Propertiespage from "../pages/public/Properties";
import PropertyDetailsPage from "../pages/public/PropertyDetails";
import LocationsPage from "../pages/public/Locations";
import Contact from "../pages/public/Contact";
import About from "../pages/public/About";




import ProtectedRoute from "./ProtectedRoute";


const AppRoutes = () => {
  return (
    <Routes>


      {/* =========================================
          PUBLIC
      ========================================= */}

      <Route
        path="/"
        element={<Home />}
      />


      <Route
        path="/properties"
        element={<Propertiespage />}
      />


      <Route
        path="/properties/:id"
        element={<PropertyDetailsPage />}
      />


      <Route
        path="/locations"
        element={<LocationsPage />}
      />


      <Route
        path="/about"
        element={<About />}
      />


      <Route
        path="/contact"
        element={<Contact />}
      />


      {/* =========================================
          ADMIN LOGIN
      ========================================= */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />


      {/* =========================================
          PROTECTED ADMIN
      ========================================= */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />


      {/* =========================================
          ADMIN PROPERTIES
      ========================================= */}

      <Route
        path="/admin/properties"
        element={
          <ProtectedRoute>
            <Properties />
          </ProtectedRoute>
        }
      />


      <Route
        path="/admin/properties/:id"
        element={<ViewProperty />}
      />


      <Route
        path="/admin/properties/add"
        element={
          <ProtectedRoute>
            <AddProperty />
          </ProtectedRoute>
        }
      />


      <Route
        path="/admin/properties/:id/edit"
        element={
          <ProtectedRoute>
            <EditProperty />
          </ProtectedRoute>
        }
      />


      <Route
        path="/admin/properties/:id"
        element={
          <ProtectedRoute>
            <PropertyDetails />
          </ProtectedRoute>
        }
      />


      {/* =========================================
          ADMIN ENQUIRIES
      ========================================= */}

      <Route
        path="/admin/enquiries"
        element={
          <ProtectedRoute>
            <Enquiries />
          </ProtectedRoute>
        }
      />

<Route
  path="/admin/enquiries/:id"
  element={<EnquiryView />}
/>
      {/* =========================================
          ADMIN CATEGORIES
      ========================================= */}

      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        }
      />


      {/* =========================================
          ADMIN LOCATIONS
      ========================================= */}

      <Route
        path="/admin/locations"
        element={
          <ProtectedRoute>
            <Locations />
          </ProtectedRoute>
        }
      />


      {/* =========================================
          FALLBACK
      ========================================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
};

export default AppRoutes;