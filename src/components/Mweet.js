import { dbService, storageService } from "myBase";
import React, { useState } from "react";

const Mweet = ({ mweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newMweet, setNewMweet] = useState(mweetObj.text);
  // 삭제
  const onDeleteClick = async () => {
    const ok = window.confirm("해당 게시글을 삭제할까?");
    if (ok) {
      await dbService.doc(`mweets/${mweetObj.id}`).delete();
      // What's wrong?
      await storageService.refFromURL(mweetObj.attachmentUrl).delete();
    }
  };

  // 수정
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`mweets/${mweetObj.id}`).update({
      text: newMweet,
    });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewMweet(value);
  };
  return (
    <div>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  placeholder="Edit your Mweet"
                  value={newMweet}
                  onChange={onChange}
                  required
                />
                <input type="submit" value="Update Mweet"></input>
              </form>
              <button onClick={toggleEditing}>Cancel</button>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{mweetObj.text}</h4>
          {mweetObj.attachmentUrl && <img src={mweetObj.attachmentUrl} width="50px" height="50px"></img>}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Mweet</button>
              <button onClick={toggleEditing}>Edit Mweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Mweet;
