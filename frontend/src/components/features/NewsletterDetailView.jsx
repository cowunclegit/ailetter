import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  Chip,
  Link
} from '@mui/material';

const NewsletterDetailView = ({ newsletter }) => {
  const { 
    subject, 
    issue_date, 
    status, 
    introduction_html, 
    conclusion_html, 
    items 
  } = newsletter;

  const getStatusChip = (status) => {
    const color = status === 'sent' ? 'success' : 'warning';
    return <Chip label={status.toUpperCase()} color={color} size="small" />;
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1">
            {subject || `Newsletter #${newsletter.id}`}
          </Typography>
          {getStatusChip(status)}
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Issue Date: {issue_date}
        </Typography>
        
        <Divider sx={{ my: 2 }} />

        {introduction_html && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Introduction
            </Typography>
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: 'grey.50', 
                borderRadius: 1,
                overflow: 'auto',
                '& p': { m: 0 } 
              }}
              dangerouslySetInnerHTML={{ __html: introduction_html }}
            />
          </Box>
        )}

        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Articles
        </Typography>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {items && items.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Link href={item.original_url} target="_blank" rel="noopener" underline="hover">
                      {item.title}
                    </Link>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {item.source_name}
                      </Typography>
                      {` — ${item.summary}`}
                    </React.Fragment>
                  }
                />
              </ListItem>
              {index < items.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>

        {conclusion_html && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Conclusion
            </Typography>
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: 'grey.50', 
                borderRadius: 1,
                overflow: 'auto',
                '& p': { m: 0 } 
              }}
              dangerouslySetInnerHTML={{ __html: conclusion_html }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default NewsletterDetailView;
