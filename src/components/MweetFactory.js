import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import Mweet from "./Mweet";
import { dbService, storageService } from "myBase";

const MweetFactory = ({ userObj }) => {
  const [mweet, setMweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attatchmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attatchmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const mweetObj = {
      text: mweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await dbService.collection("mweets").add(mweetObj);
    setMweet("");
    setAttachment("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setMweet(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const myFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(myFile);
  };
  const onClearAttatchment = () => setAttachment(null);
  return (
    <form onSubmit={onSubmit}>
      <input
        value={mweet}
        onChange={onChange}
        type="text"
        placeholder="What's on yout mind?"
        maxLength={120}
      />
      <input type="file" accept="image/*" onChange={onFileChange}></input>
      <input type="submit" value="mweet"></input>
      {attachment && (
        <div>
          <img src={attachment} width="50px" height="50px" />
          <button onClick={onClearAttatchment}>Clear</button>
        </div>
      )}
    </form>
  );
};

export default MweetFactory;
