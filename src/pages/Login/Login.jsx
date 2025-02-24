import React, { useState } from "react";
import "./Login.css";
import assets from "../../assets/assets";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../config/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = (evt) => {
    evt.preventDefault();

    if (currentState === "Sign Up") {
      signUp(username.trim(), email.trim(), password.trim());
    } else {
      login(email.trim(), password.trim());
    }
  };

  // FIREBASE SIGN UP FUNCTION TO CREATE ND STORE USER

  const signUp = async (username, email, password) => {
    try {
      setLoading(true);
      // creating a user account using firebase

      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      // creating a document collection in firebase db to store user data

      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        username: username.toLowerCase(),
        email,
        name: "",
        profileImage: "",
        bio: "Hey there, I am using Talkify",
        lastSeen: Date.now(),
      });

      // creating a document to store user chats

      await setDoc(doc(db, "chats", user.uid), {
        chatsData: [],
      });
      setUsername("");
      setEmail("");
      setPassword("");
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.code.split("/")[1].toUpperCase().split("-").join(" "), {
        theme: "dark",
        autoClose: 1500,
      });
      setLoading(false);
    }
  };

  // FIREBASE LOGIN FUNCTION

  const login = async (email, password) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login Successfull", { theme: "dark", autoClose: 1500 });
      setEmail("");
      setPassword("");
      setLoading(false);
    } catch (error) {
      console.log(error.code);
      toast.error(error.code.split("/")[1].toUpperCase().split("-").join(" "), {
        theme: "dark",
        autoClose: 1500,
      });
      setLoading(false);
    }
  };

  //  FIREBASE RESET PASSWORD FUNCTION

  const resetPassword = async (email) => {
    if (!email) {
      toast.error("Please enter your email", {
        theme: "dark",
        autoClose: 1500,
      });
      return;
    }

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("email", "==", email));
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        await sendPasswordResetEmail(auth, email);
        toast.success("Password reset link has been sent to your email", {
          theme: "dark",
          autoClose: 1500,
        });
      } else {
        toast.error("Email doesn't exist", {
          theme: "dark",
          autoClose: 1500,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        theme: "dark",
        autoClose: 1500,
      });
    }
  };

  return (
    <div className="login">
      {/* TALKIFY LOGO HERE */}

      <div className="logo">
        <img src={assets.talkify_logo} alt="" className="" />
        <h1 className="text-white text-6xl font-medium">Talkify</h1>
      </div>

      {/* SIGNUP FORM HERE */}

      <form onSubmit={onSubmitHandler} className="login-form">
        <h2 className="text-2xl font-medium">{currentState}</h2>
        {currentState === "Sign Up" ? (
          <input
            type="text"
            placeholder="Username"
            className="form-input"
            required
            value={username}
            onChange={(evt) => setUsername(evt.target.value)}
          />
        ) : null}
        <input
          value={email}
          onChange={(evt) => setEmail(evt.target.value)}
          type="email"
          placeholder="Email Address"
          className="form-input"
        />
        <input
          value={password}
          onChange={(evt) => setPassword(evt.target.value)}
          type="password"
          placeholder="Password"
          className="form-input"
        />
        {loading ? (
          <button type="submit" className="submit-btn">
            <PulseLoader size={10} color="#ffffff" />
          </button>
        ) : (
          <button type="submit" className="submit-btn">
            {currentState === "Sign Up" ? "Create Account" : "Login"}
          </button>
        )}
        <div className="term-and-cond flex gap-1">
          <input type="checkbox" className="w-3.5" />
          <p className="text-gray-600 text-sm">
            Agree to the terms of use & privacy policy.
          </p>
        </div>
        <div className="forgot">
          {currentState === "Sign Up" ? (
            <p className="login-toggle text-gray-800 text-[14px]">
              Already have an account?
              <span
                onClick={() => setCurrentState("Login")}
                className="cursor-pointer text-blue-700/90 font-medium"
              >
                Login here
              </span>
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="login-toggle text-gray-800 text-[14px]">
                Don't have an account?
                <span
                  onClick={() => setCurrentState("Sign Up")}
                  className="cursor-pointer text-blue-700/90 font-medium"
                >
                  Register here
                </span>
              </p>
              <p className="login-toggle text-gray-800 text-[14px]">
                Forgot Password?
                <span
                  onClick={() => resetPassword(email)}
                  className="cursor-pointer text-blue-700/90 font-medium"
                >
                  Click here
                </span>
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
