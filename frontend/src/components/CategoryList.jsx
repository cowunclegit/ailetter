import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CategoryList = ({ categories, onEdit, onDelete }) => {
  if (!categories || categories.length === 0) {
    return <Typography variant="body1">No categories found.</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell component="th" scope="row">
                {category.name}
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onEdit(category)} aria-label="edit" size="small">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(category.id)} aria-label="delete" size="small" color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CategoryList;
