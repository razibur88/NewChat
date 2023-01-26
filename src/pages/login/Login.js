import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { RxEyeOpen, RxEyeClosed } from "react-icons/rx";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLoginInfo } from "../../slices/Userslice";

const Login = () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const [useremail, setUseremail] = useState("");
  const [userpass, setUsepass] = useState("");
  const [success, setSuccess] = useState("");

  const [emailerr, setEmailerr] = useState("");
  const [passerr, setPasserr] = useState("");
  const [passShow, setPassShow] = useState(false);
  let handleemail = (e) => {
    setUseremail(e.target.value);
    setEmailerr("");
  };
  let handlepass = (e) => {
    setUsepass(e.target.value);
    setPasserr("");
  };
  let handleSubmit = () => {
    if (!useremail) {
      setEmailerr("Email field Is Requried");
    }
    if (!userpass) {
      setPasserr("Password field Is Requried");
    }
    signInWithEmailAndPassword(auth, useremail, userpass)
      .then((user) => {
        toast.success("Successfully Login");
        dispatch(userLoginInfo(user.user));
        localStorage.setItem("userInfo", JSON.stringify(user));
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((error) => {
        if (error.code.includes("auth/user-not-found")) {
        } else {
          setEmailerr("Valid Email is required");
        }
        if (error.code.includes("auth/wrong-password")) {
        } else {
          setPasserr("Valid password is required");
        }
      });
  };
  let handleShow = () => {
    setPassShow(!passShow);
  };

  let handleGoogle = () => {
    signInWithPopup(auth, provider).then(() => {
      navigate("/");
    });
  };

  return (
    <div>
      <div className="flex items-center">
        <div className="w-2/4 flex justify-end pr-16">
          <ToastContainer theme="dark" />
          <div>
            <h2 className="font-nunito font-bold pb-3 text-4xl text-heading">
              Login to your account!
            </h2>
            <img src="images/Google.png" onClick={handleGoogle} />
            <p className="font-nunito font-regular pt-3 text-[20px] text-heading">
              Free register and you can enjoy it
            </p>
            {success ? (
              <p className="bg-[green] w-96 text-[#fff] py-1 mt-1">{success}</p>
            ) : (
              ""
            )}
            <div className="mb-3 mt-5">
              <input
                placeholder="Email Address"
                type="email"
                onChange={handleemail}
                value={useremail}
                className="border border-secondary w-96 py-5 px-4 rounded-xl"
              />
              {emailerr ? (
                <p className="bg-[red] w-96 text-[#fff] py-1 mt-1">
                  {emailerr}
                </p>
              ) : (
                ""
              )}
            </div>

            <div className="mb-3 relative">
              <input
                type={passShow ? "text" : "password"}
                onChange={handlepass}
                placeholder="password"
                value={userpass}
                className="border border-secondary w-96 py-5 px-4 rounded-xl"
              />
              {passShow ? (
                <RxEyeOpen
                  onClick={handleShow}
                  className="absolute top-[27px] right-[20px]"
                />
              ) : (
                <RxEyeClosed
                  onClick={handleShow}
                  className="absolute top-[27px] right-[20px]"
                />
              )}

              {passerr ? (
                <p className="bg-[red] w-96 text-[#fff] py-1 mt-1">{passerr}</p>
              ) : (
                ""
              )}
            </div>
            <div>
              <button
                type="submit"
                onClick={handleSubmit}
                className="bg-bg w-96 py-5 rounded-[50px] text-[#fff]"
              >
                Login to Continue
              </button>
            </div>
            <div>
              <p className="text-center w-96 pt-5 font-nunito font-regular text-[16px] text-heading">
                Don’t have an account ?
                <span className="text-[#EA6C00] font-nunito font-bold pl-1">
                  <Link to="/register">Sign Up</Link>
                </span>
              </p>
              <p className="text-center w-96 pt-5 font-nunito font-regular text-[16px] text-heading">
                <Link to="/forgot">Forgot Password</Link>
              </p>
            </div>
          </div>
        </div>
        <div className="w-2/4">
          <img
            className="w-full h-screen object-cover"
            src="images/login.png"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
