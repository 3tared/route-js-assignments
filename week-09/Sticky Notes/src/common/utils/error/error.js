export const ErrorExeption = ({
  message = "Something Went Wrong",
  status = 400,
  extra = undefined,
} = {}) => {
  throw new Error(message, { cause: { status, extra } });
};

export const ErrorDublicate = (message = "Conflict", extra = undefined) => {
  ErrorExeption({
    message,
    status: 409,
    extra,
  });
};

export const ErrorNotFound = (message = "Not Found", extra = undefined) => {
  ErrorExeption({
    message,
    status: 404,
    extra,
  });
};
export const ErrorUnauthorized = (
  message = "Unauthorized",
  extra = undefined,
) => {
  ErrorExeption({
    message,
    status: 401,
    extra,
  });
};
export const ErrorSameData = (message = "Can't Update", extra = undefined) => {
  ErrorExeption({
    message,
    status: 400,
    extra,
  });
};
