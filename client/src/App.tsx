import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import ComingSoon from "./pages/ComingSoon";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="practitioners" element={<ComingSoon title="Practitioners" />} />
        <Route path="health-assessment" element={<ComingSoon title="Health Assessment" />} />
        <Route path="wholesale" element={<ComingSoon title="Wholesale" />} />
        <Route path="join-network" element={<ComingSoon title="Join Network" />} />
        <Route path="cart" element={<ComingSoon title="Shopping Cart" />} />
        <Route path="account/profile" element={<ComingSoon title="Profile" />} />
        <Route path="account/orders" element={<ComingSoon title="Orders" />} />
        <Route path="account/settings" element={<ComingSoon title="Settings" />} />
      </Route>
    </Routes>
  );
}

export default App;
