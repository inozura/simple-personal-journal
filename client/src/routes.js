import React from "react";
import {
  BrowserRouter as Router,
  Routes as RoutesDom,
  Route,
  Navigate,
} from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Create from "./pages/Create";
import Edit from "./pages/Edit";
import NotFound from "./pages/NotFound";
import Detail from "./pages/Detail";

const Routes = () => {
  return (
    <Router>
      <RoutesDom>
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/journals/:id/edit" element={<Edit />} />
        <Route path="/journals/:id" element={<Detail />} />
        <Route path="/new" element={<Create />} />
        <Route path="/" element={<Home />} />

        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </RoutesDom>
    </Router>
  );
};

export default Routes;
