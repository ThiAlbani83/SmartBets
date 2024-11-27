export const menuSac = [
  {
    title: "Fluxos de Atendimento",
    icon: "sac", // You can choose an appropriate icon for this parent menu
    subItems: [
      {
        title: "BetFive",
        icon: "betfive",
        subItems: [
          { name: "Saque", link: "/b5/saques" },
          { name: "Depositos", link: "/b5/depositos" },
          { name: "Bônus", link: "/b5/bonus" },
        ],
      },
      {
        title: "JetBet365",
        icon: "jetbet",
        subItems: [
          { name: "Saque", link: "/jet/saques" },
          { name: "Depositos", link: "/jet/depositos" },
          { name: "Bônus", link: "/jet/bonus" },
        ],
      },
      {
        title: "PinBet",
        icon: "pinbet",
        subItems: [
          { name: "Saque", link: "/pin/saques" },
          { name: "Depositos", link: "/pin/depositos" },
          { name: "Bônus", link: "/pin/bonus" },
        ],
      },
    ],
  },
];

export const menu = [
  {
    title: "Gestão de Produtos",
    icon: "produtos", // Choose an appropriate icon for this parent menu
    subItems: [
      {
        title: "Fornecedores",
        icon: "fornecedores",
        subItems: [
          { name: "Novo", link: "/fornecedores/cadastro", icon: 'adicionar' },
          { name: "Buscar", link: "/fornecedores/pesquisa", icon: 'pesquisar' },
        ],
      },
      {
        title: "Produtos",
        icon: "items",
        subItems: [
          { name: "Novo", link: "/produto/cadastro", icon: 'adicionar' },
          { name: "Buscar", link: "/produto/pesquisa", icon: 'pesquisar' },
        ],
      },
      {
        title: "Pedidos de Compra",
        icon: "compras",
        subItems: [
          { name: "Novo", link: "/compras/novo-pedido", icon: 'adicionar' },
          { name: "Pendentes", link: "/compras/pedidos-ativos", icon: 'pendentes' },
          { name: "Histórico", link: "/compras/historico", icon: 'historico' },
        ],
      },
    ],
  },
];

export const menuMarketingBetfive = [
  {
    title: "Marketing BetFive",
    icon: "betfive", // Choose an appropriate icon for this parent menu
    subItems: [
      {
        title: "Postagens",
        icon: "postagens",
        subItems: [
          { name: "Instagram", link: "/" },
          { name: "X", link: "/" },
          { name: "Linkedin", link: "/" },
        ],
      },
    ],
  },
];

export const menuMarketingPinbet = [
  {
    title: "Marketing Pinbet",
    icon: "pinbet", // Choose an appropriate icon for this parent menu
    subItems: [
      {
        title: "Postagens",
        icon: "postagens",
        subItems: [
          { name: "Instagram", link: "/" },
          { name: "X", link: "/" },
          { name: "Linkedin", link: "/" },
        ],
      },
    ],
  },
];

export const menuSigap = [
  {
    title: "SIGAP",
    icon: "sigap", // Choose an appropriate icon for this parent menu
    subItems: [
      {
        title: "Menu 1",
        icon: "postagens",
        subItems: [
          { name: "Submenu 1", link: "/" },
          { name: "Submenu 2", link: "/" },
          { name: "Submenu 3", link: "/" },
        ],
      },
      {
        title: "Menu 2",
        icon: "postagens",
        subItems: [
          { name: "Submenu 1", link: "/" },
          { name: "Submenu 2", link: "/" },
          { name: "Submenu 3", link: "/" },
        ],
      }
    ],
  },
];

export const fullMenu = [
  ...menu, // Itens do menu original
  { divider: true },
  ...menuSac, // Itens do menu SAC
  { divider: true },
  ...menuMarketingBetfive,
  { divider: true },
  ...menuMarketingPinbet,
  { divider: true },
  ...menuSigap,
];
