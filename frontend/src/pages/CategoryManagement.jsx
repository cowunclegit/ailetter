import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Alert, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CategoryList from '../components/CategoryList';
import CategoryForm from '../components/CategoryForm';
import { categoriesApi } from '../api/categoriesApi';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (error) {
      showNotification('Failed to load categories', 'error');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddClick = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? Linked sources will become uncategorized.')) {
      try {
        await categoriesApi.delete(id);
        showNotification('Category deleted successfully', 'success');
        fetchCategories();
      } catch (error) {
        showNotification('Failed to delete category', 'error');
      }
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, data);
        showNotification('Category updated successfully', 'success');
      } else {
        await categoriesApi.create(data);
        showNotification('Category created successfully', 'success');
      }
      setIsFormOpen(false);
      fetchCategories();
    } catch (error) {
      const msg = error.response?.data?.error || 'Operation failed';
      showNotification(msg, 'error');
    }
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Source Categories
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />} 
          onClick={handleAddClick}
        >
          Add Category
        </Button>
      </Box>

      <CategoryList 
        categories={categories} 
        onEdit={handleEditClick} 
        onDelete={handleDeleteClick} 
      />

      <CategoryForm 
        open={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit} 
        initialData={editingCategory} 
      />

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CategoryManagement;
