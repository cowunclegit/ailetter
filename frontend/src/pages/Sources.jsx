import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SourceForm from '../components/SourceForm';
import PageHeader from '../components/common/PageHeader';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  IconButton, Chip 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFeedback } from '../contexts/FeedbackContext';

const API_URL = '/api';

const Sources = () => {
  const [sources, setSources] = useState([]);
  const { showFeedback } = useFeedback();

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const response = await axios.get(`${API_URL}/sources`);
      setSources(response.data);
    } catch (error) {
      showFeedback('Failed to load sources.', 'error');
    }
  };

  const handleAddSource = async (newSource) => {
    try {
      await axios.post(`${API_URL}/sources`, newSource);
      showFeedback('Source added successfully!', 'success');
      fetchSources();
    } catch (error) {
      showFeedback('Failed to add source.', 'error');
    }
  };

  const handleDeleteSource = async (id) => {
    try {
      await axios.delete(`${API_URL}/sources/${id}`);
      showFeedback('Source deleted.', 'success');
      fetchSources();
    } catch (error) {
      showFeedback('Failed to delete source.', 'error');
    }
  };

  return (
    <div>
      <PageHeader title="Manage Sources" />
      
      <SourceForm onAdd={handleAddSource} />

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>URL / ID</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sources.map((source) => (
              <TableRow key={source.id}>
                <TableCell>{source.name}</TableCell>
                <TableCell>
                  <Chip 
                    label={source.type.toUpperCase()} 
                    color={source.type === 'rss' ? 'primary' : 'secondary'} 
                    size="small" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{source.url}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleDeleteSource(source.id)} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {sources.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">No sources configured.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Sources;