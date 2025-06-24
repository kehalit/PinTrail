const imageCache = {};

const fetchUnsplashImage = async (query) => {
  if (imageCache[query]) {
    return imageCache[query]; // Return cached image
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`
    );
    const data = await res.json();
    const imageUrl = data.results[0]?.urls?.regular || "https://source.unsplash.com/featured/?travel";
    imageCache[query] = imageUrl; // Store in cache
    return imageUrl;
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
    return "https://source.unsplash.com/featured/?travel";
  }
};
