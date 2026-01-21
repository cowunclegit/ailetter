import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageHeader from '../components/common/PageHeader';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip,
  CircularProgress,
  Typography
} from '@mui/material';

const API_URL = '/api';

const NewsletterHistory = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      const response = await axios.get(`${API_URL}/newsletters`);
      setNewsletters(response.data);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (id) => {
    navigate(`/newsletters/${id}`);
  };

  const getStatusChip = (status) => {
    const color = status === 'sent' ? 'success' : 'warning';
    return <Chip label={status.toUpperCase()} color={color} size="small" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    // Handle SQLite format (YYYY-MM-DD HH:MM:SS) by replacing space with T for better cross-browser parsing
    const normalizedDate = dateString.includes(' ') ? dateString.replace(' ', 'T') : dateString;
    const date = new Date(normalizedDate);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
  };

  if (loading) {
    return <CircularProgress sx={{ display: 'block', m: '50px auto' }} />;
  }

  return (
    <div>
      <PageHeader title="Newsletter History" />
      
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Issue #</TableCell>
              <TableCell>Issue Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Items</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Sent At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newsletters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" sx={{ py: 3 }}>No newsletters found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              newsletters.map((newsletter) => (
                <TableRow 
                  key={newsletter.id} 
                  hover 
                  onClick={() => handleRowClick(newsletter.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>#{newsletter.issue_number}</TableCell>
                  <TableCell>{newsletter.issue_date}</TableCell>
                  <TableCell>{getStatusChip(newsletter.status)}</TableCell>
                  <TableCell align="right">{newsletter.item_count}</TableCell>
                  <TableCell>{formatDate(newsletter.created_at)}</TableCell>
                  <TableCell>{formatDate(newsletter.sent_at)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default NewsletterHistory;
