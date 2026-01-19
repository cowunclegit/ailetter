import React from 'react';
import { Box, Typography, Divider, Grid } from '@mui/material';
import TrendCard from './TrendCard';

const DailyGroup = ({ date, items, selectedTrends, onToggleTrend }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ 
        position: 'sticky', 
        top: 64, // Adjust based on AppBar height
        backgroundColor: 'background.default',
        zIndex: 1,
        py: 1,
        mb: 2
      }}>
        <Typography variant="h6" color="primary">
          {date}
        </Typography>
        <Divider />
      </Box>
      <Grid container spacing={3}>
        {items.map(trend => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={trend.id}>
            <TrendCard
              title={trend.title}
              summary={trend.summary || 'No summary available.'}
              source={trend.source_name || 'Unknown Source'}
              date={new Date(trend.published_at).toLocaleDateString()}
              isSelected={selectedTrends.includes(trend.id)}
              onToggle={() => onToggleTrend(trend.id)}
              status={trend.status}
              originalUrl={trend.original_url}
              sourceType={trend.source_type}
              thumbnailUrl={trend.thumbnail_url}
              categoryNames={trend.category_names}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DailyGroup;
