import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { householdSize, cuisineInterests, cookingFrequency, budget } = await req.json();
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });
    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert meal planner and grocery shopping assistant. Create tiered grocery lists (essentials/seasonal/specialty) with cost-saving substitution alternatives. Use markdown with clear categorized lists.`,
        },
        {
          role: "user",
          content: `Create a tiered pantry and grocery list:\n- Household size: ${householdSize}\n- Cuisine interests: ${cuisineInterests}\n- Cooking frequency: ${cookingFrequency}\n- Budget: ${budget}\n\nProvide:\n1. Essential staples (always stocked)\n2. Seasonal ingredients to buy fresh\n3. Specialty items for ${cuisineInterests} cooking\n4. Cost-saving substitution alternatives\n5. Estimated weekly/monthly grocery spend\n6. Tips for reducing food waste`,
        },
      ],
      temperature: 0.7,
    });
    return NextResponse.json({ result: response.choices[0].message.content });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
