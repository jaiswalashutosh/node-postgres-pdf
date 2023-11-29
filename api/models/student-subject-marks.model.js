const { DataTypes, INTEGER } = require('sequelize');
const { sequelize } = require('../database/connection');

const StudentSubjectMarks = sequelize.define('StudentSubjectMarks', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    marks: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
    },
}, {
    tableName: 'student_subject_marks',
    timestamps: true,
});


module.exports = StudentSubjectMarks;