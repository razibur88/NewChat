import React, { useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { MdCloudUpload } from "react-icons/md";
import { BsFillChatDotsFill } from "react-icons/bs";
import { AiFillNotification } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLoginInfo } from "../slices/Userslice";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
const Slidebar = ({ active }) => {
  const [imageUpload, setImageUpload] = useState(false);
  const [image, setImage] = useState("");
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();
  const auth = getAuth();
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  const storage = getStorage();
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let handleLogout = () => {
    signOut(auth).then(() => {
      dispatch(userLoginInfo(null));
      localStorage.removeItem("userInfo");
      navigate("/login");
    });
  };

  let handleUploadImg = () => {
    setImageUpload(true);
  };

  let handleImageCancel = () => {
    setImageUpload(false);
    setCropData("");
    setCropper("");
    setImage("");
  };

  const handleuploadcrop = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      const storageRef = ref(storage, auth.currentUser.uid);
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).then(() => {
            setImageUpload(false);
            setCropData("");
            setCropper("");
            setImage("");
          });
        });
      });
    }
  };

  return (
    <>
      {imageUpload && (
        <div className=" bg-[#5F35F5] h-screen w-full absolute top-0 left-0 z-50 flex justify-center items-center">
          <div className="bg-white w-2/4 rounded-lg p-6">
            <h2 className="font-nunito font-bold text-2xl md:text-4xl text-heading">
              Upload Your Image
            </h2>
            {image ? (
              <div className="img-preview w-[150px] h-[150px] rounded-full mx-auto overflow-hidden"></div>
            ) : (
              <div className="w-[150px] h-[150px] rounded-full mx-auto overflow-hidden">
                <img
                  className="w-[150px] h-[150px] rounded-full"
                  src={data.photoURL}
                />
              </div>
            )}
            {image && (
              <Cropper
                style={{ height: 400, width: "100%" }}
                zoomTo={0.5}
                initialAspectRatio={1}
                preview=".img-preview"
                src={image}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                onInitialized={(instance) => {
                  setCropper(instance);
                }}
                guides={true}
              />
            )}

            <input type="file" className="mt-4" onChange={handleuploadcrop} />
            <br />
            <button
              onClick={getCropData}
              type="submit"
              className="bg-bg py-5 px-10 text-[#fff] rounded-lg mt-4"
            >
              Submit
            </button>
            <button
              type="submit"
              onClick={handleImageCancel}
              className="bg-red-600 py-5 px-10 ml-4 text-[#fff] rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className=" bg-[#5F35F5] h-screen rounded-tr-2xl rounded-tl-2xl text-center overflow-hidden">
        <div className="w-[100px] h-[100px] rounded-full m-auto mt-5 relative group">
          <img src={data.photoURL} className="w-full h-full rounded-full" />
          <h2 className="font-nunito font-bold text-white ">
            {data.displayName}
          </h2>
          <div className="absolute top-0 left-0 bg-[rgba(0,0,0,0.5)] h-full w-full rounded-full flex justify-center items-center text-white text-2xl opacity-0 group-hover:opacity-100">
            <MdCloudUpload onClick={handleUploadImg} />
          </div>
        </div>
        <div className="mt-[100px]">
          <div
            className={
              active == "home" ? "py-5 px-5 bg-white" : "py-5 px-5 text-white"
            }
          >
            <Link to="/">
              <AiFillHome className="inline-block" />
            </Link>
          </div>
          <div
            className={
              active == "msg" ? "py-5 px-5 bg-white" : "py-5 px-5 text-white"
            }
          >
            <Link to="/message">
              <BsFillChatDotsFill className="inline-block" />
            </Link>
          </div>
          <div className="py-5 px-5 mt-5 text-[#fff]">
            <AiFillNotification className="inline-block" />
          </div>
          <div onClick={handleLogout} className="py-5 px-5 mt-5 text-white">
            <FiLogOut className="inline-block cursor-pointer" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Slidebar;
