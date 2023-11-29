const express = require('express');
const router = express.Router();
const controller = require('../controllers/student.controller')
const { logRequestBody } = require('../helpers/logger');
const { authenticateToken } = require('../helpers/authenticateToken')

router.route('/login')
    .post(logRequestBody, controller.login);

router.route('/create-user')
    .post(logRequestBody, authenticateToken, controller.createUser);

router.route('/create-subject')
    .post(logRequestBody, authenticateToken, controller.createSubject);

router.route('/add-marks')
    .post(logRequestBody, authenticateToken, controller.addMarks);

router.route('/generate-report/:id')
    .get(logRequestBody, authenticateToken, controller.generateReport);


module.exports = router;