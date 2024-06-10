import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
 
const gemini_api_key = process.env.API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};
 
const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-pro",
  geminiConfig,
});
 
export const generate = async () => {
  try {
    const prompt = "Give me daily needed kind of Notes example that includes title and description and make sure to give max 3 ideas for notes and also make sure it is not offensive, sexual and hurtful it should just depict the daily life activity and goals and make sure to give the response in json data formmat and don't include ```json in response and also give me direct json object and make sure to not use \\n in the description and anywhere and directly give me array of json data objects";
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    console.log("api call to ai");
    return response.text();
  } catch (error) {
    console.log("response error", error);
  }
};
 