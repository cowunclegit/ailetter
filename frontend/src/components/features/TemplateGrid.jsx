import React from 'react';
import { 
  Typography, 
  Box, 
  Chip,
  Stack
} from '@mui/material';

const TemplateGrid = ({ templates, selectedId, onSelect }) => {
  return (
    <Box sx={{ mt: 4, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Select Email Layout</Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {templates.map((template) => {
          const isSelected = template.id === selectedId;
          return (
            <Chip
              key={template.id}
              label={template.name}
              onClick={() => onSelect(template.id)}
              color={isSelected ? "primary" : "default"}
              variant={isSelected ? "filled" : "outlined"}
              sx={{ mb: 1 }}
            />
          );
        })}
      </Stack>
    </Box>
  );
};

export default TemplateGrid;
