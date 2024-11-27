import { useEffect } from "react";
import CryptoJS from "crypto-js";

const IntercomWidget = ({ userID }) => {
  useEffect(() => {
    const secretKey = "vBRHmeTjG3afZVuljyifA6p8bAOGVIvhxuiihKao"; // Your Intercom app secret key
    const timestamp = Math.floor(Date.now() / 1000); // Current timestamp (in seconds)

    // Generate the user hash
    const hmac = CryptoJS.HmacSHA256(userID, secretKey).toString(
      CryptoJS.enc.Base64
    ); // Use Base64 encoding

    // Create the Intercom script
    const intercomScript = document.createElement("script");
    intercomScript.type = "text/javascript";
    intercomScript.async = true;
    intercomScript.src = `https://widget.intercom.io/widget/km32apcw`; // Replace with your actual Intercom app ID

    console.log("generated Hmac: ", hmac);
    console.log("userID: ", userID);

    intercomScript.onload = () => {
      window.Intercom("boot", {
        app_id: "km32apcw", // Your Intercom app ID
        user_id: userID, // The email of the user
        user_hash: hmac, // The generated user hash
        timestamp: timestamp, // The timestamp you generated
      });
    };

    document.body.appendChild(intercomScript);

    // Cleanup Intercom when component unmounts
    return () => {
      if (window.Intercom) {
        window.Intercom("shutdown");
      }
    };
  }, [userID]);

  return null;
};

export default IntercomWidget;
