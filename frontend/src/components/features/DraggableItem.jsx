import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Paper, Typography, Box } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const DraggableItem = ({ id, title, source, date }) => {
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
          {title}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {source} • {date}
        </Typography>
      </Box>
    </Paper>
  );
};

export default DraggableItem;
