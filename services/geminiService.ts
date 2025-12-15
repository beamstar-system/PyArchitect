import { GoogleGenAI, Type } from "@google/genai";
import { ProjectStructure } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCodebase = async (
  prompt: string,
  modelName: string = 'gemini-3-pro-preview'
): Promise<ProjectStructure> => {
  const ai = getAiClient();
  
  const fullPrompt = `
    You are an expert Python software architect and developer. 
    Your task is to generate a complete, production-ready Python codebase based on the following user request:
    
    "${prompt}"

    Requirements:
    1. Structure the project according to modern Python best practices (e.g., using a 'src' directory if applicable, or flat structure for simple scripts).
    2. Include a 'requirements.txt' or 'pyproject.toml' for dependencies.
    3. Include a 'README.md' with setup and usage instructions.
    4. Ensure all code is properly typed (type hints) and documented (docstrings).
    5. The 'projectName' should be a valid, slugified directory name.
    6. Return the response strictly as a JSON object matching the defined schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            projectName: { type: Type.STRING, description: "A slugified name for the project folder" },
            description: { type: Type.STRING, description: "A short summary of what was generated" },
            files: {
              type: Type.ARRAY,
              description: "List of files to generate",
              items: {
                type: Type.OBJECT,
                properties: {
                  path: { type: Type.STRING, description: "Relative file path (e.g., main.py, src/utils.py)" },
                  content: { type: Type.STRING, description: "The complete source code content of the file" }
                },
                required: ["path", "content"]
              }
            }
          },
          required: ["projectName", "files", "description"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from AI.");
    }
    
    return JSON.parse(text) as ProjectStructure;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};