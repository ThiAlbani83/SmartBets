import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import Home from "./Home";
import Sidebar from "../components/Sidebar";
import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import FluxoSaqueB5 from "./sac/b5/FluxoSaqueB5";
import FluxoB5Deposito from "./sac/b5/FluxoB5Deposito";
import FluxoB5Bonus from "./sac/b5/FluxoB5Bonus";
import FluxoJetDeposito from "./sac/jetbet/FluxoJetDeposito";
import FluxoJetSaque from "./sac/jetbet/FluxoJetSaque";
import FluxoJetBonus from "./sac/jetbet/FluxoJetBonus";
import FluxoPinDeposito from "./sac/pinbet/FluxoPinDeposito";
import FluxoPinSaque from "./sac/pinbet/FluxoPinSaque";
import FluxoPinBonus from "./sac/pinbet/FluxoPinBonus";
import AddSuppliers from "./buyorder/AddSuppliers";
import SearchSuppliers from "./buyorder/SearchSuppliers";
import AddProduct from "./buyorder/AddProduct";
import SearchProduct from "./buyorder/SearchProduct";
import EditProduct from "./buyorder/EditProduct";
import NewOrder from "./buyorder/NewOrder";
import ActiveOrders from "./buyorder/ActiveOrders";
import OrderDetail from "./buyorder/OrderDetail";
import OrderHistory from "./buyorder/OrderHistory";
import EditSupplier from "./buyorder/EditSupplier";
import Navbar from "../components/Navbar";
import AdminPanel from "./authenticate/AdminPanel";
import ProtectedAdminRoute from "../components/ProtectedAdminRoute";

const HomePage = () => {
  return (
    <motion.div
      className="flex w-full h-screen"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      <Sidebar />

      {/* Main Content com rotas internas */}
      <div className="relative w-full h-screen p-3 my-auto">
        <div className="homePage flex-1 w-full h-[100%] bg-gray-300 rounded-lg overflow-y-scroll scroll-m-0 shadow-lg">
          <Navbar />
          <div className="p-10">
            <Routes>
              {/* Rota padrão (/) */}
              <Route path="/" element={<Home />} />
              <Route path="b5/depositos" element={<FluxoB5Deposito />} />
              <Route path="b5/saques" element={<FluxoSaqueB5 />} />
              <Route path="b5/bonus" element={<FluxoB5Bonus />} />
              <Route path="jet/depositos" element={<FluxoJetDeposito />} />
              <Route path="jet/saques" element={<FluxoJetSaque />} />
              <Route path="jet/bonus" element={<FluxoJetBonus />} />
              <Route path="pin/depositos" element={<FluxoPinDeposito />} />
              <Route path="pin/saques" element={<FluxoPinSaque />} />
              <Route path="pin/bonus" element={<FluxoPinBonus />} />
              <Route path="fornecedores/cadastro" element={<AddSuppliers />} />
              <Route
                path="fornecedores/pesquisa"
                element={<SearchSuppliers />}
              />
              <Route path="produto/cadastro" element={<AddProduct />} />
              <Route path="produto/pesquisa" element={<SearchProduct />} />
              <Route path="produtos/editar/:id" element={<EditProduct />} />
              <Route
                path="fornecedores/editar/:id"
                element={<EditSupplier />}
              />
              <Route path="compras/novo-pedido" element={<NewOrder />} />
              <Route path="compras/pedidos-ativos" element={<ActiveOrders />} />
              <Route
                path="compras/detalhe-pedido/:id"
                element={<OrderDetail />}
              />
              <Route path="compras/historico" element={<OrderHistory />} />
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminPanel />
                  </ProtectedAdminRoute>
                }
              />
              {/* Adicione mais rotas conforme necessário */}
            </Routes>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;
