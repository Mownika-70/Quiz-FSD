const express = require('express');
const Question = require('../models/Question');
const jwt = require('jsonwebtoken');

const router = express.Router();

function verifyAdmin(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

router.get('/', async (req, res) => {
  const questions = await Question.find({}, '-correct');
  res.json(questions);
});

router.post('/', verifyAdmin, async (req, res) => {
  const { question, options, correct } = req.body;

  if (!question || !options || !correct) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const newQuestion = new Question({ question, options, correct });
  await newQuestion.save();
  res.json({ message: 'Question added successfully' });
});

module.exports = router;
