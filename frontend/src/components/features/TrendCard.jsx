import React from 'react';
import { Card, CardContent, Typography, CardActions, Checkbox, Chip, Box, FormControlLabel, Link, CardMedia } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import YouTubeIcon from '@mui/icons-material/YouTube';
import NewspaperIcon from '@mui/icons-material/Newspaper';

const TrendCard = ({ title, summary, source, date, isSelected, onToggle, isDuplicate, status, originalUrl, sourceType, thumbnailUrl }) => {
  const [imageError, setImageError] = React.useState(false);

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
          onError={() => setImageError(true)}
        />
      ) : (
        <Box sx={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.200' }}>
          <NewspaperIcon sx={{ fontSize: 60, color: 'grey.400' }} />
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1} flexWrap="wrap" gap={0.5}>
          <Box display="flex" alignItems="center" gap={0.5}>
            {sourceType === 'youtube' && <YouTubeIcon color="error" fontSize="small" />}
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
        <Typography variant="h6" component="div" gutterBottom>
          <Link href={originalUrl} target="_blank" rel="noopener" underline="hover" color="inherit">
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
