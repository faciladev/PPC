
//Custom AppError class
class AppError extends Error {
  constructor(message, errorType, httpErrorCode, isOperational) {
    super(); 
    this.message = message;
    this.errorType = errorType || AppError.ErrorTypes.InternalServerError;
    this.httpErrorCode = httpErrorCode || AppError.HttpErrorCodes.InternalServerError;
    this.isOperational = isOperational || true;
    Error.captureStackTrace(this, AppError); 
  }
}

AppError.ErrorTypes = {
	NotFound: "NotFound",
	UnauthorizedAccess: "Unauthorized Access",
	PermissionDenied: "Permission Denied",
	InternalServerError: "Internal Server Error"
}

AppError.HttpErrorCodes = {
	NotFound: 404,
	UnauthorizedAccess: 401,
	PermissionDenied: 403,
	InternalServerError: 500
}

module.exports = AppError;