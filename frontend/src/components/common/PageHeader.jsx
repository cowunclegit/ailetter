import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const PageHeader = ({ title, action }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        gap: 2,
        mb: 2 
      }}>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        {action && (
          <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
            {action}
          </Box>
        )}
      </Box>
      <Divider />
    </Box>
  );
};

export default PageHeader;
