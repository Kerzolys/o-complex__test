export const getReviewsApi = async () => {
  try {
    const response = await fetch("http://o-complex.com:1337/reviews", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data)
    return data;
  } catch (err) {
    console.log(err);
  }
};
