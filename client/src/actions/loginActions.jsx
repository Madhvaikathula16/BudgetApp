// ---------------------------------------- Login Validation ------------------------------------
export const loginRequest = (userdetails, islogin) => {
  if (islogin) {
    return loginSuccess(userdetails);
  } else {
    return loginFailure("Incorrect userName or Password");
  }
};
// -------------------------------------  Validation end --------------------------------------------------
export const loginSuccess = (user) => {
  return { type: "LOGIN_SUCCESS", payload: user };
};

export const loginFailure = (error) => {
  return { type: "LOGIN_FAILURE", payload: error };
};

export const clickSignin = () => {
  return { type: "SIGNIN" };
};
