import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem, FormControl, InputLabel, Select, Checkbox, ListItemText } from '@mui/material';
import { categoriesApi } from '../api/categoriesApi';

const SourceForm = ({ onSubmit, initialData, onCancel }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('rss');
  const [categoryIds, setCategoryIds] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setUrl(initialData.url);
      setType(initialData.type);
      setCategoryIds(initialData.category_ids || []);
    } else {
      setName('');
      setUrl('');
      setType('rss');
      setCategoryIds([]);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && url) {
      onSubmit({ name, url, type, categoryIds });
      if (!initialData) { // Only reset if adding new
        setName('');
        setUrl('');
        setType('rss');
        setCategoryIds([]);
      }
    }
  };

  const isEditing = !!initialData;

  const handleCategoryChange = (event) => {
    const {
      target: { value },
    } = event;
    setCategoryIds(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
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
          disabled={isEditing}
        >
          <MenuItem value="rss">RSS Feed</MenuItem>
          <MenuItem value="youtube">YouTube</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel id="source-category-label">Categories</InputLabel>
        <Select
          labelId="source-category-label"
          multiple
          value={categoryIds}
          label="Categories"
          onChange={handleCategoryChange}
          renderValue={(selected) => {
            const selectedNames = categories
              .filter(cat => selected.includes(cat.id))
              .map(cat => cat.name);
            return selectedNames.join(', ');
          }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              <Checkbox checked={categoryIds.indexOf(cat.id) > -1} />
              <ListItemText primary={cat.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        {isEditing ? 'Update' : 'Add Source'}
      </Button>
      {isEditing && (
        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </Box>
  );
};

export default SourceForm;