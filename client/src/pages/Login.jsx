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

  const toggleLogin = () => {
    setIsLogin((prev) => !prev);
    setOtpSent(false);
    setIsVerified(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setOtp("");
    setPasswordStrength(0);
  };

  const handleSendOtp = () => {
    if (email) {
      setOtpSent(true);
      console.log("OTP sent to", email);
    }
  };

  const handleVerifyOtp = () => {
    if (otp.length === 6) {
      setIsVerified(true);
      console.log("OTP Verified");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin || (password && password === confirmPassword && passwordStrength >= 2)) {
      console.log("Form submitted", { email, password });
    } else {
      console.log("Password too weak or mismatch");
    }
  };

  const checkPasswordStrength = (value) => {
    let strength = 0;
    if (value.length > 0) strength++; 
    if (value.length >= 8) strength++; 
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) strength++; 
    if (/[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value)) strength++; 
    setPasswordStrength(strength);
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
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
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
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    variant="outlined"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSendOtp}
                    disabled={!email}
                  >
                    Send OTP
                  </Button>
                </>
              ) : !isVerified ? (
                <>
                  <TextField
                    fullWidth
                    label="Enter OTP"
                    variant="outlined"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    InputProps={{ style: { appearance: "textfield" } }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleVerifyOtp}
                    disabled={otp.length !== 6}
                  >
                    Verify OTP
                  </Button>
                </>
              ) : (
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
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
                    }}
                  />
                  <Typography variant="caption" className="text-center">
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
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    variant="outlined"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    disabled={!password || password !== confirmPassword || passwordStrength < 2}
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