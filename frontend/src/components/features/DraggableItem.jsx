import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Paper, Typography, Box, Link, IconButton } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';

const DraggableItem = ({ id, title, source, date, originalUrl, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 'auto',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    cursor: 'default'
  };

  return (
    <Paper ref={setNodeRef} style={style} elevation={isDragging ? 4 : 1}>
      <Box {...attributes} {...listeners} sx={{ cursor: 'grab', mr: 2, display: 'flex' }}>
        <DragIndicatorIcon color="action" />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" component="div">
          <Link href={originalUrl} target="_blank" rel="noopener" underline="hover" color="primary">
            {title}
          </Link>
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {source} • {date}
        </Typography>
      </Box>
      <IconButton 
        onClick={() => onDelete && onDelete(id)} 
        color="error" 
        size="small"
        sx={{ ml: 1 }}
        aria-label="delete item"
      >
        <DeleteIcon />
      </IconButton>
    </Paper>
  );
};

export default DraggableItem;
