import { dbService, storageService } from "myBase";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
    <div className="mweet">
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit} className="container mweetEdit">
                <input
                  type="text"
                  placeholder="Edit your Mweet"
                  value={newMweet}
                  onChange={onChange}
                  required
                  autoFocus
                  className="formInput"
                />
                <input
                  type="submit"
                  value="Update Mweet"
                  className="formBtn"
                ></input>
              </form>
              <span onClick={toggleEditing} className="formBtn cancelBtn">
                Cancel
              </span>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{mweetObj.text}</h4>
          {mweetObj.attachmentUrl && <img src={mweetObj.attachmentUrl}></img>}
          {isOwner && (
            <div className="mweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt}></FontAwesomeIcon>
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Mweet;
