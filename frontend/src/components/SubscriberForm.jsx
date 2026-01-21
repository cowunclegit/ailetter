import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Box,
  Chip
} from '@mui/material';
import { createSubscriber, updateSubscriber } from '../api/subscribers';
import { aiPresetsApi } from '../api/aiPresetsApi';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const SubscriberForm = ({ open, onClose, subscriber }) => {
  const [formData, setFormData] = useState({
    name: subscriber?.name || '',
    email: subscriber?.email || '',
    categoryIds: subscriber?.categories ? subscriber.categories.map(c => c.id) : []
  });
  const [presets, setPresets] = useState([]);

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const data = await aiPresetsApi.getAll();
        setPresets(data);
      } catch (error) {
        console.error('Failed to fetch presets', error);
      }
    };
    fetchPresets();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData(prev => ({
      ...prev,
      categoryIds: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (subscriber) {
        await updateSubscriber(subscriber.id, formData);
      } else {
        await createSubscriber(formData);
      }
      onClose(true); // true = refresh needed
    } catch (error) {
      console.error('Failed to save subscriber', error);
      alert('Failed to save: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} fullWidth maxWidth="sm">
      <DialogTitle>{subscriber ? 'Edit Subscriber' : 'Add Subscriber'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            disabled={!!subscriber} // Often email is immutable or requires special handling
          />
          <FormControl fullWidth>
            <InputLabel id="categories-label">Categories</InputLabel>
            <Select
              labelId="categories-label"
              multiple
              value={formData.categoryIds}
              onChange={handleCategoryChange}
              input={<OutlinedInput id="select-multiple-chip" label="Categories" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const preset = presets.find(p => p.id === value);
                    return (
                      <Chip key={value} label={preset ? preset.name : value} />
                    );
                  })}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {presets.map((preset) => (
                <MenuItem
                  key={preset.id}
                  value={preset.id}
                >
                  {preset.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubscriberForm;
