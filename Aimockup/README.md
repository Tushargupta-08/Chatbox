🔍 Research

I reviewed 4 leading AI interfaces and noted their standout features:

OpenAI Playground

Feature: Model Selector with advanced parameter tuning (temperature, max tokens, etc.).

Reason: Allows flexible experimentation with different models and settings.

Hugging Face Spaces

Feature: Community Templates/Demos for quickly testing pre-built models.

Reason: Inspires a feature to save/load custom prompts for reusability.

Anthropic Claude UI

Feature: Clean chat-based conversation interface with threading.

Reason: Provides a user-friendly chat + output area for better readability.

Microsoft Copilot Lab

Feature: Prompt Engineering Suggestions (pre-written prompt ideas).

Reason: Helps users explore prompt templates for different tasks.

✨ Features Chosen for My Design

Based on the research, I combined the most compelling features into 6 core elements:

Model Selector → Choose between models (GPT-3.5, GPT-4, Custom).

Prompt Editor → Text area with Save/Load template option.

Parameters Panel → Sliders/inputs for settings (temperature, tokens).

Chat/Output Area → Display AI responses in a clean chat layout.

Prompt Templates → Predefined prompts for common tasks.

Light/Dark Mode (extra polish) → Improve accessibility & usability.

🎨 Design (Figma)

The design mockup was created in Figma.

Layout:

Left Sidebar → Model Selector + Parameters Panel.

Main Area → Prompt Editor + Chat/Output.

Top Bar → App title + Dark/Light toggle.

Tailwind Tokens Used:

Spacing → p-4, m-6, gap-4

Typography → text-xl font-semibold, text-gray-700

Colors → bg-gray-900, bg-white, text-white, text-black, bg-blue-500

💻 Development

The project is built with:

Next.js (TypeScript, strict mode)

Tailwind CSS for styling

Deployment: Vercel

Core Components:

ModelSelector.tsx → Dropdown for models

PromptEditor.tsx → Textarea + save/load feature (dummy JSON)

ParametersPanel.tsx → Sliders/inputs for AI settings

ChatOutput.tsx → Chat bubbles for conversation

🚀 Deployment

Deployed on Vercel for fast, serverless hosting.
[https://a-imockup.vercel.app/]
