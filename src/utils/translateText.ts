interface TranslationResponse {
  data: {
    translations: Array<{
      translatedText: string;
      detectedSourceLanguage?: string;
    }>;
  };
}

export type LanguageCode = "en" | "bn";

const translateText = async (
  text: string,
  targetLang: LanguageCode
): Promise<string> => {
  // Access API key from environment variables inside the function
  const apiKey = process.env["NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY"];

  if (!apiKey) {
    return text; // Return original text if no API key
  }

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          source: targetLang === "bn" ? "en" : "bn",
          target: targetLang,
          format: "text",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data: TranslationResponse = await response.json();
    return data.data?.translations?.[0]?.translatedText || text;
  } catch (error) {
    return text; // Return original text on error
  }
};

export default translateText;
