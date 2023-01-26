import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Forgot = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [useremail, setUseremail] = useState();
  let handleForgot = () => {
    sendPasswordResetEmail(auth, useremail)
      .then(() => {
        toast.success("Check Your Email");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  return (
    <div className="bg-heading w-full h-screen">
      <ToastContainer theme="dark" />
      <div className="flex justify-center items-center h-full">
        <div className="w-96 bg-white py-5 text-center">
          <h2 className="font-nunito font-bold pb-5 text-4xl text-heading">
            Forgot Password
          </h2>
          <input
            placeholder="Email"
            onChange={(e) => setUseremail(e.target.value)}
            className="border border-secondary w-80 py-5 px-4 rounded-xl"
          />
          <div className="mt-5">
            <button
              type="submit"
              onClick={handleForgot}
              className="bg-bg w-40 py-5 rounded-[50px] text-[#fff]"
            >
              Update
            </button>
            <Link to="/login">
              <button
                type="submit"
                className="bg-bg w-40 py-5 rounded-[50px] text-[#fff]"
              >
                Back To Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
