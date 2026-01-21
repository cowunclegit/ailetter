class AiProvider {
  /**
   * Generates a plain text response from the AI.
   * @param {string} prompt - The input text or instruction.
   * @param {Object} [options] - Configuration like model, temperature, etc.
   * @returns {Promise<string>}
   */
  async getCompletion(prompt, options = {}) {
    throw new Error('Method getCompletion must be implemented');
  }

  /**
   * Generates a JSON response from the AI.
   * @param {string} prompt - The input text or instruction.
   * @param {Object} [options] - Configuration like model, temperature, etc.
   * @returns {Promise<Object>}
   */
  async getJsonCompletion(prompt, options = {}) {
    throw new Error('Method getJsonCompletion must be implemented');
  }
}

module.exports = AiProvider;
