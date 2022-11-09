import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Difficulty, QuestionDifficultyToColorMap, QuestionType } from '@/lib/types';
import Link from 'next/link';

interface QuestionListProps {
  allQuestions: QuestionType[];
}

const QuestionList = ({ allQuestions }: QuestionListProps) => {
  const [questions, setQuestions] = useState<QuestionType[]>(allQuestions);

  // Search and difficulty filter related
  const [currDifficulty, setCurrDifficulty] = useState<Difficulty>('All');
  const [searchInput, setSearchInput] = useState<string>('');

  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  const handleDifficultyChange = (e: SelectChangeEvent<string>) => {
    const selectedDifficulty = e.target.value as Difficulty;
    setCurrDifficulty(selectedDifficulty);
  };

  const filtered = useMemo(() => {
    if (currDifficulty === 'All') {
      return allQuestions;
    }

    return allQuestions.filter((qn) => qn.difficulty === currDifficulty);
  }, [currDifficulty]);

  const filteredAndSearched = useMemo(() => {
    return filtered.filter((qn) => qn.title.toLowerCase().includes(searchInput.toLowerCase()));
  }, [searchInput, currDifficulty]);

  // Table Related States and Handlers
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - questions.length) : 0;
  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    setPage(page);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const slugifyTitle = (title: string) => {
    return title.toLowerCase().replaceAll(' ', '-');
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', margin: '20px' }}>
        <Box id='difficulty_selector' style={{ width: '20%' }}>
          <FormControl fullWidth>
            <InputLabel>Difficulty</InputLabel>
            <Select
              labelId='difficulty-select-label'
              id='difficulty-select'
              value={currDifficulty}
              label='Difficulty'
              onChange={handleDifficultyChange}
            >
              <MenuItem value='All'>All</MenuItem>
              <MenuItem value='Easy'>Easy</MenuItem>
              <MenuItem value='Medium'>Medium</MenuItem>
              <MenuItem value='Hard'>Hard</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box>
          <TextField
            onChange={handleSearchChange}
            variant='outlined'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label='custom pagination table'>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography sx={{ fontWeight: '600' }}>Question Title</Typography>
              </TableCell>
              <TableCell align='right'>
                <Typography sx={{ fontWeight: '600' }}>Difficulty</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredAndSearched.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredAndSearched
            ).map((qn) => (
              <TableRow key={qn.title}>
                <TableCell component='th' scope='row'>
                  <Link href={`/questions/${slugifyTitle(qn.title)}`}>
                    <Button>{qn.title}</Button>
                  </Link>
                </TableCell>
                <TableCell style={{ width: 160 }} align='right'>
                  <Typography color={QuestionDifficultyToColorMap[qn.difficulty]}>
                    {qn.difficulty}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 20, 50, { label: 'All', value: -1 }]}
                colSpan={3}
                count={questions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default QuestionList;
