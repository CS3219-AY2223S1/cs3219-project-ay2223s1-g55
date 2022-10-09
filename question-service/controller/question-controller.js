import {
  ormAddQuestion as _addQuestion,
  ormCheckQuestionExists as _checkQuestionExists,
  ormGetQuestions as _getQuestions,
} from '../model/question-orm.js';

export const getQuestions = async (req, res) => {
  const difficulty = req.query.difficulty;
  if (difficulty) {
    const lowerCaseDifficulty = difficulty.toLocaleLowerCase();
    let questions;
    switch (lowerCaseDifficulty) {
      case 'easy':
        questions = await _getQuestions({ difficulty: 'Easy' });
        return res.status(200).json({ difficulty: 'easy', questions });
      case 'medium':
        questions = await _getQuestions({ difficulty: 'Medium' });
        return res.status(200).json({ difficulty: 'medium', questions });
      case 'hard':
        questions = await _getQuestions({ difficulty: 'Hard' });
        return res.status(200).json({ difficulty: 'hard', questions });
      default:
        return res.status(400).json({ difficulty, success: false });
    }
  }

  const questions = await _getQuestions({});
  return res.status(200).json({ questions });
};

export const getQuestionByTitle = async (req, res) => {
  const queryTitle = req.params.title;

  if (!queryTitle) return res.status(400).json({ message: 'Title missing' });

  const tokens = queryTitle.split('-');

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    tokens[i] = token.charAt(0).toUpperCase() + token.substring(1);
  }

  const title = tokens.join(' ');
  const question = await _getQuestions({ title });

  if (question.length === 0) return res.status(400).json({ message: 'No such title' });

  return res.status(200).json({ question });
};

export const addQuestion = async (req, res) => {
  const { title, description, difficulty, examples, constraints } = req.body;

  if (!title || !description || !examples || !constraints)
    return res.status(400).json({ message: 'Missing fields' });

  const titleExists = await _checkQuestionExists(title);

  if (titleExists) {
    return res.status(400).json({ message: 'Question already exists' });
  }

  if (difficulty !== 'Easy' && difficulty !== 'Medium' && difficulty !== 'Hard')
    return res.status(400).json({ message: 'Invalid difficulty' });

  if (examples.length === 0 || constraints.length === 0) {
    return res
      .status(400)
      .json({ message: examples.length === 0 ? 'No examples given' : 'No constraints given' });
  }

  const resp = await _addQuestion({ title, description, difficulty, examples, constraints });
  if (resp.err) return res.status(400).json({ message: 'Could not add question' });
  return res.status(200).json({ message: `'${title}' successfully added` });
};
