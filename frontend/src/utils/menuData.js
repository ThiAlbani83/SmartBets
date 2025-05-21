import home from "../assets/home.png";
import submeter from "../assets/submeter.png";
import department from "../assets/department.png";
import products from "../assets/product.png";
import admin from "../assets/admin.png";
import tasks from "../assets/tasks.png";
import contacts from "../assets/contacts.png";
import dashboard from "../assets/dashboard.png";
import verification from "../assets/verification.png";
import liveness from "../assets/liveness.png";
import antifraud from "../assets/antifraud.png";
import insights from "../assets/insights.png";
import supplier from "../assets/supplier.png";
import newProduct from "../assets/new.png";
import pending from "../assets/pending.png";
import history from "../assets/history.png";
import faq from "../assets/faq.png";
import flow from "../assets/flow.png";

export const menuItemsAdmin = [
  { name: "Home", icon: home, path: "/" },
  { name: "KPI's", icon: submeter, path: "/kpi" },
  { name: "Departamentos", icon: department, path: "/departments" },
  { name: "Produtos", icon: products, path: "/produto/pesquisa" },
  { name: "Contatos", icon: contacts, path: "/contacts" },
  { name: "Tarefas", icon: tasks, path: "/tasks" },
  { name: "Sair", icon: admin },
];

export const menuItemsAdministrativo = [
  { name: "Dashboard", icon: home, path: "/administrativo/dashboard" },
  { name: "Produtos", icon: products, path: "/produto/pesquisa" },
  { name: "Fornecedores", icon: supplier, path: "/fornecedores/pesquisa" },
  { name: "Novo Pedido", icon: newProduct, path: "/compras/novo-pedido" },
  { name: "Pendentes", icon: pending, path: "/compras/pedidos-ativos" },
  { name: "Histórico", icon: history, path: "/compras/historico" },
];

export const menuItemsSigap = [
  { name: "Dashboard", icon: dashboard, path: "/sigap/dashboard" },
  { name: "Antifraude", icon: antifraud, path: "/sigap/antifraude" },
  { name: "Submeter", icon: submeter, path: "/sigap/submeter-arquivos" },
  { name: "Auditar", icon: tasks, path: "/sigap/auditar-arquivos" },
  { name: "Relatórios", icon: department, path: "/sigap/relatorios" },
];

export const menuItemsSac = [
  { name: "Dashboard", icon: home, path: "/sac/dashboard" },
  { name: "F.A.Q", icon: faq, path: "/sac/perguntas-frequentes" },
  { name: "Smart Flow", icon: flow, path: "/sac/smart-flow" },
  { name: "Tickets", icon: tasks, path: "/sac/tickets" },
  { name: "Relatórios", icon: admin, path: "/sac/relatorios" },
];

export const menuItemsKYC = [
  { name: "Dashboard", icon: home, path: "/kyc/dashboard" },
  { name: "Verificações", icon: verification, path: "/kyc/verificacoes" },
  { name: "Liveness", icon: liveness, path: "/kyc/liveness" },
  { name: "Antifraude", icon: antifraud, path: "/kyc/antifraude" },
  { name: "Insights", icon: insights, path: "/kyc/insights" },
];

export const menuItemsResponsible = [
  { name: "Dashboard", icon: home, path: "/jogo-responsavel/dashboard" },
  { name: "Menu 1", icon: verification, path: "/sigap/submeter-arquivos" },
  { name: "Menu 2", icon: liveness, path: "/sigap/auditar-arquivos" },
  { name: "Menu 3", icon: antifraud, path: "/sigap/relatorios" },
  { name: "Menu 4", icon: insights },
];

export const menuItemsDeepScan = [
  { name: "Dashboard", path: "/deepscan/dashboard" },
  { name: "Raspagens", path: "/deepscan/verificacoes" },
  { name: "Agendamento", path: "/deepscan/agendamentos" },
  { name: "BetCrawler", path: "/deepscan/betcrawler" },
  { name: "Clientes", path: "/deepscan/clientes" },
];
