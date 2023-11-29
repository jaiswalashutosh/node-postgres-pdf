const User = require('../models/users.model');
const Student = require('../models/student-profile.model');
const Teacher = require('../models/teacher-profile.model');
const Subject = require('../models/subjects.model');
const StudentSubjectMarks = require('../models/student-subject-marks.model')
const { op } = require('sequelize');
const bycrypt = require('bcryptjs');
const { generateAccessToken } = require('../helpers/generateAccessToken');
const { sequelize } = require('../database/connection');
const { generatePDF } = require('../helpers/generatePdf')


module.exports = {
    authUser: async (data) => {
        try {
            let { email, password } = data;
            if (!email && !password) {
                throw new Error('Bad request: Email or password missing');
            }
            let user = await User.findOne({
                where: {
                    email: email.toLowerCase(),
                }
            });
            if (!user) {
                throw new Error('User does not exist.')
            }
            if (user && (await bycrypt.compare(password, user.password))) {
                const tokenData = { email: email.toLowerCase(), role: user.role, id: user.id };
                const tokenResult = await generateAccessToken(tokenData);
                user.access_token = tokenResult.access_token;
                return { access_token: tokenResult.access_token, user };
            } else {
                throw new Error('Invalid Credentials')
            }
        } catch (error) {
            console.log(`Could not login user: ${error.message}`);
            throw error;
        }
    },

    addUser: async (data) => {
        try {
            let { role } = data;
            if (!role) {
                throw new Error('Bad request: Role missing');
            }
            if (role === 'admin') {
                console.log(role);
                let { email, password } = data;
                if (!email && !password) {
                    throw new Error('Bad request: Some data fields missing');
                }
                const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
                if (existingUser) {
                    throw new Error('Email already exists.');
                }
                const hashedPassword = await bycrypt.hash(password, 10);
                const user = User.create({
                    email: email.toLowerCase(),
                    password: hashedPassword,
                    role
                });
                return user;
            } else if (role === 'teacher') {
                console.log(role)
                let { first_name, last_name, email, password } = data;
                if (!first_name && !last_name && !email && !password) {
                    throw new Error('Bad request: Some data fields missing');
                }
                const existingUserInTeacher = await Teacher.findOne({ where: { email: email.toLowerCase() } });
                const existingUserInUser = await User.findOne({ where: { email: email.toLowerCase() } });
                if (existingUserInTeacher || existingUserInUser) {
                    throw new Error('Email already exists.');
                }
                const hashedPassword = await bycrypt.hash(password, 10);

                const newTeacher = await Teacher.create({
                    first_name,
                    last_name,
                    email: email.toLowerCase(),
                    password: hashedPassword
                });

                const user = await User.create({
                    email: email.toLowerCase(),
                    password: hashedPassword,
                    role
                });

                return newTeacher;
            } else if (role === 'student') {
                console.log(role);
                let { first_name, last_name, email, school_name, division, standard, password } = data;
                if (!first_name && !last_name && !email && !school_name && !division && !standard && !password) {
                    throw new Error('Bad request: Some data fields missing');
                }
                const existingUserInStudent = await Student.findOne({ where: { email: email.toLowerCase() } });
                const existingUserInUser = await User.findOne({ where: { email: email.toLowerCase() } });
                if (existingUserInStudent || existingUserInUser) {
                    throw new Error('Email already exists.');
                }
                const hashedPassword = await bycrypt.hash(password, 10);

                const newStudent = await Student.create({
                    first_name,
                    last_name,
                    email: email.toLowerCase(),
                    school_name,
                    division: division.toLowerCase(),
                    standard,
                    password: hashedPassword
                });

                const user = await User.create({
                    email: email.toLowerCase(),
                    password: hashedPassword,
                    role
                });

                return newStudent;
            } else {
                throw new Error('ROLE missing!')
            }
        } catch (error) {
            console.log(`Could not register user: ${error.message}`);
            throw error;
        }
    },

    addSubject: async (data) => {
        try {
            let { subject_name } = data;
            if (!subject_name) {
                throw new Error('Bad request: Some data fields missing');
            }
            const subject = await Subject.create({
                subject_name
            })

            return subject;
        } catch (error) {
            console.log(`Could not register subject: ${error.message}`);
            throw error;
        }
    },

    addMarks: async (data) => {
        try {
            let { student_id, subject_id, marks } = data;
            if (!student_id && !subject_id && !marks) {
                throw new Error('Bad request: Some data fields missing');
            }
            const student = await Student.findOne({
                where: {
                    roll_no: student_id
                }
            });
            if (!student) {
                throw new Error('Student does not exist.');
            }
            const subject = await Subject.findOne({
                where: {
                    subject_id: subject_id
                }
            });
            if (!subject) {
                throw new Error('Subject does not exist.');
            }

            const studentSubjectMarks = await StudentSubjectMarks.create({
                student_id,
                subject_id,
                marks
            })

            return studentSubjectMarks

        } catch (error) {
            console.log(`Could not add subject marks: ${error.message}`);
            throw error;
        }
    },

    createReport: async (id) => {
        try {
            const studentExists = await Student.findOne({
                where: {
                    roll_no: id
                }
            });
            if (!studentExists) {
                throw new Error('Student not found.');
            }

            const query = `
            SELECT
                sp.first_name,
                sp.last_name,
                sp.roll_no,
                sp.email,
                sp.school_name,
                sp.division,
                sp.standard,
                JSON_AGG(JSON_BUILD_OBJECT('subject_name', s.subject_name, 'marks', ssm.marks)) AS report
            FROM
                student_profile sp
            INNER JOIN
                student_subject_marks ssm ON sp.roll_no = ssm.student_id
            INNER JOIN
                subjects s ON ssm.subject_id = s.subject_id
            WHERE
                sp.roll_no = :id
            GROUP BY
                sp.first_name,
                sp.last_name,
                sp.roll_no,
                sp.email,
                sp.school_name,
                sp.division,
                sp.standard;
            `;

            const results = await sequelize.query(query, {
                replacements: { id },
                type: sequelize.QueryTypes.SELECT,
            });

            // Using array reduce to format data

            // const formattedData = results.reduce((acc, curr) => {
            //     const {
            //         first_name,
            //         last_name,
            //         email,
            //         school_name,
            //         division,
            //         standard,
            //         subject_name,
            //         marks
            //     } = curr;

            //     const existingStudent = acc.find(
            //         (student) => student.email === email
            //     );

            //     if (existingStudent) {
            //         existingStudent.report.push({
            //             subject_name,
            //             marks
            //         });
            //     } else {
            //         acc.push({
            //             first_name,
            //             last_name,
            //             email,
            //             school_name,
            //             standard,
            //             division,
            //             report: [{
            //                 subject_name,
            //                 marks
            //             }]
            //         });
            //     }
            //     return acc;
            // }, []);
            // console.log(formattedData);
            // return formattedData;

            // Using object to format data
            // const formattedData = {};

            // results.forEach((curr) => {
            //     console.log(curr)
            //     const {
            //         first_name,
            //         last_name,
            //         roll_no,
            //         email,
            //         school_name,
            //         division,
            //         standard,
            //         subject_name,
            //         marks
            //     } = curr;

            //     if (!formattedData.email) {
            //         formattedData.first_name = first_name;
            //         formattedData.last_name = last_name;
            //         formattedData.roll_no = roll_no;
            //         formattedData.email = email;
            //         formattedData.school_name = school_name;
            //         formattedData.standard = standard;
            //         formattedData.division = division;
            //         formattedData.report = [];
            //     }

            //     formattedData.report.push({
            //         subject_name,
            //         marks
            //     });
            // });
            // console.log(formattedData);

            console.log(results[0]);
            const fileName = await generatePDF(results[0], id);
            return [results[0], fileName];
        } catch (error) {
            console.log(`Could not generate report: ${error.message}`);
            throw error;
        }
    },
}