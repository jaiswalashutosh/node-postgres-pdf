/**
 * @description Common response handler
 */
const successHandler = (res, code, message, data, paginationData = null) => {
    const objResponse = {
        status: code,
        message: message,
        data: {
            message
        }
    };
    if (data && typeof data !== undefined) {
        objResponse.data = data;
    }
    if (paginationData) {
        objResponse.pagination = {
            total: paginationData.total,
            skip: paginationData.skip,
            limit: paginationData.limit,
        };
    }
    return res.status(code).send(objResponse);
};

const errorHandler = (res, code, errorCode, message) => {
    const objResponse = {
        status: code,
        error: {
            code: errorCode,
            message: message,
        },
    };
    return res.status(code).send(objResponse);
};

module.exports = { successHandler, errorHandler };