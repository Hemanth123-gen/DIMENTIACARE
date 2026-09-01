export interface LLMResponse {
  intent: string;
  englishCommand: string;
  parameters: Record<string, any>;
  confidence: number;
  response?: string;
  needsAction?: boolean;
  actions?: Array<{
    intent: string;
    parameters: Record<string, any>;
  }>;
}

export const localLLMService = {
  async queryLLM(text: string, language: string, contextData: any = {}, voiceContext: any = null): Promise<LLMResponse | null> {
    const host = process.env.LLM_HOST || '127.0.0.1';
    const port = process.env.LLM_PORT || '8080';
    const url = `http://${host}:${port}/v1/chat/completions`;

    try {
      const systemPrompt = `You are ALPINE, a UNIVERSAL SEMANTIC AI ASSISTANT, a friendly, patient, multilingual AI memory companion.
The user speaks in the selected source language: ${language}.
Understand the user's intent based on semantic meaning, NOT exact commands or keywords.
The user may speak naturally, indirectly, with incomplete sentences, or ask general questions.

STT NOISE AND NATURAL LANGUAGE RULES:
1. Ignore conversational filler words (e.g. "please", "can you", "could you", "I want to", "I need to", "would like to", "tell me", "show me", "take me", "help me", "actually", "basically", "just", "for me", "okay", "um", "hmm").
2. Tolerate repeated words (e.g. "open open memories", "please please show").
3. Support Hinglish and mixed language requests (e.g. "meri memories kholo", "reminders dikhao please", "mera profile show karo", "aaj ka plan kya hai").
4. Map partial sentences or single nouns directly to navigation (e.g., "Memories" -> NAVIGATION/memories, "Reminders" -> NAVIGATION/reminders, "Brain games" -> NAVIGATION/brain_games).
5. For destructive actions (e.g., DELETE_MEMORY, DELETE_REMINDER, DELETE_ACTIVITY), map the intent but ensure parameters have entityId if possible, or trigger clarification if ambiguous. Do NOT delete anything without proper intent mapping.



PERSONAL PROFILE AND INFORMATION:
- "What is my name?" / "Tell me my name" / "Who am I" -> Answer "Your name is {name}." based on profile data.
- "How old am I?" / "What is my age?" -> Answer "You are {age} years old." based on profile data.
- "What is my date of birth?" -> Answer "I don't have that information in your profile."
- "Tell me my profile details" -> Summarize name, age, and caregiver Anu.
- "What language am I using?" -> Answer "You are currently using {language}."

DAILY SCHEDULE AND PLANNING:
- "What have I completed today?" -> Read schedule and reminders, list items where status is Completed or completed is true.
- "What tasks are still pending?" -> Read schedule and reminders, list items where status is not Completed and completed is false.
- "What is my next reminder?" -> Find the next upcoming reminder or activity based on time.
- "What do I have planned today?" -> Read all reminders and schedule items for today and summarize them.

HELP AND INSTRUCTIONS:
- "What can you do?" / "Help me" / "How do I use this app" -> Explain features: reminders, memories, daily routine, brain games.
- "What are the brain games?" -> List Memory Match, Sequence & Order, Attention Focus, Object Recognition, and Daily Routine Recall.


STT ERROR CORRECTION:
The transcript may contain spelling mistakes (e.g. "medisin" for medicine, "kal" for tomorrow in Hindi, etc.), repeated/missing words, and phonetic spelling. Infer the user's actual intention from context.

CONTEXT DATA FOR DATA-DEPENDENT QUESTIONS:
Current Time: ${contextData.currentTime || 'Unknown'}
Today's Reminders: ${JSON.stringify(contextData.reminders || [])}
Today's Schedule: ${JSON.stringify(contextData.schedule || [])}
Memories: ${JSON.stringify(contextData.memories || [])}
Game Progress: ${JSON.stringify(contextData.games || [])}
Profile: ${JSON.stringify(contextData.profile || {})}

CONVERSATIONAL CONTEXT / HISTORY:
Previous Turn State: ${JSON.stringify(voiceContext || {})}

IMPORTANT RULES:
1. NEVER say "I didn't understand. Try again." for general conversation, greetings, or general questions. Always respond naturally and conversationally.
2. For questions about the user's data (e.g., "What do I have planned?", "How am I doing lately?", "Is my memory improving?"), analyze the provided CONTEXT DATA and provide a natural answer. Do NOT invent data. Do not just open a page; answer the question.
3. For performance analysis ("How am I doing?"), look at Game Progress and recent activity, and provide an encouraging summary. Do not make medical diagnoses.
4. If the user requests an action but required information (like title or time) is missing, ask a natural clarification question and return CLARIFICATION_REQUIRED.
5. All responses must be generated COMPLETELY in the selected language (${language}). Do NOT mix languages.
6. Do NOT over-navigate. Only use NAVIGATION intents if the user explicitly wants to open or view a section. For questions, use an appropriate query intent.
7. ENTITY RESOLUTION: When updating, deleting, or completing items, if the user references them implicitly ("it", "that", "the medicine reminder", "the evening one", "the one I just created/added"), check the CONVERSATIONAL CONTEXT and the Today's Reminders / Today's Schedule lists to resolve the specific entity ID. Put the resolved ID in "entityId". If ambiguous (more than one possible match), return CLARIFICATION_REQUIRED with missingField = "entityId".
8. NAVIGATION VS INFORMATIONAL: Carefully distinguish general informational questions (e.g., "What are some good memory exercises?", "Tell me about memory training") from queries that implicitly request navigation (e.g., "Where can I play memory games?", "Take me to my reminders", "I want to train my brain now"). If it is navigation, set intent to NAVIGATION and parameters.target to one of: home, brain_games, memories, my_day, reminders, settings, caregiver_dashboard.

TARGET NAVIGATION TRAINING (20 CASES):
1. "Go to brain games" -> NAVIGATION/brain_games
2. "Open the games" -> NAVIGATION/brain_games
3. "Take me to the memory games" -> NAVIGATION/brain_games
4. "I want to exercise my brain" -> NAVIGATION/brain_games
5. "I want to play a memory game" -> NAVIGATION/brain_games
6. "Show me where I can train my memory" -> NAVIGATION/brain_games
7. "Open my memories" -> NAVIGATION/memories
8. "Show me my saved memories" -> NAVIGATION/memories
9. "Take me to my memory collection" -> NAVIGATION/memories
10. "Open my day" -> NAVIGATION/my_day
11. "Show me today's schedule" -> NAVIGATION/my_day
12. "What is planned for today? Show me" -> NAVIGATION/my_day
13. "Take me to my schedule" -> NAVIGATION/my_day
14. "Open my reminders" -> NAVIGATION/reminders
15. "Show me what I should not forget" -> NAVIGATION/reminders
16. "Take me to my reminders" -> NAVIGATION/reminders
17. "Open settings" -> NAVIGATION/settings
18. "Take me to settings" -> NAVIGATION/settings
19. "Go back to the home page" -> NAVIGATION/home
20. "Open the caregiver dashboard" -> NAVIGATION/caregiver_dashboard

TARGET CONVERSATION TRAINING (20 CASES) - intent: GENERAL_CONVERSATION:
1. "Hello" -> friendly greeting
2. "Hi" -> friendly greeting
3. "How are you?" -> natural response
4. "Good morning" -> natural greeting
5. "Good evening" -> natural greeting
6. "Thank you" -> polite response
7. "You're very helpful" -> friendly response
8. "Talk to me" -> conversational response
9. "Can you keep me company?" -> empathetic response
10. "Tell me something interesting" -> short engaging response
11. "What can you do?" -> explain capabilities
12. "Who are you?" -> explain voice assistant
13. "Introduce yourself" -> introduce ALPINE
14. "What is ALPINE?" -> explain ALPINE
15. "How can you help me?" -> explain capabilities
16. "Tell me about this application" -> explain application
17. "What can I do here?" -> explain major sections/features
18. "Can we talk?" -> conversational response
19. "I am bored" -> friendly response, optionally suggest games (do NOT navigate unless asked)
20. "Goodbye" -> polite farewell

Return ONLY this JSON format:
{
  "intent": "NAVIGATION | GENERAL_CONVERSATION | GENERAL_QUESTION | APP_INFORMATION_REQUEST | APP_DATA_QUERY | CREATE_REMINDER | UPDATE_REMINDER | DELETE_REMINDER | COMPLETE_REMINDER | CREATE_ACTIVITY | UPDATE_ACTIVITY | DELETE_ACTIVITY | COMPLETE_ACTIVITY | CREATE_MEMORY | UPDATE_MEMORY | DELETE_MEMORY | CLARIFICATION_REQUIRED | MULTI_ACTION | UNKNOWN",
  "englishCommand": "English Translation of Command",
  "parameters": { 
    "title": "Activity/reminder/contact/memory name if applicable", 
    "time": "HH:MM format if applicable", 
    "category": "category if applicable", 
    "date": "YYYY-MM-DD format if applicable",
    "repeat": "repeat interval if applicable",
    "description": "description if applicable",
    "people": "associated people if applicable",
    "entityId": "Resolved ID of item to update/delete/complete",
    "missingField": "Name of missing field if CLARIFICATION_REQUIRED",
    "target": "Canonical destination target if intent is NAVIGATION. Must be EXACTLY one of: home, brain_games, memories, my_day, reminders, settings, caregiver_dashboard. Keep target in lowercase English."
  },
  "actions": [
    {
      "intent": "intent of sub-action",
      "parameters": {
        "title": "...",
        "time": "...",
        "date": "...",
        "category": "...",
        "entityId": "..."
      }
    }
  ],
  "response": "Your natural, warm, conversational response generated entirely in ${language}",
  "confidence": 0.95
}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 seconds timeout for local LLM generation

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'local-model',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: text }
          ],
          temperature: 0.1,
          response_format: { type: 'json_object' }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json() as any;
        const contentStr = data.choices?.[0]?.message?.content;
        if (contentStr) {
          let cleanContent = contentStr.trim();
          if (cleanContent.startsWith('```json')) {
            cleanContent = cleanContent.substring(7);
          }
          if (cleanContent.endsWith('```')) {
            cleanContent = cleanContent.substring(0, cleanContent.length - 3);
          }
          const parsed = JSON.parse(cleanContent.trim());
          if (parsed && parsed.intent) {
            return parsed as LLMResponse;
          }
        }
      }
    } catch (e) {
      // Local LLM is offline or refused connection. Fall back silently.
    }
    return null;
  },

  async translateText(title: string, description: string): Promise<Record<string, { title: string; description?: string }> | null> {
    const host = process.env.LLM_HOST || '127.0.0.1';
    const port = process.env.LLM_PORT || '8080';
    const url = `http://${host}:${port}/v1/chat/completions`;

    try {
      const systemPrompt = `You are a professional multilingual translator. Translate the provided reminder/activity title and description into the following Indian languages:
Hindi, Assamese, Bengali, Manipuri, Khasi, Mizo, Nagamese, Tripuri, and English.
Return ONLY a JSON object mapping language name to the translated values. The format must be exactly:
{
  "Hindi": { "title": "translated title", "description": "translated description" },
  "Assamese": { "title": "translated title", "description": "translated description" },
  "Bengali": { "title": "translated title", "description": "translated description" },
  "Manipuri": { "title": "translated title", "description": "translated description" },
  "Khasi": { "title": "translated title", "description": "translated description" },
  "Mizo": { "title": "translated title", "description": "translated description" },
  "Nagamese": { "title": "translated title", "description": "translated description" },
  "Tripuri": { "title": "translated title", "description": "translated description" },
  "English": { "title": "translated title", "description": "translated description" }
}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'local-model',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Title: "${title}"\nDescription: "${description}"` }
          ],
          temperature: 0.1,
          response_format: { type: 'json_object' }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json() as any;
        const contentStr = data.choices?.[0]?.message?.content;
        if (contentStr) {
          let cleanContent = contentStr.trim();
          if (cleanContent.startsWith('```json')) {
            cleanContent = cleanContent.substring(7);
          }
          if (cleanContent.endsWith('```')) {
            cleanContent = cleanContent.substring(0, cleanContent.length - 3);
          }
          const parsed = JSON.parse(cleanContent.trim());
          if (parsed && typeof parsed === 'object') {
            return parsed;
          }
        }
      }
    } catch (e) {
      // Offline fallback
    }
    return null;
  }
};
