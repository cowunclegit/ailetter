import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, 
  Box, 
  CircularProgress, 
  Typography, 
  Button 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import PageHeader from '../components/common/PageHeader';
import NewsletterDetailView from '../components/features/NewsletterDetailView';
import { useFeedback } from '../contexts/FeedbackContext';

const API_URL = '/api';

const NewsletterDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsletter, setNewsletter] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showFeedback } = useFeedback();

  useEffect(() => {
    fetchNewsletter();
  }, [id]);

  const fetchNewsletter = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/newsletters/${id}`);
      setNewsletter(response.data);
    } catch (error) {
      console.error('Error fetching newsletter details:', error);
      showFeedback('Failed to load newsletter details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!newsletter) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h6">Newsletter not found.</Typography>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/history')}
          sx={{ mt: 2 }}
        >
          Back to History
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <PageHeader 
        title={`Newsletter Details #${newsletter.issue_number}`} 
        action={
          <Box sx={{ display: 'flex', gap: 2 }}>
            {newsletter.status === 'draft' && (
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<EditIcon />} 
                onClick={() => navigate(`/newsletters/${id}/draft`)}
              >
                Continue Editing
              </Button>
            )}
            <Button 
              variant="outlined"
              startIcon={<ArrowBackIcon />} 
              onClick={() => navigate('/history')}
            >
              Back to History
            </Button>
          </Box>
        }
      />
      
      <Box sx={{ mt: 4 }}>
        <NewsletterDetailView newsletter={newsletter} />
      </Box>
    </Container>
  );
};

export default NewsletterDetails;