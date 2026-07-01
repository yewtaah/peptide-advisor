export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export function generateAdvisorReply(question: string, productName: string): string {
  const q = question.toLowerCase();
  if (q.includes("dose") || q.includes("dosing") || q.includes("how much")) {
    return `Dosing for ${productName} varies by goals and body weight. See the "Dosing Considerations" panel above for the commonly researched range, and confirm with a licensed practitioner before starting — this isn't personalized medical advice.`;
  }
  if (q.includes("side effect") || q.includes("risk") || q.includes("safe")) {
    return `The main risks noted for ${productName} are listed in the Risks & Considerations panel. If you have an existing condition or take other medications, a practitioner consult is recommended before use.`;
  }
  if (q.includes("stack") || q.includes("combine") || q.includes("with")) {
    return `Stacking depends on your goals — many customers pair recovery peptides with longevity or metabolic protocols. I'd recommend a Health Assessment or practitioner consult to confirm compatibility with ${productName}.`;
  }
  return `Good question about ${productName}. Based on current research, this product is generally used as described in the overview above. For anything specific to your health history, please consult one of our licensed practitioners.`;
}
