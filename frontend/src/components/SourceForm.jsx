import React, { useState } from 'react';
import { TextField, Button, Box, MenuItem, FormControl, InputLabel, Select } from '@mui/material';

const SourceForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('rss');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && url) {
      onAdd({ name, url, type });
      setName('');
      setUrl('');
      setType('rss');
    }
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2, 
        alignItems: { xs: 'stretch', md: 'flex-start' }, 
        mb: 2 
      }}
    >
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        size="small"
        sx={{ minWidth: { md: '200px' } }}
      />
      <TextField
        label="URL / Channel ID"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
        size="small"
        sx={{ flexGrow: 1 }}
      />
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel id="source-type-label">Type</InputLabel>
        <Select
          labelId="source-type-label"
          value={type}
          label="Type"
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value="rss">RSS Feed</MenuItem>
          <MenuItem value="youtube">YouTube</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        Add Source
      </Button>
    </Box>
  );
};

export default SourceForm;
