import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import Home from "./Home";
import Sidebar from "../components/Sidebar";
import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
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
import AdminPanel from "./authenticate/AdminPanel";
import ProtectedAdminRoute from "../components/ProtectedAdminRoute";
import NavbarV2 from "../components/NavbarV2";
import HomeSigap from "./sigap/HomeSigap";
import HomeSac from "./sac/HomeSac";
import ProtectedRoute from "../components/ProtectedRoute";
import SigapUploadFile from "./sigap/SigapSubmitPage";
import SigapTransmitPage from "./sigap/SigapTransmitPage";
import SigapReports from "./sigap/SigapReportPage";
import SigapFileDetails from "./sigap/SigapFileDetails";
import SigapAuthPage from "./sigap/SigapAuthPage";
import HomeKyc from "./kyc/HomeKyc";
import HomeAdministrativo from "./administrativo/HomeAdministrativo";
import HomeResponsibleGaming from "./responsible/HomeResponsibleGaming";
import VerificationsKyc from "./kyc/VerificationsKyc";
import LivenessKyc from "./kyc/LivenessKyc";
import Antifraud from "./kyc/Antifraud";
import InsightsKyc from "./kyc/InsightsKyc";
import FAQ from "./sac/FAQ";
import SmartFlow from "./sac/SmartFlow";
import Tickets from "./sac/Tickets";
import Reports from "./sac/Reports";
import SearchDeepScan from "./deepscan/SearchDeepScan";
import HomeDeepScan from "./deepscan/HomeDeepScan";

const HomePage = () => {
  const { user } = useAuthStore();

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
      <div className="relative w-full h-screen my-auto bg-[#FAFBFC]">
        <div className="homePage flex-1 w-full h-[100%] rounded-lg overflow-y-scroll scroll-m-0">
          <NavbarV2 />
          <div className="p-10 w-full max-w-[98%] mx-auto h-[85%] rounded-b-xl mt-2 rounded-xl shadow-lg">
            <Routes>
              {/* ROTA PARA HOME PAGE BASEADA NA FUNÇÃO DO USUÁRIO */}
              <Route path="/" element={<Home />} />
              {/* FIM DA ROTA PARA HOME PAGE BASEADA NA FUNÇÃO DO USUÁRIO */}
              {/* ROTAS PARA SESSÃO DE SAC */}
              <Route path="sac/dashboard" element={<HomeSac />} />
              <Route path="sac/perguntas-frequentes" element={<FAQ />} />
              <Route path="sac/smart-flow" element={<SmartFlow />} />
              <Route path="sac/tickets" element={<Tickets />} />
              <Route path="sac/relatorios" element={<Reports />} />
              {/* Rota de Teste */}
              <Route path="pin/bonus" element={<FluxoPinBonus />} />
              {/* FIM DAS ROTAS PARA SESSÃO DE SAC */}
              {/* ROTAS PARA SESSÃO DE AQUISIÇÃO DE PRODUTOS */}
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
              {/* FIM DAS ROTAS PARA SESSÃO DE AQUISIÇÃO DE PRODUTOS */}
              {/* ROTAS PARA PAGINAS DO SIGAP */}
              <Route path="/sigap/dashboard" element={<HomeSigap />} />
              <Route
                path="/sigap/submeter-arquivos"
                element={<SigapUploadFile />}
              />
              <Route
                path="/sigap/auditar-arquivos"
                element={<SigapAuthPage />}
              />
              <Route
                path="/sigap/transmitir-arquivos"
                element={<SigapTransmitPage />}
              />
              <Route path="/sigap/relatorios" element={<SigapReports />} />
              <Route
                path="/sigap/detalhes_arquivo"
                element={<SigapFileDetails />}
              />
              {/* FIM DAS ROTAS PARA PAGINAS DO SIGAP */}
              {/* ROTA PARA PÁGINAS DO KYC */}
              <Route path="/kyc/dashboard" element={<HomeKyc />} />
              <Route path="/kyc/verificacoes" element={<VerificationsKyc />} />
              <Route path="/kyc/liveness" element={<LivenessKyc />} />
              <Route path="/kyc/antifraude" element={<Antifraud />} />
              <Route path="/kyc/insights" element={<InsightsKyc />} />
              {/* FIM DAS ROTAS PARA PÁGINAS DO KYC */}
              {/* ROTA PARA PÁGINAS DO ADMINISTRATIVO */}
              <Route
                path="/administrativo/dashboard"
                element={<HomeAdministrativo />}
              />
              {/* FIM DAS ROTAS PARA PÁGINAS DO ADMINISTRATIVO */}
              {/* ROTA PARA PÁGINAS DO JOGO RESPONSÁVEL */}
              <Route
                path="/jogo-responsavel/dashboard"
                element={<HomeResponsibleGaming />}
              />
              {/* FIM DAS ROTAS PARA PÁGINAS DO RESPONSÁVELSTRATIVO */}
              {/* ROTA PARA PAINEL DE ADMIN */}
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminPanel />
                  </ProtectedAdminRoute>
                }
              />
              {/* FIM DA ROTA PARA PAINEL DE ADMIN */}
              {/* ROTA PARA PAINEL DO DEEPSCAN */}
              <Route path="/deepscan/dashboard" element={<HomeDeepScan />} />
              <Route path="/deepscan/verificacoes" element={<SearchDeepScan />} />
              {/* FIM DA ROTA PARA PAINEL DE ADMIN */}
            </Routes>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;
