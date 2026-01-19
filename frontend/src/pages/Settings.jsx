import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PageHeader from '../components/common/PageHeader';
import AIPresetForm from '../components/features/AIPresetForm';
import { aiPresetsApi } from '../api/aiPresetsApi';
import { useFeedback } from '../contexts/FeedbackContext';

const Settings = () => {
  const [presets, setPresets] = useState([]);
  const [editingPreset, setEditingSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showFeedback } = useFeedback();

  useEffect(() => {
    fetchPresets();
  }, []);

  const fetchPresets = async () => {
    setLoading(true);
    try {
      const data = await aiPresetsApi.getAll();
      setPresets(data);
    } catch (error) {
      console.error('Failed to load presets:', error);
      showFeedback('Failed to load AI presets.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingPreset) {
        await aiPresetsApi.update(editingPreset.id, data);
        showFeedback('Preset updated successfully', 'success');
      } else {
        await aiPresetsApi.create(data);
        showFeedback('Preset created successfully', 'success');
      }
      setEditingSource(null);
      fetchPresets();
    } catch (error) {
      showFeedback('Failed to save preset.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this preset?')) return;
    try {
      await aiPresetsApi.delete(id);
      showFeedback('Preset deleted successfully', 'success');
      fetchPresets();
    } catch (error) {
      showFeedback(error.response?.data?.message || 'Failed to delete preset.', 'error');
    }
  };

  return (
    <Container maxWidth="md">
      <PageHeader title="Settings" />
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>AI Subject Presets</Typography>
        <AIPresetForm 
          initialData={editingPreset} 
          onSubmit={handleSave} 
          onCancel={editingPreset ? () => setEditingSource(null) : null} 
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Template Snippet</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {presets.map((preset) => (
                  <TableRow key={preset.id}>
                    <TableCell>
                      {preset.name}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {preset.prompt_template}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => setEditingSource(preset)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDelete(preset.id)} 
                        color="error" 
                        disabled={preset.is_default === 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {presets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">No presets defined.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default Settings;
