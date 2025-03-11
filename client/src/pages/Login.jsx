import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Edit as EditIcon,
} from "@mui/icons-material";
import SpaceBackground from '../components/Stars';

const MoonFace = ({ showPassword, isOtp, otp, inputFocused }) => {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 100); // Short blink
    }, Math.random() * 10000 + 8000); // Randomized blink timing

    return () => clearInterval(blinkInterval);
  }, []);

  // Calculate eye position based on OTP input
  const getEyePosition = () => {
    if (isOtp) {
      if (otp.length === 0) {
        return { x: "50%", y: "50%" }; // Look down at input field
      }
      if (otp.length === 6) {
        return { x: "50%", y: "50%" }; // Look straight when OTP complete
      }

      // Eye movement based on OTP digits
      const lastNum = otp[otp.length - 1];  
      const positions = {
        1: { x: "20%", y: "80%" },
        2: { x: "30%", y: "80%" },
        3: { x: "40%", y: "80%" },
        4: { x: "50%", y: "80%" },
        5: { x: "60%", y: "80%" },
        6: { x: "70%", y: "50%" }, // Moves up
        7: { x: "30%", y: "80%" },
        8: { x: "50%", y: "80%" },
        9: { x: "70%", y: "80%" },
        0: { x: "50%", y: "90%" },
      };
      
      return positions[lastNum] || { x: "50%", y: "70%" };
    } else {
      return inputFocused ? { x: "50%", y: "70%" } : { x: "50%", y: "50%" };
    }
  };

  // Dynamic Smile: Changes as OTP is entered
  const getSmileStyle = () => {
    if (!isOtp && showPassword) {
      // Happy smile when password is visible
      return {
        height: "24px"  // Bigger smile for password visibility
      };
    }
    // Original OTP-based smile logic
    const smileLevels = ["5px", "8px", "12px", "16px", "20px", "24px", "30px"];
    return {
      height: smileLevels[Math.min(otp.length, smileLevels.length - 1)],
    };
  };

  return (
    <div className="w-[150px] h-[150px] mx-auto mb-6 relative">
      <div className="moon-face w-full h-full relative">
        {/* Large Craters */}
        

        {/* Eyes */}
        <div className="absolute w-full h-full z-10">
          {["left", "right"].map((side) => (
            <div
              key={side}
              className="moon-eye absolute top-[35%]"
              style={{
                left: side === "left" ? "20%" : "60%",
                height: isBlinking ? "1px" : "32px",
                transform: `translateX(-50%) ${
                  isBlinking ? "scaleY(0.1)" : "scaleY(1)"
                }`,
              }}
            >
              <div
                className="pupil absolute"
                style={{
                  top: getEyePosition().y,
                  left: getEyePosition().x,
                  transform: "translate(-50%, -50%)",
                  opacity: !isOtp && !showPassword ? 0 : 1,
                }}
              />
            </div>
          ))}
        </div>

        {/* Dynamic Smile */}
        <div
          className="absolute w-[40px] border-b-[3px] border-[#1c1c1c] rounded-b-[20px] bottom-[20%] left-1/2 transform -translate-x-1/2 opacity-70 z-10"
          style={getSmileStyle()}
        />
      </div>
    </div>
  );
};


