
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { BudgetCategory, Transaction } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ADVISOR_SYSTEM_INSTRUCTION = `
You are an expert financial advisor for the '4Budgets' method.
The 4Budgets method helps users choose the right product tier for their lifestyle:
1. Basic: Budget-friendly solutions, essentials only.
2. Standard: Perfect balance between quality and price.
3. Premium: High-quality products, refined design.
4. Elite: Luxury products, premium materials, max features.

Keep responses concise (under 100 words).
`;

const SHOPPING_SYSTEM_INSTRUCTION = `
You are a helpful sales assistant for "4Budgets". We sell 4 types of product tiers:
1. Basic: Ideal for those looking for budget-friendly solutions without sacrificing essentials.
2. Standard: A perfect balance between quality and price, great value for money.
3. Premium: Offers high-quality products with refined design and superior performance.
4. Elite: Luxury products made with premium materials and a wide range of features.

Your goal is to ask the user 1 or 2 simple questions about what they are looking for and their budget, then recommend ONE of these 4 tiers.
Keep it friendly, short, and encouraging.
`;

export const analyzeFinances = async (
  budgets: BudgetCategory[],
  recentTransactions: Transaction[]
): Promise<string> => {
  try {
    const budgetSummary = budgets.map(b => 
      `${b.name} (${b.type}): Spent $${b.spent} of $${b.allocated}`
    ).join('\n');

    const transactionSummary = recentTransactions.slice(0, 5).map(t => 
      `${t.date}: ${t.description} - $${t.amount} (${t.isExpense ? 'Expense' : 'Income'})`
    ).join('\n');

    const prompt = `
      Please analyze my current financial status.
      
      Current Budgets:
      ${budgetSummary}
      
      Recent Transactions:
      ${transactionSummary}
      
      Provide a brief summary and one specific recommendation based on the 4Budgets tiers (Basic, Standard, Premium, Elite).
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: ADVISOR_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "I couldn't generate an analysis at this time.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Unable to connect to AI advisor. Please check your connection or API key.";
  }
};

export const chatWithAdvisor = async (
  message: string, 
  contextData: { budgets: BudgetCategory[] }
): Promise<string> => {
  try {
    const contextString = JSON.stringify(contextData.budgets);
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Context: User's budget state is ${contextString}. \n\n User Question: ${message}`,
      config: {
        systemInstruction: ADVISOR_SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "I didn't catch that.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm having trouble thinking right now. Try again later.";
  }
};

export const getShoppingAdvice = async (
  history: { role: 'user' | 'ai'; text: string }[],
  newMessage: string
): Promise<string> => {
  try {
    // Construct a simple chat history string
    const chatHistory = history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join('\n');
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${chatHistory}\nUser: ${newMessage}`,
      config: {
        systemInstruction: SHOPPING_SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "I'm here to help you find the right budget plan.";
  } catch (error) {
    console.error("Gemini Shopping Error:", error);
    return "I'm having trouble connecting right now.";
  }
};
