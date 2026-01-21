import React from 'react';
import { Card, CardContent, Typography, CardActions, Checkbox, Chip, Box, FormControlLabel, Link, CardMedia } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import YouTubeIcon from '@mui/icons-material/YouTube';
import NewspaperIcon from '@mui/icons-material/Newspaper';

const TrendCard = ({ title, summary, source, date, isSelected, onToggle, isDuplicate, status, originalUrl, sourceType, thumbnailUrl, categoryNames = [] }) => {
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    setImageError(false);
    if (thumbnailUrl) {
      // console.log(`TrendCard [${title}]: ${thumbnailUrl}`);
    }
  }, [thumbnailUrl, title]);

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      opacity: status === 'sent' ? 0.7 : 1,
      border: status === 'sent' ? '1px solid #ff9800' : 'none'
    }}>
      {thumbnailUrl && !imageError ? (
        <CardMedia
          component="img"
          height="140"
          image={thumbnailUrl}
          alt={title}
          onError={(e) => {
            console.error(`Image load failed for ${title}:`, e);
            setImageError(true);
          }}
          sx={{ objectFit: 'cover' }}
          referrerPolicy="no-referrer"
        />
      ) : (
        <Box sx={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.200' }}>
          <NewspaperIcon sx={{ fontSize: 60, color: 'grey.400' }} />
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1} flexWrap="wrap" gap={0.5}>
          <Box display="flex" alignItems="center" gap={0.5}>
            {sourceType === 'youtube' && <YouTubeIcon color="error" fontSize="small" data-testid="YouTubeIcon" />}
            <Typography variant="caption" color="textSecondary">
              {source} • {date}
            </Typography>
          </Box>
          <Box display="flex" gap={0.5}>
            {status === 'sent' && (
              <Chip 
                icon={<SendIcon />} 
                label="발송완료" 
                color="warning" 
                variant="outlined"
                size="small" 
              />
            )}
            {status === 'draft' && (
              <Chip 
                icon={<EditIcon />} 
                label="작성 중" 
                color="info" 
                variant="outlined"
                size="small" 
              />
            )}
          </Box>
        </Box>
        
        <Box display="flex" gap={0.5} mb={1} flexWrap="wrap">
          {categoryNames.length > 0 ? (
            categoryNames.map(name => (
              <Chip key={name} label={name} size="small" variant="filled" sx={{ height: 20, fontSize: '0.7rem' }} />
            ))
          ) : (
            <Chip label="Uncategorized" size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem', fontStyle: 'italic' }} />
          )}
        </Box>

        <Typography variant="h6" component="div" gutterBottom>
          <Link href={originalUrl} target="_blank" rel="noopener" underline="hover" color="primary">
            {title}
          </Link>
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {summary}
        </Typography>
      </CardContent>
      <CardActions>
        <FormControlLabel
          control={<Checkbox checked={isSelected} onChange={onToggle} color="primary" />}
          label="Select for Newsletter"
          sx={{ ml: 1 }}
        />
      </CardActions>
    </Card>
  );
};

export default TrendCard;
