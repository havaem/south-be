const REGEX = {
    //* 8-20 characters, no special characters, no consecutive dots or underscores
    username: /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
    //* Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[0-9a-zA-Z!@#$%^&*]{8,}$/,
    //* Email regex
    email: /^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/,
    //* Slug regex
    slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    //* username or email login
    usernameLogin: /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$|([A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3})$/,
    //* 6-digit OTP
    otp: /^\d{6}$/,
};

export { REGEX };
