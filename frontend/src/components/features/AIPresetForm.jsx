import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper 
} from '@mui/material';

const AIPresetForm = ({ initialData, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [promptTemplate, setPromptTemplate] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setPromptTemplate(initialData.prompt_template || '');
    } else {
      setName('');
      setPromptTemplate('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, prompt_template: promptTemplate });
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {initialData ? 'Edit AI Preset' : 'Create New AI Preset'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Preset Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          placeholder="e.g., SW Developers"
        />
        <TextField
          label="Prompt Template"
          value={promptTemplate}
          onChange={(e) => setPromptTemplate(e.target.value)}
          required
          fullWidth
          multiline
          rows={4}
          placeholder="Enter instructions. Use ${contentList} where articles should be injected."
          helperText="Tip: Use ${contentList} to include draft items."
        />
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button onClick={onCancel} color="inherit">
              Cancel
            </Button>
          )}
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Update Preset' : 'Add Preset'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default AIPresetForm;
