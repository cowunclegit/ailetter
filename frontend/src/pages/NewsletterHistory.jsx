import React, { useEffect, useState } from 'react';
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

  const getStatusChip = (status) => {
    const color = status === 'sent' ? 'success' : 'warning';
    return <Chip label={status.toUpperCase()} color={color} size="small" />;
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
              <TableCell>ID</TableCell>
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
                <TableRow key={newsletter.id}>
                  <TableCell>{newsletter.id}</TableCell>
                  <TableCell>{newsletter.issue_date}</TableCell>
                  <TableCell>{getStatusChip(newsletter.status)}</TableCell>
                  <TableCell align="right">{newsletter.item_count}</TableCell>
                  <TableCell>{new Date(newsletter.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    {newsletter.sent_at ? new Date(newsletter.sent_at).toLocaleString() : '-'}
                  </TableCell>
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
