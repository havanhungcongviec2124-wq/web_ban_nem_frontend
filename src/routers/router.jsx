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
import AdminLayout from "../web/admin/AdminLayout";
import AdminDashboard from "../web/admin/AdminDashboard";
import AdminOrders from "../web/admin/AdminOrders";
import AdminProducts from "../web/admin/AdminProducts";

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
            path: "products",
            element: <AdminProducts />,
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
