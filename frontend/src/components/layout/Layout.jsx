import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Link as RouterLink } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, minWidth: '150px' }}>
            AILetter
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" component={RouterLink} to="/">
              Home
            </Button>
            <Button color="inherit" component={RouterLink} to="/sources">
              Sources
            </Button>
            <Button color="inherit" component={RouterLink} to="/categories">
              Categories
            </Button>
            <Button color="inherit" component={RouterLink} to="/history">
              History
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
