# AI Provider Interface Contract

All AI providers (Mock, OpenAI, Custom) must implement the following methods to ensure compatibility with `AiService`.

## Methods

### `getCompletion(prompt, options)`
Generates a plain text response from the AI.

**Parameters:**
- `prompt`: String - The input text or instruction.
- `options`: Object (optional) - Configuration like `model`, `temperature`, etc.

**Returns:**
- `Promise<string>` - The generated text.

---

### `getJsonCompletion(prompt, options)`
Generates a JSON response from the AI.

**Parameters:**
- `prompt`: String - The input text or instruction.
- `options`: Object (optional) - Configuration like `model`, `temperature`, etc.

**Returns:**
- `Promise<Object>` - The parsed JSON object.
- **Note**: The provider is responsible for parsing the response and ensuring it is valid JSON.
