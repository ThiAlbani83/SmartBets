import React, { useEffect, useState } from "react";

const Home = () => {
  const [data, setData] = useState([]);

  return (
    <div className="flex flex-col gap-3 font-semibold text-gray-600 font-inter">
      <h1>
        NESTA TELA TERÃO INFORMAÇÕES PERTINENTES A CADA TIPO DE ROLE DO USUÁRIO:
      </h1>
      <h1> USUÁRIOS DO SAC VERÃO INFORMAÇÕES RELEVANTES A FUNÇÃO DE SAC</h1>
      <h1>
        {" "}
        USUÁRIOS DO MARKETING VERÃO INFORMAÇÕES RELEVANTES A FUNÇÃO DE MARKETING
      </h1>
      <h1>ETC...</h1>

      <h1>
        MEMBROS DO BOARD VISUALIZARÃO GRÁFICOS E INFORMAÇÕES VINDAS DAS CASAS DE
        APOSTA COM DADOS DE DESEMPENHO
      </h1>
    </div>
  );
};

export default Home;
