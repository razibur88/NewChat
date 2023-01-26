import React, { useEffect, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { GrGallery } from "react-icons/gr";
import { BsFillEmojiSmileFill } from "react-icons/bs";
import ModalImage from "react-modal-image";
import { useSelector } from "react-redux";
import moment from "moment";
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import {
  getStorage,
  ref as sref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { AudioRecorder } from "react-audio-voice-recorder";
import EmojiPicker from "emoji-picker-react";

const Chart = () => {
  let [msg, setMsg] = useState("");
  let [msglist, setMsglist] = useState([]);
  let [audioUrl, setAudioUrl] = useState("");
  let [blob, setBlob] = useState("");
  let [emojishow, setEmojishow] = useState(false);
  const db = getDatabase();
  const storage = getStorage();
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  let activechatname = useSelector((state) => state.activeChat);

  let setMsgMain = (e) => {
    setMsg(e.target.value);
  };

  let handleMsgSend = () => {
    if (activechatname.active.status == "single") {
      set(push(ref(db, "singlemsg/")), {
        whosenderid: data.uid,
        whoserndername: data.displayName,
        whoreceiverid: activechatname.active.id,
        whoreceivername: activechatname.active.name,
        msg: msg,
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }- ${new Date().getDate()} ${new Date().getHours()}: ${new Date().getMinutes()} `,
      }).then(() => {
        setMsg("");
        setEmojishow(false);
      });
    } else {
      console.log("ami group");
    }
  };

  useEffect(() => {
    const chatRef = ref(db, "singlemsg/");
    onValue(chatRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          (item.val().whosenderid == data.uid &&
            item.val().whoreceiverid == activechatname.active.id) ||
          (item.val().whoreceiverid == data.uid &&
            item.val().whosenderid == activechatname.active.id)
        ) {
          arr.push(item.val());
        }
      });
      setMsglist(arr);
    });
  }, [activechatname.active.id]);

  let handleMsgImage = (e) => {
    const storage = getStorage();
    const storageRef = sref(storage, e.target.files[0].name);

    const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.log("ami uploaded");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          set(push(ref(db, "singlemsg/")), {
            whosenderid: data.uid,
            whoserndername: data.displayName,
            whoreceiverid: activechatname.active.id,
            whoreceivername: activechatname.active.name,
            img: downloadURL,
            date: `${new Date().getFullYear()}-${
              new Date().getMonth() + 1
            }- ${new Date().getDate()} ${new Date().getHours()}: ${new Date().getMinutes()} `,
          });
        });
      }
    );
  };

  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    setBlob(blob);
  };

  let handleAudioUpload = () => {
    const audioRef = sref(storage, audioUrl);
    // 'file' comes from the Blob or File API
    uploadBytes(audioRef, blob).then((snapshot) => {
      getDownloadURL(audioRef).then((downloadURL) => {
        set(push(ref(db, "singlemsg/")), {
          whosenderid: data.uid,
          whoserndername: data.displayName,
          whoreceiverid: activechatname.active.id,
          whoreceivername: activechatname.active.name,
          audio: downloadURL,
          date: `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }- ${new Date().getDate()} ${new Date().getHours()}: ${new Date().getMinutes()} `,
        }).then(() => {
          setAudioUrl("");
        });
      });
    });
  };

  let handleEmoji = (emoji) => {
    setMsg(msg + emoji.emoji);
  };

  return (
    <div>
      <div className="flex items-center shadow-lg mt-5 pb-2 mx-6 relative">
        <BiDotsVerticalRounded className="absolute top-[35px] right-[26px]" />
        <div className="relative after:content-[''] after:absolute after:h-[12px] after:w-[12px] after:bottom-[6px] after:right-[12px] after:bg-[#00FF75] after:rounded-full">
          <img src="images/user.png" />
        </div>
        <div className="ml-4">
          <h2 className="font-nunito font-bold text-2xl md:text-2xl text-heading">
            {activechatname.active.name}
          </h2>
          <p className="font-nunito font-regular text-[16px] text-heading">
            Online
          </p>
        </div>
      </div>

      <div className="mx-6 mt-3 overflow-y-scroll h-[570px] shadow-lg pb-2">
        {activechatname.active.status == "single" ? (
          msglist.map((item) =>
            item.whosenderid == data.uid ? (
              item.msg ? (
                <div className="text-right">
                  <div className="inline-block m-2">
                    <h3 className="font-nunito font-regular rounded bg-[#5F35F5] text-[16px] text-[#fff]  p-3 text-left">
                      {item.msg}
                    </h3>
                    <p className="font-nunito font-regular text-[16px] text-[rgba(0,0,0,0.5)] pl-3">
                      {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                    </p>
                  </div>
                </div>
              ) : item.img ? (
                <div className="text-right">
                  <div className="inline-block m-2">
                    <ModalImage
                      className="w-[150px]"
                      small={item.img}
                      large={item.img}
                    />
                    <p className="font-nunito font-regular text-[16px] text-[rgba(0,0,0,0.5)] pl-3">
                      {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-right">
                  <div className="inline-block m-2">
                    <audio controls src={item.audio}></audio>
                    <p className="font-nunito font-regular text-[16px] text-[rgba(0,0,0,0.5)] pl-3">
                      {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                    </p>
                  </div>
                </div>
              )
            ) : item.msg ? (
              <div>
                <div className="inline-block m-2">
                  <h3 className="font-nunito font-regular text-[16px] text-heading bg-[#f1f1f1] p-3">
                    {item.msg}
                  </h3>
                  <p className="font-nunito font-regular text-[16px] text-[rgba(0,0,0,0.5)] pl-3">
                    {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                  </p>
                </div>
              </div>
            ) : item.img ? (
              <div className="inline-block m-2">
                <ModalImage
                  className="w-[150px]"
                  small={item.img}
                  large={item.img}
                />
                <p className="font-nunito font-regular text-[16px] text-[rgba(0,0,0,0.5)] pl-3">
                  {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                </p>
              </div>
            ) : (
              <div>
                <div className="inline-block m-2">
                  <audio controls src={item.audio}></audio>
                  <p className="font-nunito font-regular text-[16px] text-[rgba(0,0,0,0.5)] pl-3">
                    {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                  </p>
                </div>
              </div>
            )
          )
        ) : (
          <h2>group id</h2>
        )}

        {/* recieved start */}
        {/* <div>
          <div className="inline-block m-2">
            <h3 className="font-nunito font-regular text-[16px] text-heading bg-[#f1f1f1] p-3">
              In publishing In publishing In publishing
            </h3>
            <p className="font-nunito font-regular text-[16px] text-[rgba(0,0,0,0.5)] pl-3">
              Today, 2:01pm
            </p>
          </div>
        </div> */}
        {/* recieved end */}
        {/* send start */}
        {/* <div className="text-right">
          <div className="inline-block m-2">
            <h3 className="font-nunito font-regular rounded bg-[#5F35F5] text-[16px] text-[#fff]  p-3 text-left">
              In publishing In publishing
            </h3>
            <p className="font-nunito font-regular text-[16px] text-[rgba(0,0,0,0.5)] pl-3">
              Today, 2:01pm
            </p>
          </div>
        </div> */}
        {/* send end */}
        {/* image start */}
        {/* <div className="text-right">
          <div className="inline-block m-2">
            <ModalImage
              className="w-[150px]"
              small={"images/register.png"}
              large={"images/register.png"}
            />
            <p className="font-nunito font-regular text-[16px] text-[rgba(0,0,0,0.5)] pl-3">
              Today, 2:01pm
            </p>
          </div>
        </div> */}
        {/* image end */}

        {/* audio start */}
        {/* <div className="text-right">
          <div className="inline-block m-2">
            <audio controls></audio>
            <p className="font-nunito font-regular text-[16px] text-[rgba(0,0,0,0.5)] pl-3">
              Today, 2:01pm
            </p>
          </div>
        </div> */}
        {/* audio end */}

        {/* video start*/}
        {/* <video width="320" height="240" controls></video> */}
        {/* video end*/}
      </div>

      <div className="pl-6 mt-8 flex relative">
        <AudioRecorder onRecordingComplete={(blob) => addAudioElement(blob)} />
        {emojishow && (
          <div className="absolute top-[-450px] left-0">
            <EmojiPicker onEmojiClick={(emoji) => handleEmoji(emoji)} />
          </div>
        )}

        <input
          onChange={setMsgMain}
          className="w-[85%] border-2 py-3 px-3"
          value={msg}
        />

        <label>
          <input type="file" className="hidden" onChange={handleMsgImage} />
          <GrGallery className="absolute top-[15px] right-[160px]" />
        </label>
        <div
          className="bg-[green] h-[48px] w-[100px] text-center"
          onClick={handleMsgSend}
          value={msg}
        >
          <button className="leading-[48px] font-nunito font-regular text-[16px] text-[#fff] ">
            send
          </button>
        </div>
        <div
          onClick={() => setEmojishow(!emojishow)}
          className="absolute top-[15px] right-[205px]"
        >
          <BsFillEmojiSmileFill />
        </div>
        {audioUrl && (
          <div className="flex gap-2 absolute top-0 left-[20px]">
            <audio controls src={audioUrl}></audio>
            <button
              onClick={() => setAudioUrl("")}
              className="leading-[48px] bg-[red] px-3 font-nunito font-regular text-[16px] "
            >
              Delete
            </button>
            <button
              onClick={handleAudioUpload}
              className="leading-[48px] bg-[green] px-3 font-nunito font-regular text-[16px] "
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chart;
