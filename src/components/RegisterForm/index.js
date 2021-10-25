import * as React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import { Email } from "@material-ui/icons";
import { setUser } from "../../api-config/login";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: "24px 0",
  },
}));

export default function SignUp() {
  const history = useHistory();

  const classes = useStyles();
  const [inputDetails, setInputDetails] = React.useState({});

  const onInputChange = (e) =>
    setInputDetails({
      ...inputDetails,
      [e.target.name]: { value: e.target.value },
    });

  const handleSubmit = (event) => {
    event.preventDefault();

    let newInputs = {},
      isEmpty = false;

    ["username", "email", "password"].forEach((property) => {
      if (!inputDetails[property]?.value || inputDetails.value === "") {
        newInputs = { ...newInputs, [property]: { error: "Required" } };
        isEmpty = true;
      }
    });

    if (isEmpty) {
      setInputDetails(newInputs);
      return;
    }

    if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        inputDetails["email"].value
      )
    ) {
      setInputDetails({
        ...inputDetails,
        email: { ...inputDetails["email"], error: "Email invalid" },
      });
      return;
    }

    if (inputDetails["password"].value.length <= 8) {
      setInputDetails({
        ...inputDetails,
        password: {
          ...inputDetails["password"],
          error: "password must be greater than 8 digits",
        },
      });
      return;
    }
    setUser(inputDetails).then(() => {
      setInputDetails({});
      history.push("/login");
    });
  };
  const { username, email, password } = inputDetails;
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 64,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                autoComplete="fname"
                name="username"
                required
                fullWidth
                label="Username"
                autoFocus
                error={Boolean(username?.error)}
                value={username?.value ?? ""}
                helperText={username?.error}
                onChange={onInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                error={Boolean(email?.error)}
                value={email?.value ?? ""}
                helperText={email?.error}
                onChange={onInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                autoComplete="new-password"
                error={Boolean(password?.error)}
                value={password?.value ?? ""}
                helperText={password?.error}
                onChange={onInputChange}
              />
            </Grid>
          </Grid>
          <Button
            className={classes.submit}
            type="submit"
            fullWidth
            color="primary"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
        </Box>
        <Grid container>
          <Grid item>
            <Link to="/login">{"Sign In"}</Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