const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91"); // Default to India
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [countries, setCountries] = useState([]); // Dynamic country list (flag URL and code)
  const [loading, setLoading] = useState(true); // Loading state for API fetch
  const [searchQuery, setSearchQuery] = useState("");
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginOtpVerified, setLoginOtpVerified] = useState(false);

  // Add this function at the top with other functions
  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, "");

    // Add spaces every 4 digits
    return numbers.replace(/(\d{4})/g, "$1 ").trim();
  };

  const countrySelectProps = {
    value: countryCode,
    onChange: (e) => setCountryCode(e.target.value),
    renderValue: (selected) => {
      const country = countries.find((c) => c.code === selected);
      return country ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={country.flag}
              alt={country.name}
              style={{
                width: 28,
                height: 20,
                marginRight: 8,
                objectFit: "contain",
              }}
            />
            {country.name}
          </div>
          <span style={{ marginLeft: 8, color: "gray" }}>{country.code}</span>
        </div>
      ) : (
        selected
      );
    },
    onOpen: () => setSearchQuery(""),
    MenuProps: {
      PaperProps: {
        style: {
          maxHeight: 400,
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        },
        sx: {
          backgroundColor: "background.paper",
          "& .MuiList-root": {
            padding: 0,
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          },
        },
      },
    },
  };

  // Fetch countries dynamically from restcountries API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const countryList = data
          .map((country) => {
            // More accurate way to get country calling code
            const dialCode =
              country.idd?.root + (country.idd?.suffixes?.[0] || "");

            // Using higher resolution flags (32x24 instead of 16x12)
            // Using CDN that provides better quality flags
            const flag = `https://flagcdn.com/32x24/${country.cca2.toLowerCase()}.png`;

            // Only include countries with valid dial codes
            if (!dialCode || dialCode === "undefined") return null;

            return {
              code: dialCode,
              flag,
              name: country.name.common,
              // Add ISO code for better identification
              iso2: country.cca2.toLowerCase(),
            };
          })
          .filter(Boolean) // Remove null entries
          .filter((country) => country.code && country.name) // Ensure code and name exist
          .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name

        setCountries(countryList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const toggleLogin = () => {
    setIsLogin((prev) => !prev);
    // Reset all states to show first page
    setLoginOtpSent(false);
    setLoginOtpVerified(false);
    setOtpSent(false);
    setIsVerified(false);
    resetForm();
  };

  const resetForm = () => {
    setOtpSent(false);
    setIsVerified(false);
    setPhoneNumber("");
    setCountryCode("+91"); // Reset to India
    setPassword("");
    setConfirmPassword("");
    setOtp("");
    setPasswordStrength(0);
    setPhoneError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setOtpError("");
  };

  const validatePhone = (value) => {
    const phoneRegex = /^[0-9]{8,15}$/;
    if (!value) {
      setPhoneError("Phone number is required");
    } else if (!phoneRegex.test(value)) {
      setPhoneError("Invalid phone number (8-15 digits)");
    } else {
      setPhoneError("");
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
    if (phoneNumber && !phoneError) {
      setOtpSent(true);
      console.log("OTP sent to", `${countryCode}${phoneNumber}`);
    }
  };

  const handleVerifyOtp = () => {
    if (otp.length === 6 && !otpError) {
      setIsVerified(true);
      console.log("OTP Verified");
    }
  };

  const handleLoginSendOtp = () => {
    if (phoneNumber && !phoneError) {
      setLoginOtpSent(true);
      console.log("Login OTP sent to", `${countryCode}${phoneNumber}`);
    }
  };

  const handleLoginVerifyOtp = () => {
    if (otp.length === 6 && !otpError) {
      setLoginOtpVerified(true);
      console.log("Login OTP Verified");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullPhone = `${countryCode}${phoneNumber}`;
    if (isLogin) {
      if (!phoneError && !passwordError) {
        console.log("Form submitted", { phone: fullPhone, password });
      } else {
        console.log("Validation errors present");
      }
    } else if (!phoneError && !passwordError && !confirmPasswordError) {
      console.log("Form submitted", { phone: fullPhone, password });
    } else {
      console.log("Validation errors present");
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return "transparent";
      case 1:
        return "red";
      case 2:
        return "orange";
      case 3:
        return "yellow";
      case 4:
        return "green";
      default:
        return "transparent";
    }
  };

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = () => {
    if (isLogin) {
      // For login flow
      setLoginOtpSent(false);
      setLoginOtpVerified(false);
      // Clear password for login flow
      setPassword("");
      setPasswordError("");
    } else {
      // For signup flow
      setOtpSent(false);
      setIsVerified(false);
      // Clear both passwords for signup flow
      setPassword("");
      setConfirmPassword("");
      setPasswordError("");
      setConfirmPasswordError("");
      setPasswordStrength(0);
    }
    // Clear OTP related fields
    setOtp("");
    setOtpError("");
  };

  return (
    <div className="h-screen flex justify-center items-center relative">
      <SpaceBackground />
      <Container component="main" maxWidth="xs">
        <Paper elevation={0} className="p-6 flex flex-col items-center">
          {/* Only show heading on first page */}
          {(isLogin && !loginOtpSent) || (!isLogin && !otpSent) ? (
            <>
              <Typography
                variant="h5"
                className="mb-0"
                sx={{ marginBottom: ".5rem !important", textAlign: "center" }}
              >
                {isLogin ? "Login" : "Sign Up"}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "gray",
                  fontSize: "0.875rem",
                  mb: 2,
                  textAlign: "center",
                }}
              >
                {isLogin
                  ? "Please confirm your country code and enter your phone number."
                  : "Sign up to get started. Enter your phone number to continue."}
              </Typography>
            </>
          ) : null}

          {loading ? (
            <Typography>Loading countries...</Typography>
          ) : (
            <>
              {isLogin ? (
                <form
                  onSubmit={handleSubmit}
                  className="w-full flex flex-col gap-4"
                >
                  {/* Only show country and phone fields when not in OTP or password pages */}
                  {!loginOtpSent && (
                    <>
                      <div className="flex gap-2">
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel>Country</InputLabel>
                          <Select
                            {...countrySelectProps}
                            readOnly={loginOtpSent}
                            sx={{
                              backgroundColor: loginOtpSent
                                ? "#f5f5f5"
                                : "transparent",
                              "& .MuiSelect-select": {
                                pointerEvents: loginOtpSent ? "none" : "auto",
                              },
                            }}
                          >
                            <MenuItem
                              style={{
                                position: "sticky",
                                top: 0,
                                background: "transparent",
                                zIndex: 1,
                                padding: "8px",
                              }}
                              disableRipple
                              onClick={(e) => e.preventDefault()}
                            >
                              <TextField
                                size="small"
                                autoFocus
                                placeholder="Search country..."
                                fullWidth
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                                sx={{
                                  "& .MuiInputBase-root": {
                                    backgroundColor: "transparent",
                                  },
                                }}
                              />
                            </MenuItem>
                            {filteredCountries.map((country) => (
                              <MenuItem key={country.iso2} value={country.code}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <img
                                      src={country.flag}
                                      alt={country.name}
                                      style={{
                                        width: 28,
                                        height: 20,
                                        marginRight: 8,
                                        objectFit: "contain",
                                      }}
                                    />
                                    {country.name}
                                  </div>
                                  <span style={{ color: "gray" }}>
                                    {country.code}
                                  </span>
                                </div>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                      <div className="flex-1">
                        <TextField
                          fullWidth
                          label="Phone Number"
                          type="tel"
                          variant="outlined"
                          value={phoneNumber}
                          onChange={(e) => {
                            if (loginOtpSent) return; // Prevent changes if OTP is sent
                            const rawValue = e.target.value.replace(/\D/g, "");
                            const formattedValue = formatPhoneNumber(rawValue);
                            setPhoneNumber(formattedValue);
                            validatePhone(rawValue);
                          }}
                          inputProps={{
                            maxLength: 20,
                            readOnly: loginOtpSent,
                          }}
                          InputProps={{
                            endAdornment: loginOtpSent ? (
                              <InputAdornment position="end">
                                <IconButton
                                  edge="end"
                                  onClick={handleEdit}
                                  sx={{ color: "primary.main" }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </InputAdornment>
                            ) : null,
                            sx: {
                              backgroundColor: loginOtpSent
                                ? "#f5f5f5"
                                : "transparent",
                            },
                          }}
                        />
                        {phoneError && (
                          <Typography
                            sx={{
                              color: "red",
                              fontSize: "0.75rem",
                              mt: 0.5,
                            }}
                          >
                            {phoneError}
                          </Typography>
                        )}
                      </div>
                    </>
                  )}

                  {!loginOtpSent ? (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleLoginSendOtp}
                        sx={{ borderRadius: "10px" }}
                        disabled={!!phoneError || !phoneNumber}
                      >
                        Send OTP
                      </Button>

                      <Button
                        fullWidth
                        color="secondary"
                        variant="text"
                        onClick={toggleLogin}
                        sx={{ textTransform: "none" }}
                      >
                        Sign Up Instead ?
                      </Button>
                    </>
                  ) : !loginOtpVerified ? (
                    <>
                      {/* Add phone number display and message */}
                      <div className="flex flex-col w-full mb-4">
                        <MoonFace isOtp={true} otp={otp} inputFocused={false} />
                        <div className="flex items-center justify-center">
                          <Typography
                            variant="body1"
                            sx={{
                              fontSize: "1rem",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <span>
                              {countryCode} {phoneNumber}
                            </span>
                            <IconButton
                              onClick={handleEdit}
                              sx={{ color: "primary.main", marginLeft: "4px" }}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                          </Typography>
                        </div>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "gray",
                            fontSize: "0.875rem",
                            mt: 1,
                            textAlign: "center",
                          }}
                        >
                          A verification code has been sent to your Zync app.
                          Please check to continue.
                        </Typography>
                      </div>

                      <div>
                        <TextField
                          fullWidth
                          label="Enter OTP"
                          variant="outlined"
                          value={otp}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setOtp(value);
                            validateOtp(value);
                          }}
                          inputProps={{ maxLength: 6 }}
                        />
                        {otpError && (
                          <Typography
                            sx={{
                              color: "red",
                              fontSize: "0.75rem",
                              mt: 0.5,
                            }}
                          >
                            {otpError}
                          </Typography>
                        )}
                      </div>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleLoginVerifyOtp}
                        sx={{ borderRadius: "10px" }}
                        disabled={!!otpError || otp.length !== 6}
                      >
                        Verify OTP
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col w-full mb-4">
                        <MoonFace
                          showPassword={showPassword}
                          isOtp={false}
                          inputFocused={false}
                          otp=""  // Add empty string as default
                        />
                        <div className="flex items-center justify-center">
                          <Typography
                            variant="body1"
                            sx={{
                              fontSize: "1rem",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <span>
                              {countryCode} {phoneNumber}
                            </span>
                            <IconButton
                              onClick={handleEdit}
                              sx={{ color: "primary.main", marginLeft: "4px" }}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                          </Typography>
                        </div>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "gray",
                            fontSize: "0.875rem",
                            mt: 1,
                            textAlign: "center",
                          }}
                        >
                          Your password is protected with advanced security.
                          Please enter your password to continue.
                        </Typography>
                      </div>

                      <div>
                        <TextField
                          fullWidth
                          label="Password"
                          variant="outlined"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            checkPasswordStrength(e.target.value);
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                  sx={{ color: "gray" }}
                                >
                                  {showPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
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
                        disabled={!!passwordError || !password}
                        sx={{ borderRadius: "10px" }}
                      >
                        Login
                      </Button>
                    </>
                  )}
                </form>
              ) : (
                <div className="w-full flex flex-col gap-4">
                  {!otpSent ? (
                    <>
                      <div className="flex gap-2">
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel>Country</InputLabel>
                          <Select
                            {...countrySelectProps}
                            readOnly={loginOtpSent}
                            sx={{
                              backgroundColor: loginOtpSent
                                ? "#f5f5f5"
                                : "transparent",
                              "& .MuiSelect-select": {
                                pointerEvents: loginOtpSent ? "none" : "auto",
                              },
                            }}
                          >
                            <MenuItem
                              style={{
                                position: "sticky",
                                top: 0,
                                background: "transparent",
                                zIndex: 1,
                                padding: "8px",
                              }}
                              disableRipple
                              onClick={(e) => e.preventDefault()}
                            >
                              <TextField
                                size="small"
                                autoFocus
                                placeholder="Search country..."
                                fullWidth
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                                sx={{
                                  "& .MuiInputBase-root": {
                                    backgroundColor: "transparent",
                                  },
                                }}
                              />
                            </MenuItem>
                            {filteredCountries.map((country) => (
                              <MenuItem key={country.iso2} value={country.code}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <img
                                      src={country.flag}
                                      alt={country.name}
                                      style={{
                                        width: 28,
                                        height: 20,
                                        marginRight: 8,
                                        objectFit: "contain",
                                      }}
                                    />
                                    {country.name}
                                  </div>
                                  <span style={{ color: "gray" }}>
                                    {country.code}
                                  </span>
                                </div>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                      <div className="flex-1">
                        <TextField
                          fullWidth
                          label="Phone Number"
                          type="tel"
                          variant="outlined"
                          value={phoneNumber}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/\D/g, "");
                            const formattedValue = formatPhoneNumber(rawValue);
                            setPhoneNumber(formattedValue);
                            validatePhone(rawValue); // Pass raw value for validation
                          }}
                          inputProps={{ maxLength: 15 }}
                        />
                        {phoneError && (
                          <Typography
                            sx={{
                              color: "red",
                              fontSize: "0.75rem",
                              mt: 0.5,
                            }}
                          >
                            {phoneError}
                          </Typography>
                        )}
                      </div>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSendOtp}
                        sx={{ borderRadius: "10px" }}
                        disabled={!!phoneError || !phoneNumber}
                      >
                        Send OTP
                      </Button>
                      <Button
                        fullWidth
                        color="secondary"
                        variant="text"
                        onClick={toggleLogin}
                        sx={{ textTransform: "none" }}
                      >
                        Login Instead ?
                      </Button>
                    </>
                  ) : !isVerified ? (
                    <>
                      <div className="flex flex-col w-full mb-4">
                        <MoonFace isOtp={true} otp={otp} inputFocused={false} />
                        <div className="flex items-center justify-center">
                          <Typography
                            variant="body1"
                            sx={{
                              fontSize: "1rem",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <span>
                              {countryCode} {phoneNumber}
                            </span>
                            <IconButton
                              onClick={handleEdit}
                              sx={{ color: "primary.main", marginLeft: "4px" }}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                          </Typography>
                        </div>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "gray",
                            fontSize: "0.875rem",
                            mt: 1,
                            textAlign: "center",
                          }}
                        >
                          A verification code has been sent to your Zync app.
                          Please check to continue.
                        </Typography>
                      </div>
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
                          inputProps={{ maxLength: 6 }}
                        />
                        {otpError && (
                          <Typography
                            sx={{ color: "red", fontSize: "0.75rem", mt: 0.5 }}
                          >
                            {otpError}
                          </Typography>
                        )}
                      </div>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleVerifyOtp}
                        sx={{ borderRadius: "10px" }}
                        disabled={!!otpError || otp.length !== 6}
                      >
                        Verify OTP
                      </Button>
                    </>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      className="w-full flex flex-col gap-4"
                    >
                      <div className="flex flex-col w-full mb-4">
                        <MoonFace
                          showPassword={showPassword}
                          isOtp={false}
                          inputFocused={false}
                          otp=""  // Add empty string as default
                        />
                        <div className="flex items-center justify-center">
                          <Typography
                            variant="body1"
                            sx={{
                              fontSize: "1rem",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <span>
                              {countryCode} {phoneNumber}
                            </span>
                            <IconButton
                              onClick={handleEdit}
                              sx={{ color: "primary.main", marginLeft: "4px" }}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                          </Typography>
                        </div>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "gray",
                            fontSize: "0.875rem",
                            mt: 1,
                            textAlign: "center",
                          }}
                        >
                          Your password is protected with advanced security.
                          Please create a strong password to continue.
                        </Typography>
                      </div>
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
                            if (confirmPassword)
                              validateConfirmPassword(confirmPassword);
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                  sx={{ color: "gray" }}
                                >
                                  {showPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
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
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: getStrengthColor(),
                            },
                            mt: 1,
                          }}
                        />
                        <Typography
                          variant="caption"
                          className="text-center"
                          sx={{ mt: 0.5 }}
                        >
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
                        {passwordError && (
                          <Typography
                            sx={{ color: "red", fontSize: "0.75rem", mt: 0.5 }}
                          >
                            {passwordError}
                          </Typography>
                        )}
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
                                <IconButton
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                  edge="end"
                                  sx={{ color: "gray" }}
                                >
                                  {showConfirmPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        {confirmPasswordError && (
                          <Typography
                            sx={{ color: "red", fontSize: "0.75rem", mt: 0.5 }}
                          >
                            {confirmPasswordError}
                          </Typography>
                        )}
                      </div>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                        disabled={
                          !!passwordError ||
                          !!confirmPasswordError ||
                          !password ||
                          !confirmPassword
                        }
                        sx={{ borderRadius: "10px" }}
                      >
                        Sign Up
                      </Button>
                    </form>
                  )}
                </div>
              )}
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
