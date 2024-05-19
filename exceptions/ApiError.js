class ApiError extends Error {
    constructor(status, msg, errors = []) {
        super(msg);
        this.status = status;
        this.errors = errors;
    }

    static BadRequest(msg, errors) {
        return new ApiError(400, msg, errors);
    }

    static Unauthorized(msg) {
        return new ApiError(401, "Unauthorized user");
    }

    static Forbidden(msg) {
        return new ApiError(403, msg);
    }

    static Teapot(msg) {
        return new ApiError(418, msg);
    }

    static TooManyRequests(msg) {
        return new ApiError(429, msg)
    }

    static Internal(msg) {
        return new ApiError(500, msg)
    }
}

export default ApiError;