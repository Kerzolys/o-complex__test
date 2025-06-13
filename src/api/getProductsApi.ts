export const getProductsApi = async (page = 1) => {
  try {
    const response = await fetch(`http://o-complex.com:1337/products?page=${page}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
