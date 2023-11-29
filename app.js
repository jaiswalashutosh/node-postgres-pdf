const express = require('express');
const { sequelize, dbConnection } = require('./api/database/connection');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
var PORT = process.env.PORT;
const winston = require('winston');
const Users = require('./api/models/users.model');
const Subjects = require('./api/models/subjects.model');
const StudentSubjectMarks = require('./api/models/student-subject-marks.model');
const StudentProfile = require('./api/models/student-profile.model');
const TeacherProfile = require('./api/models/teacher-profile.model');



winston.configure({
    transports: [new winston.transports.Console()],
});


(async () => {
    await dbConnection();
    await sequelize.sync({ force: false });
    app.listen(PORT, () => {
        winston.info(`Server is listening on port : ${PORT}`);
    })
})();

// app.use(cors());
const router = require('./api/routes/student.route');
app.use('/', router);

