import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI("AIzaSyBpk0YiXE0rWyEpb5PzIXykru8-5dm48AM");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const isAgricultureRelated = (prompt) => {
  const agricultureKeywords = [
    // General Agriculture Terms
    "agriculture",
    "farming",
    "crops",
    "soil",
    "fertilizer",
    "pesticides",
    "irrigation",
    "harvest",
    "organic",
    "livestock",
    "horticulture",
    "dairy",
    "weather impact on farming",
    "plant diseases",
    "agriculture technology",
    "farming techniques",
    "greenhouse",
    "aquaponics",
    "agronomy",
    "seeds",
    "cultivation",
    "farmers",
    "agricultural",
    "agricultural market",
    "agriculture market",

    // Sustainable & Organic Farming
    "sustainable farming",
    "regenerative agriculture",
    "hydroponics",
    "vertical farming",
    "precision farming",
    "crop rotation",
    "composting",
    "soil erosion",
    "agroforestry",
    "biofertilizers",
    "climate-smart agriculture",
    "permaculture",
    "cover crops",
    "organic certification",
    "natural fertilizers",
    "zero-budget natural farming",
    "carbon farming",
    "carbon sequestration in soil",
    "soil conservation",
    "integrated farming system",
    "polyculture",
    "silvopasture",
    "no-till farming",
    "strip farming",
    "organic pest control",
    "companion planting",

    // Climate & Environmental Factors
    "climate change and agriculture",
    "water conservation in farming",
    "drought-resistant crops",
    "weather forecasting in agriculture",
    "sustainable land management",
    "reforestation",
    "desertification prevention",
    "biodiversity in farming",
    "land degradation",
    "ecological farming",
    "renewable energy in farming",
    "solar-powered irrigation",
    "biochar",
    "soil health management",

    // Agribusiness & Farm Management
    "farm management",
    "farm subsidies",
    "rural economy",
    "agriculture policy",
    "farm economics",
    "food security",
    "food sovereignty",
    "agricultural cooperatives",
    "farm productivity",
    "small-scale farming",
    "large-scale farming",
    "farm-to-table",
    "supply chain in agriculture",
    "crop insurance",
    "post-harvest technology",
    "farm labor management",
    "export and import of agricultural goods",
    "agribusiness startups",
    "agriculture finance",
    "land tenure",
    "agripreneurship",
    "commodity markets",
    "fair trade farming",

    // Biotechnology & Genetic Engineering
    "genetically modified crops (GMO)",
    "plant breeding",
    "biotechnology in agriculture",
    "gene editing in farming",
    "disease-resistant crops",
    "seed banks",
    "high-yield crop varieties",
    "tissue culture in agriculture",
    "transgenic crops",
    "synthetic biology in farming",
    "bioengineering in agriculture",
    "microbial fertilizers",

    // Smart Farming & Modern Agriculture Technologies
    "drip irrigation",
    "precision irrigation",
    "agriculture drones",
    "IoT in agriculture",
    "big data in agriculture",
    "smart farming",
    "robotics in agriculture",
    "AI in farming",
    "machine learning in agriculture",
    "automated greenhouses",
    "blockchain in agriculture",
    "remote sensing in farming",
    "cloud-based farm management",
    "autonomous tractors",
    "weather monitoring systems",
    "crop monitoring satellites",
    "5G in agriculture",
    "farm analytics",
    "variable rate technology (VRT)",
    "smart sensors in farming",

    // Livestock & Animal Farming
    "pasture management",
    "livestock breeding",
    "dairy farming",
    "poultry farming",
    "cattle farming",
    "goat farming",
    "sheep farming",
    "swine farming",
    "beekeeping",
    "aquaculture",
    "fish farming",
    "rabbit farming",
    "insect farming",
    "animal husbandry",
    "veterinary science",
    "animal nutrition",
    "fodder crops",
    "pasture rotation",
    "livestock disease control",
    "free-range farming",
    "intensive livestock farming",
    "grazing management",

    // Crop-Specific Terms
    "cereal crops",
    "cash crops",
    "legumes",
    "root vegetables",
    "fruit orchards",
    "oilseeds",
    "herbs and spices",
    "medicinal plants",
    "fiber crops",
    "fodder crops",
    "plantation crops",
    "tree farming",
    "vineyard management",
    "coffee farming",
    "tea plantations",
    "sugarcane farming",
    "cotton farming",
    "rubber plantations",
    "cocoa farming",

    // Rural Development & Farming Communities
    "rural development",
    "agrarian economy",
    "rural infrastructure",
    "farmland conservation",
    "community-supported agriculture (CSA)",
    "cooperative farming",
    "women in agriculture",
    "youth in farming",
    "indigenous farming practices",
    "land rights",
    "farming unions",
    "village-based agriculture",
    "agrarian reforms",
    "urban agriculture",
    "farmer education",
    "agriculture extension services",

    // Food Processing & Post-Harvest Management
    "food processing",
    "post-harvest management",
    "cold storage solutions",
    "food waste management",
    "value addition in agriculture",
    "agro-based industries",
    "food packaging technology",
    "supply chain logistics",
    "grain storage",
    "farm-to-market strategies",
    "organic food market",

    // Miscellaneous
    "mechanized farming",
    "crop diversity",
    "agriculture museums",
    "traditional farming practices",
    "herbal agriculture",
    "seed treatment",
    "rural tourism in agriculture",
    "farming innovations",
    "agriculture education",
    "precision livestock farming",
    "green revolution",
    "second green revolution",
    "water harvesting in agriculture",
    "agriculture journalism",
    "food microbiology",
    "carbon credit in agriculture",
    "alternative farming methods",
    "climate resilience in agriculture",
  ];

  return agricultureKeywords.some((keyword) =>
    prompt.toLowerCase().includes(keyword)
  );
};

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!isAgricultureRelated(prompt)) {
      return res.json({
        response:
          "This AI only answers agriculture-related questions. Please ask about farming, crops, irrigation, or any agriculture-related topic.",
      });
    }

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.json({ response: responseText });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
