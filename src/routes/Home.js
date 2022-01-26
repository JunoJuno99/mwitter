import Mweet from "components/Mweet";
import { dbService } from "myBase";
import React, { useEffect, useState } from "react";
import MweetFactory from "components/MweetFactory";

const Home = ({ userObj }) => {
  const [mweets, setMweets] = useState([]);

  // 방법 1
  //   const getMweets = async () => {
  //     const dbMweets = await dbService.collection("mweets").get();
  //     dbMweets.forEach((document) => {
  //       const mweetObject = {
  //         ...document.data(),
  //         id: document.id,
  //       };
  //       setMweets((prev) => [mweetObject, ...prev]);
  //     });
  //   };

  // 방법 2
  useEffect(() => {
    dbService.collection("mweets").onSnapshot((snapshot) => {
      const mweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMweets(mweetArray);
    });
  }, []);
  return (
    <div className="container">
      <MweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {mweets.map((mweet) => (
          <Mweet
            key={mweet.id}
            mweetObj={mweet}
            isOwner={mweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
