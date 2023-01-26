import React, { useState } from "react";
import { RxEyeOpen, RxEyeClosed } from "react-icons/rx";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";
const Register = () => {
  const auth = getAuth();
  const db = getDatabase();
  let navigate = useNavigate();
  const [useremail, setUseremail] = useState("");
  const [userfullname, setUsefullname] = useState("");
  const [userpass, setUsepass] = useState("");
  const [success, setSuccess] = useState("");

  const [emailerr, setEmailerr] = useState("");
  const [lastnameerr, setLastnameerr] = useState("");
  const [passerr, setPasserr] = useState("");
  const [passShow, setPassShow] = useState(false);

  let handleemail = (e) => {
    setUseremail(e.target.value);
    setEmailerr("");
  };
  let handlefullname = (e) => {
    setUsefullname(e.target.value);
    setLastnameerr("");
  };
  let handlepass = (e) => {
    setUsepass(e.target.value);
    setPasserr("");
  };
  let handleSubmit = () => {
    if (!useremail) {
      setEmailerr("Email field Is Requried");
    }
    if (!userfullname) {
      setLastnameerr("LastName field Is Requried");
    }
    if (!userpass) {
      setPasserr("Password field Is Requried");
    }

    createUserWithEmailAndPassword(auth, useremail, userpass)
      .then((user) => {
        updateProfile(auth.currentUser, {
          displayName: userfullname,
          photoURL: "images/userprofile.png",
        })
          .then(() => {
            toast.success("Successfully Submitted veryfied Your Email");
            sendEmailVerification(auth.currentUser);
            setUseremail("");
            setUsefullname("");
            setUsepass("");
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          })
          .then(() => {
            set(ref(db, "users/" + user.user.uid), {
              username: user.user.displayName,
              email: user.user.email,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        if (error.code.includes("auth/email-already-in-use")) {
          setEmailerr("Already Email Exists");
        }
      });
  };

  let handleShow = () => {
    setPassShow(!passShow);
  };

  return (
    <div className="md:flex items-center">
      <div className=" w-full md:w-2/4 md:flex justify-end pt-[100px] md:pt-0 md:pr-16">
        <ToastContainer theme="dark" />
        <div>
          <h2 className="font-nunito font-bold text-2xl md:text-4xl text-heading">
            Get started with easily register
          </h2>
          <p className="font-nunito font-regular text-[20px] text-heading">
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
              className="border border-secondary w-full md:w-96 py-5 px-4 rounded-xl"
            />
            {emailerr ? (
              <p className="bg-[red] w-96 text-[#fff] py-1 mt-1">{emailerr}</p>
            ) : (
              ""
            )}
          </div>
          <div className="mb-3">
            <input
              type="text"
              onChange={handlefullname}
              value={userfullname}
              placeholder="Full Name"
              className="border border-secondary w-full md:w-96 py-5 px-4 rounded-xl"
            />
            {lastnameerr ? (
              <p className="bg-[red] w-96 text-[#fff] py-1 mt-1">
                {lastnameerr}
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
              className="border border-secondary w-full md:w-96 py-5 px-4 rounded-xl"
            />
            {passShow ? (
              <RxEyeOpen
                onClick={handleShow}
                className="absolute top-[27px] right-[20px] md:right-[150px]"
              />
            ) : (
              <RxEyeClosed
                onClick={handleShow}
                className="absolute top-[27px] right-[20px] md:right-[150px]"
              />
            )}

            {passerr ? (
              <p className="bg-[red] w-full md:w-96 text-[#fff] py-1 mt-1">
                {passerr}
              </p>
            ) : (
              ""
            )}
          </div>
          <div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-bg w-full md:w-96 py-5 rounded-[50px] text-[#fff]"
            >
              Submit
            </button>
          </div>
          <div>
            <p className="text-center w-full md:w-96 pt-5 font-nunito font-regular text-[16px] text-heading">
              Already have an account ?
              <span className="text-[#EA6C00] font-nunito font-bold pl-1">
                <Link to="/login">Sign In</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="w-2/4 hidden md:block">
        <img
          className="w-full h-screen object-cover"
          src="images/register.png"
        />
      </div>
    </div>
  );
};

export default Register;
