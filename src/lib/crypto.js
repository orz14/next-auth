import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

export const encryptData = (data) => {
  try {
    const dataString = JSON.stringify(data);

    const encryptedData = CryptoJS.AES.encrypt(dataString, SECRET_KEY).toString();

    return encryptedData;
  } catch (err) {
    console.error("🚀 Error encrypting data", err);
    return null;
  }
};

export const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);

    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    return decryptedData;
  } catch (err) {
    console.error("🚀 Error decrypting data", err);
    return null;
  }
};
