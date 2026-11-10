import { createHashRouter, Navigate } from "react-router-dom";
import App from "../App";
import Home from "../web/Home";
import Products from "../web/Products";
import ProductDetail from "../web/ProductDetail";
import Combos from "../web/Combos";
import Cart from "../web/Cart";
import Checkout from "../web/Checkout";
import OrderSuccess from "../web/OrderSuccess";
import About from "../web/About";
import News from "../web/News";
import Contact from "../web/Contact";
import Login from "../web/Login";
import Register from "../web/Register";
import AdminLayout from "../web/admin/AdminLayout";
import AdminDashboard from "../web/admin/AdminDashboard";
import AdminOrders from "../web/admin/AdminOrders";
import AdminOrderDetail from "../web/admin/AdminOrderDetail";
import AdminProducts from "../web/admin/AdminProducts";
import AdminCombos from "../web/admin/AdminCombos";
import AdminCategories from "../web/admin/AdminCategories";
import AdminCustomers from "../web/admin/AdminCustomers";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "product/:id",
        element: <ProductDetail />,
      },
      {
        path: "combos",
        element: <Combos />,
      },
      {
        path: "combos/:id",
        element: <ProductDetail />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "order-success/:orderId",
        element: <OrderSuccess />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "news",
        element: <News />,
      },
      {
        path: "news/:id",
        element: <News />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: "orders",
            element: <AdminOrders />,
          },
          {
            path: "orders/:orderId",
            element: <AdminOrderDetail />,
          },
          {
            path: "products",
            element: <AdminProducts />,
          },
          {
            path: "combos",
            element: <AdminCombos />,
          },
          {
            path: "categories",
            element: <AdminCategories />,
          },
          {
            path: "customers",
            element: <AdminCustomers />,
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/home" replace />,
      },
    ],
  },
]);

export default router;
