import { TOrder } from "../types/types";

export const orderApi = async (body: TOrder) => {
  try {
    const response = await fetch("http://o-complex.com:1337/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    if (!response.ok) {
      return {
        success: 0,
        error: result.error || `Ошибка сервера: ${response.status}`,
      };
    }
    return result;
  } catch (err) {
    return { success: 0, error: "Ошибка сети или сервера" };
  }
};
