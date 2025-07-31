import jwt from "jsonwebtoken";

export const sendCookie = (user, res, message, statusCode = 200) => {
    console.log(
        "---------------------",
        user,
        message,
        statusCode,
        "-------------------->"
    );
    const { email, role, name, profile_pic, isVerify } = user;
   const userData = {
        _id: user._id,
        email,
        role,
        name,
        profile_pic,
        isVerify,
    };
    // Generate JWT token
    const token = jwt.sign({ _id: user._id}, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });

    // Set cookie options
    const cookieOptions = {
        httpOnly: true, // Prevent JavaScript access for security
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: process.env.SAMESITE,//"lax",
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        path: "/",
    };

    return res.status(statusCode).cookie("token", token, cookieOptions).json({
        success: true,
        message,
        data: userData,
        token: token,
    });
};

// export const removeCookie = (res, message = "Logged out successfully") => {
//     const cookieOptions = {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "lax",
//         expires: new Date(0), // Expire the cookie immediately
//         path: "/",
//     };

//     return res
//         .status(200)
//         .cookie("token", "", cookieOptions) // Clear the token
//         .json({
//             success: true,
//             message,
//         });
// };

export const removeCookie = (res) => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(0), // Expire the cookie immediately
        path: "/",
    };

    res.cookie("token", "", cookieOptions); // ✅ Only clear the cookie
};
