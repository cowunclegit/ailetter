import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Box, Typography } from '@mui/material';

const RichTextEditor = ({ label, value, onChange }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'link',
  ];

  return (
    <Box sx={{ mb: 3 }}>
      {label && (
        <Typography variant="subtitle1" gutterBottom>
          {label}
        </Typography>
      )}
      <Box sx={{ 
        '.ql-container': { 
          minHeight: '150px',
          fontSize: '16px',
          fontFamily: 'inherit'
        },
        '.ql-editor': {
          minHeight: '150px'
        },
        bgcolor: 'background.paper'
      }}>
        <ReactQuill
          theme="snow"
          value={value || ''}
          onChange={onChange}
          modules={modules}
          formats={formats}
        />
      </Box>
    </Box>
  );
};

export default RichTextEditor;
