const generateAds = async () => {
  setLoading(true);
  setAds("");

  try {
    const res = await fetch("/api/generate-ads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product,
        audience,
        language,
      }),
    });

    const data = await res.json();

    if (data.error) {
      setAds("⚠️ Error: " + data.error);
    } else {
      setAds(data.ads);
    }

  } catch (err) {
    console.log("Frontend Error:", err);
    setAds("❌ Something went wrong");
  }

  setLoading(false);
};
