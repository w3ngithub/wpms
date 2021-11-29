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
import {
  getUserFromEmail,
  setUser,
  setUserFormSocialSignUp,
} from "../../api-config/login";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import { firebase } from "../../firebase/config";
import GitHubIcon from "@material-ui/icons/GitHub";
import { FcGoogle } from "@react-icons/all-files/fc/FcGoogle";
import SocialButton from "../SocialButton";

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

    ["firstname", "lastname", "username", "email", "password"].forEach(
      (property) => {
        if (!inputDetails[property]?.value || inputDetails.value === "") {
          newInputs = { ...newInputs, [property]: { error: "Required" } };
          isEmpty = true;
        }
      }
    );

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

    if (inputDetails["password"].value.length < 7) {
      setInputDetails({
        ...inputDetails,
        password: {
          ...inputDetails["password"],
          error: "password must be atleast 8 digits",
        },
      });
      return;
    }
    setUser(inputDetails).then(() => {
      setInputDetails({});
      history.push("/login");
    });
  };
  const AfterSocialLogIn = async (res, socialPlatform) => {
    const {
      user: { email, displayName },
      additionalUserInfo: { username },
    } = res;
    const user = await getUserFromEmail(email);
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

  const { username, email, password, lastname, firstname } = inputDetails;
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <Grid item xs={6}>
                <TextField
                  autoComplete="fname"
                  name="firstname"
                  autoFocus
                  required
                  fullWidth
                  label="First name"
                  error={Boolean(firstname?.error)}
                  value={firstname?.value ?? ""}
                  helperText={firstname?.error}
                  onChange={onInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  autoComplete="lname"
                  name="lastname"
                  required
                  fullWidth
                  label="Last name"
                  error={Boolean(lastname?.error)}
                  value={lastname?.value ?? ""}
                  helperText={lastname?.error}
                  onChange={onInputChange}
                />
              </Grid>
            </div>
            <Grid item xs={12}>
              <TextField
                autoComplete="fname"
                name="username"
                required
                fullWidth
                label="Username"
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
                helperText="Minimum length is 8 characters."
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
              text="Sign Up with Github"
              onClick={handleLogInwithGithub}
            />
            <SocialButton
              Icon={<FcGoogle style={{ fontSize: "24px" }} />}
              text="Sign Up with Google"
              onClick={handleLogInwithGoogle}
            />
          </div>
        </Box>
        <br />
        <Grid container>
          <Grid item>
            Already have an account ?{" "}
            <NavLink to="/login" style={{ color: "#1f80d4" }}>
              {"Sign In"}
            </NavLink>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
