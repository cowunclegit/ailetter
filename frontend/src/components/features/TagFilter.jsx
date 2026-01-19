import React from 'react';
import { Autocomplete, TextField, Checkbox, Chip } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const TagFilter = ({ categories, selectedIds, onChange }) => {
  const selectedOptions = categories.filter(cat => selectedIds.includes(cat.id));

  return (
    <Autocomplete
      multiple
      id="category-filter"
      options={categories}
      disableCloseOnSelect
      getOptionLabel={(option) => option.name}
      value={selectedOptions}
      onChange={(event, newValue) => {
        onChange(newValue.map(v => v.id));
      }}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props;
        return (
          <li key={option.id} {...optionProps}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.name}
          </li>
        );
      }}
      style={{ minWidth: 300 }}
      renderInput={(params) => (
        <TextField {...params} label="Filter by Category" placeholder="Select categories" />
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <Chip
              key={option.id}
              label={option.name}
              {...tagProps}
            />
          );
        })
      }
    />
  );
};

export default TagFilter;
