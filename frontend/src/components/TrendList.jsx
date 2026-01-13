import React from 'react';
import Grid from '@mui/material/Grid';
import TrendCard from './features/TrendCard';

const TrendList = ({ trends, selectedTrends, onToggleTrend }) => {
  return (
    <Grid container spacing={3}>
      {trends.map((trend) => (
        <Grid key={trend.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <TrendCard
            title={trend.title}
            summary={trend.summary || 'No summary available.'}
            source={trend.source_name || 'Unknown Source'}
            date={new Date(trend.published_at).toLocaleDateString()}
            isSelected={selectedTrends.includes(trend.id)}
            onToggle={() => onToggleTrend(trend.id)}
            isDuplicate={trend.status === 'sent'}
            status={trend.status}
            originalUrl={trend.original_url}
            sourceType={trend.source_type}
            thumbnailUrl={trend.thumbnail_url}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default TrendList;
