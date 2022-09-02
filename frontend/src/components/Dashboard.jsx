import { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const Dashboard = () => {
  const [difficulty, setDifficulty] = useState('');
  const handleChange = (e) => {
    setDifficulty(e.target.value);
  };

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel>Difficulty</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={difficulty}
          label="Difficulty"
          onChange={handleChange}
        >
          <MenuItem value={'Easy'}>Easy</MenuItem>
          <MenuItem value={'Medium'}>Medium</MenuItem>
          <MenuItem value={'Hard'}>Hard</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default Dashboard;
