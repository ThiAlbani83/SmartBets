import { useAuthStore } from "../store/useAuthStore";
import Intercom from "@intercom/messenger-js-sdk";
import CryptoJS from "crypto-js";
import IntercomWidget from "../components/IntercomWidget";


const Home = () => {
  const { user } = useAuthStore();
  const user_id = user.id.toString();

  /* const generateHMAC = (message, secretKey) => {
    // Generate the HMAC using SHA-256 and the secret key
    const hmac = CryptoJS.HmacSHA256(message, secretKey).toString(
      CryptoJS.enc.Hex
    );
    return hmac;
  };
  // Initialize Intercom without user-specific data
  const secretKey = "vBRHmeTjG3afZVuljyifA6p8bAOGVIvhxuiihKao";
  const userEmail = user.email;
  const timestamp = Math.floor(Date.now() / 1000);

  const message = userEmail + timestamp;

  // Gerar o HMAC
  const hash = CryptoJS.HmacSHA256(userEmail, secretKey).toString(
    CryptoJS.enc.Hex
  );

  console.log("User Email:", userEmail);
  console.log("Secret Key:", secretKey);
  console.log("Generated Hash:", hash);
  console.log(message);

  const hmac = generateHMAC(message, secretKey);

  console.log(hmac);

  Intercom({
    app_id: "km32apcw",
    user_email: user.email,
    hmac: hmac,
    user_hash: hmac,
  }); */

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
      {/* <IntercomWidget userID={user_id}/> */}
    </div>
  );
};

export default Home;
