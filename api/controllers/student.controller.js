const { successHandler, errorHandler } = require('../helpers/responseHandler');
const service = require('../services/student.service')


module.exports = {
    login: async (req, res) => {
        try {
            const data = req.body;
            if (data !== undefined && data !== null && Object.keys(data).length > 0) {
                const userData = await service.authUser(data);
                if (userData) {
                    successHandler(res, 200, "Login successfull", userData);
                }
            } else {
                errorHandler(res, 400, 'login_error', 'Email or password missing.')
            }
        } catch (error) {
            if (error.code === 500) {
                errorHandler(res, 500, 'server_error', error.message);
            } else {
                errorHandler(res, 409, 'login_error', error.message);
            }
        }
    },

    createUser: async (req, res) => {
        try {
            const data = req.body;
            if (data !== undefined && data !== null && Object.keys(data).length > 0) {
                const userData = await service.addUser(data);
                if (userData) {
                    successHandler(res, 200, "User added successfully!", userData);
                }
            } else {
                errorHandler(res, 400, 'user_addition_error', 'Form data missing.');
            }
        } catch (error) {
            if (error.code === 500) {
                errorHandler(res, 500, 'server_error', error.message);
            } else {
                errorHandler(res, 409, 'user_addition_error', error.message);
            }
        }
    },

    createSubject: async (req, res) => {
        try {
            const data = req.body;
            if (data !== undefined && data !== null && Object.keys(data).length > 0) {
                const subjectData = await service.addSubject(data);
                if (subjectData) {
                    successHandler(res, 200, "Subject added successfully!", subjectData);
                }
            } else {
                errorHandler(res, 400, 'subject_addition_error', 'Subject data missing.');
            }
        } catch (error) {
            if (error.code === 500) {
                errorHandler(res, 500, 'server_error', error.message);
            } else {
                errorHandler(res, 409, 'subject_addition_error', error.message);
            }
        }
    },

    addMarks: async (req, res) => {
        try {
            const data = req.body;
            if (data !== undefined && data !== null && Object.keys(data).length > 0) {
                const studentMarksData = await service.addMarks(data);
                if (studentMarksData) {
                    successHandler(res, 200, "Subject marks added successfully!", studentMarksData);
                }
            } else {
                errorHandler(res, 400, 'subject-marks_addition_error', 'Subject marks data missing.');
            }
        } catch (error) {
            if (error.code === 500) {
                errorHandler(res, 500, 'server_error', error.message);
            } else {
                errorHandler(res, 409, 'subject-marks_addition_error', error.message);
            }
        }
    },

    generateReport: async (req, res) => {
        try {
            const { id } = req.params;
            console.log(id)
            if (id) {
                const studentReportData = await service.createReport(id);
                if (studentReportData) {
                    successHandler(res, 200, "Report generated successfully!", studentReportData);
                }
            } else {
                errorHandler(res, 400, 'generate_report_error', 'Student id missing.');
            }
        } catch (error) {
            if (error.code === 500) {
                errorHandler(res, 500, 'server_error', error.message);
            } else {
                errorHandler(res, 409, 'generate_report_error', error.message);
            }
        }
    }
}