import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { getUser, setUserFormSocialSignUp } from "../../api-config/login";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import GitHubIcon from "@material-ui/icons/GitHub";
import { FcGoogle } from "@react-icons/all-files/fc/FcGoogle";
import { firebase } from "../../firebase/config";
import SocialButton from "../SocialButton";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      Your Website
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const [loginDetails, setLoginDetails] = useState({});
  const history = useHistory();

  const onInputChange = (e) =>
    setLoginDetails({ ...loginDetails, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = loginDetails;

    const user = await getUser(email || "");

    if (user === null) {
      alert("No user found");
      return;
    }

    if (user.password !== password) {
      alert("Password incorrect");
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify({ name: user.username, email: user.email })
    );
    if (localStorage.getItem("invite")) {
      history.push(`${JSON.parse(localStorage.getItem("invite"))}`);
      localStorage.removeItem("invite");
    } else {
      history.push(`/${user.username}/boards`);
    }
  };

  const AfterSocialLogIn = async (res, socialPlatform) => {
    const {
      user: { email, displayName },
      additionalUserInfo: { username },
    } = res;
    const user = await getUser(email);
    if (user === null) {
      await setUserFormSocialSignUp({
        email: email,
        username: socialPlatform === "github" ? username : displayName,
      });
    }
    localStorage.setItem(
      "user",
      JSON.stringify({
        email: email,
        name: socialPlatform === "github" ? username : displayName,
      })
    );
    if (localStorage.getItem("invite")) {
      history.push(`${JSON.parse(localStorage.getItem("invite"))}`);
      localStorage.removeItem("invite");
    } else {
      history.push(
        `/${socialPlatform === "github" ? username : displayName}/boards`
      );
    }
  };

  const handleLogInwithGithub = () => {
    firebase
      .auth()
      .signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then(async (res) => {
        AfterSocialLogIn(res, "github");
      })
      .catch((err) => {
        console.log("error", err);
        alert(err.message);
      });
  };

  const handleLogInwithGoogle = () => {
    firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((res) => {
        AfterSocialLogIn(res, "google");
      })
      .catch((err) => {
        alert(err.message);

        console.log("error", err);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={loginDetails.email ?? ""}
            onChange={onInputChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={loginDetails.password ?? ""}
            onChange={onInputChange}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={onSubmit}
          >
            Sign In
          </Button>

          <div
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <h4>OR</h4>
            <SocialButton
              Icon={<GitHubIcon style={{ fontSize: "24px" }} />}
              text="Log in with Github"
              onClick={handleLogInwithGithub}
            />
            <SocialButton
              Icon={<FcGoogle style={{ fontSize: "24px" }} />}
              text="Log in with Google"
              onClick={handleLogInwithGoogle}
            />
          </div>
          <br />
          <Grid container>
            <Grid item>
              Create your account <Link to="/register">{"Sign Up"}</Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
