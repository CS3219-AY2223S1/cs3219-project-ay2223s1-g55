import { stringToUrlFormat } from '@/lib/helpers';
import { QuestionType } from '@/lib/types';
import { ListItem, ListItemText, Divider } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';

interface QuestionListItemProps {
  question: QuestionType;
  completed?: boolean;
}

const QuestionListItem = ({ question, completed = false }: QuestionListItemProps) => {
  const url = `/questions/${stringToUrlFormat(question.title)}`;
  return (
    <>
      <Link href={url} passHref>
        <ListItem sx={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
          <ListItemText primary={question.title} />
          {completed ? (
            <CheckCircleTwoToneIcon color='success' />
          ) : (
            <CancelTwoToneIcon color='error' />
          )}
        </ListItem>
      </Link>
      <Divider />
    </>
  );
};

export default QuestionListItem;
