import React, { useEffect, useState } from 'react';
import SourceForm from '../components/SourceForm';
import PageHeader from '../components/common/PageHeader';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Chip, Box, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useFeedback } from '../contexts/FeedbackContext';
import { categoriesApi } from '../api/categoriesApi';
import { sourcesApi } from '../api/sourcesApi';

const Sources = () => {
  const [sources, setSources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [editingSource, setEditingSource] = useState(null);
  const { showFeedback } = useFeedback();

  useEffect(() => {
    fetchSources();
    fetchCategories();
  }, []);

  const fetchSources = async () => {
    try {
      const data = await sourcesApi.getAll();
      setSources(data);
    } catch (error) {
      showFeedback('Failed to load sources.', 'error');
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories for filter', error);
    }
  };

  const handleSaveSource = async (sourceData) => {
    try {
      if (editingSource) {
        await sourcesApi.update(editingSource.id, sourceData);
        showFeedback('Source updated successfully!', 'success');
        setEditingSource(null);
      } else {
        await sourcesApi.create(sourceData);
        showFeedback('Source added successfully!', 'success');
      }
      fetchSources();
    } catch (error) {
      showFeedback(`Failed to ${editingSource ? 'update' : 'add'} source.`, 'error');
    }
  };

  const handleEditSource = (source) => {
    setEditingSource(source);
    // Optional: Scroll to top or form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingSource(null);
  };

  const handleDeleteSource = async (id) => {
    if (!window.confirm('Are you sure you want to delete this source?')) return;
    try {
      await sourcesApi.delete(id);
      showFeedback('Source deleted.', 'success');
      fetchSources();
    } catch (error) {
      showFeedback('Failed to delete source.', 'error');
    }
  };

  const filteredSources = filterCategory 
    ? sources.filter(s => s.category_ids?.includes(filterCategory))
    : sources;

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <PageHeader title="Manage Sources" />
        <FormControl size="small" sx={{ minWidth: 200, mb: 2 }}>
          <InputLabel id="category-filter-label">Filter by Category</InputLabel>
          <Select
            labelId="category-filter-label"
            value={filterCategory}
            label="Filter by Category"
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <MenuItem value=""><em>All Categories</em></MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      <SourceForm 
        onSubmit={handleSaveSource} 
        initialData={editingSource} 
        onCancel={handleCancelEdit} 
      />

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Categories</TableCell>
              <TableCell>URL / ID</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSources.map((source) => (
              <TableRow key={source.id} selected={editingSource?.id === source.id}>
                <TableCell>{source.name}</TableCell>
                <TableCell>
                  <Chip 
                    label={source.type.toUpperCase()} 
                    color={source.type === 'rss' ? 'primary' : 'secondary'} 
                    size="small" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {source.category_names && source.category_names.length > 0 ? (
                      source.category_names.map(name => (
                        <Chip key={name} label={name} size="small" />
                      ))
                    ) : (
                      <span style={{ color: '#888', fontStyle: 'italic' }}>Uncategorized</span>
                    )}
                  </Box>
                </TableCell>
                <TableCell>{source.url}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEditSource(source)} color="primary" size="small" aria-label="edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteSource(source.id)} color="error" size="small" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredSources.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">No sources found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Sources;