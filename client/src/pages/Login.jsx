import React, { useState } from "react";
import { Container, Paper, TextField, Typography, Button, IconButton, InputAdornment, LinearProgress } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [otpError, setOtpError] = useState("");

  const toggleLogin = () => {
    setIsLogin((prev) => !prev);
    setOtpSent(false);
    setIsVerified(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setOtp("");
    setPasswordStrength(0);
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setOtpError("");
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError("Email is required");
    } else if (!emailRegex.test(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const checkPasswordStrength = (value) => {
    let strength = 0;
    if (value.length > 0) strength++;
    if (value.length >= 8) strength++;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) strength++;
    if (/[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value)) strength++;
    setPasswordStrength(strength);
    if (!value) {
      setPasswordError("Password is required");
    } else if (strength < 2) {
      setPasswordError("Password is too weak");
    } else {
      setPasswordError("");
    }
  };

  const validateConfirmPassword = (value) => {
    if (!value) {
      setConfirmPasswordError("Confirm password is required");
    } else if (value !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const validateOtp = (value) => {
    if (!value) {
      setOtpError("OTP is required");
    } else if (value.length !== 6 || !/^\d{6}$/.test(value)) {
      setOtpError("OTP must be 6 digits");
    } else {
      setOtpError("");
    }
  };

  const handleSendOtp = () => {
    if (email && !emailError) {
      setOtpSent(true);
      console.log("OTP sent to", email);
    }
  };

  const handleVerifyOtp = () => {
    if (otp.length === 6 && !otpError) {
      setIsVerified(true);
      console.log("OTP Verified");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      if (!emailError && !passwordError) {
        console.log("Form submitted", { email, password });
      } else {
        console.log("Validation errors present");
      }
    } else if (!emailError && !passwordError && !confirmPasswordError) {
      console.log("Form submitted", { email, password });
    } else {
      console.log("Validation errors present");
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return "transparent";
      case 1: return "red";
      case 2: return "orange";
      case 3: return "yellow";
      case 4: return "green";
      default: return "transparent";
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} className="p-6 flex flex-col items-center">
          <Typography variant="h5" className="mb-4">
            {isLogin ? "Login" : "Sign Up"}
          </Typography>

          {isLogin ? (
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
              <div>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  variant="outlined"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                />
                {emailError && (
                  <Typography sx={{ color: "red", fontSize: "0.75rem", mt: 0.5 }}>
                    {emailError}
                  </Typography>
                )}
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Password"
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    checkPasswordStrength(e.target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                disabled={!!emailError || !!passwordError}
              >
                Login
              </Button>
              <Typography className="text-center">or</Typography>
              <Button
                fullWidth
                color="secondary"
                variant="outlined"
                onClick={toggleLogin}
              >
                Sign Up Instead
              </Button>
            </form>
          ) : (
            <div className="w-full flex flex-col gap-4">
              {!otpSent ? (
                <>
                  <div>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      variant="outlined"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        validateEmail(e.target.value);
                      }}
                    />
                    {emailError && (
                      <Typography sx={{ color: "red", fontSize: "0.75rem", mt: 0.5 }}>
                        {emailError}
                      </Typography>
                    )}
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSendOtp}
                    disabled={!!emailError || !email}
                  >
                    Send OTP
                  </Button>
                </>
              ) : !isVerified ? (
                <>
                  <div>
                    <TextField
                      fullWidth
                      label="Enter OTP"
                      variant="outlined"
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setOtp(value);
                        validateOtp(value);
                      }}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      InputProps={{ style: { appearance: "textfield" } }}
                    />
                    {otpError && (
                      <Typography sx={{ color: "red", fontSize: "0.75rem", mt: 0.5 }}>
                        {otpError}
                      </Typography>
                    )}
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleVerifyOtp}
                    disabled={!!otpError || otp.length !== 6}
                  >
                    Verify OTP
                  </Button>
                </>
              ) : (
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                  <div>
                    <TextField
                      fullWidth
                      label="Password"
                      variant="outlined"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        checkPasswordStrength(e.target.value);
                        if (confirmPassword) validateConfirmPassword(confirmPassword);
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <LinearProgress
                      variant="determinate"
                      value={(passwordStrength / 4) * 100}
                      sx={{
                        height: 6,
                        borderRadius: 4,
                        "& .MuiLinearProgress-bar": { backgroundColor: getStrengthColor() },
                        mt: 1,
                      }}
                    />
                    <Typography variant="caption" className="text-center" sx={{ mt: 0.5 }}>
                      {passwordStrength === 0
                        ? ""
                        : passwordStrength === 1
                        ? "Weak"
                        : passwordStrength === 2
                        ? "Fair"
                        : passwordStrength === 3
                        ? "Good"
                        : "Strong"}
                    </Typography>
                   
                  </div>
                  <div>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      variant="outlined"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        validateConfirmPassword(e.target.value);
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {confirmPasswordError && (
                      <Typography sx={{ color: "red", fontSize: "0.75rem", mt: 0.5 }}>
                        {confirmPasswordError}
                      </Typography>
                    )}
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    disabled={!!passwordError || !!confirmPasswordError || !password || !confirmPassword}
                  >
                    Sign Up
                  </Button>
                </form>
              )}
              <Typography className="mt-4 text-center">or</Typography>
              <Button
                fullWidth
                color="secondary"
                variant="outlined"
                onClick={toggleLogin}
              >
                Login Instead
              </Button>
            </div>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;