// backend/src/routes/index.js
// 이 파일은 모든 라우터를 모아서 export하는 역할을 합니다.

const express = require('express');
const router = express.Router();

const users = require('./users');
const transactions = require('./transactions');
const rewards = require('./rewards');
const consultations = require('./consultations');

// 각 라우터에 기본 경로를 설정해줍니다.
router.use('/users', users);
router.use('/transactions', transactions);
router.use('/rewards', rewards);
router.use('/consultations', consultations);


module.exports = router;
