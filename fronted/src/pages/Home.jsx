import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import {
  Box,
  HStack,
  Tag,
  Avatar,
  TagLabel,
  VStack,
  Text,
  Flex,
} from "@chakra-ui/react";
import "./style.css";
import Sidebar from "./Sidebar";
import Post from "./Post";
import UserFollow from "./UserFollow";
// const baseUrl=https://cyan-foal-robe.cyclic.app/
const Home = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [currentUserLikePost, setCurrentUserLikePost] = useState(false);
  const [createFile, setCreateFile] = useState("");
  const [createCaption, setCreateCaption] = useState("");
  const data = JSON.parse(localStorage.getItem("loggedUser"));
  const [isOpen, setIsOpen] = useState(false);

  const getPosts = () => {
    axios
      .get(`https://cyan-foal-robe.cyclic.app/posts`)
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  };

  const getComments = () => {
    axios
      .get(`https://cyan-foal-robe.cyclic.app/comments`)
      .then((res) => setComments(res.data))
      .catch((err) => console.log(err));
  };

  const getLikes = () => {
    axios
      .get(`https://cyan-foal-robe.cyclic.app/likes`)
      .then((res) => {
        setLikes(res.data);
        getCurrentUserLike(res.data);
      })
      .catch((err) => console.log(err));
  };

  const filterLikesByPostId = (postId) => {
    const filteredData = likes.filter((item) => item.postId === postId);
    const currentUserLiked = filteredData.filter(
      (item) => item.userId._id === data?.userData._id
    );
    return [filteredData.length, currentUserLiked.length > 0];
  };

  const getCurrentUserLike = (liked) => {
    const isCurrentUserLiked = liked.filter(
      (item) => item.userId._id === data?.userData._id
    );

    if (isCurrentUserLiked.length > 0) {
      setCurrentUserLikePost(true);
    } else {
      setCurrentUserLikePost(false);
    }
  };

  useEffect(() => {
    getPosts();
    getComments();
    getLikes();
  }, []);

  const handleOnClickPostCreation = () => {
    axios
      .post(`https://cyan-foal-robe.cyclic.app/posts/create`, {
        url: createFile,
        caption: createCaption,
        userId: data?.userData._id,
      })
      .then((res) => {
        getPosts();
        getComments();
        getLikes();
      })
      .catch((err) => console.log(err));
    setIsOpen(false);
  };

  return (
    <Box className="main">
      <Flex className="nav-container">
        <Box textAlign={"center"} className="logo-box">
          <Text color={'white'} fontWeight={"600"} fontSize="xl" as="cite" size="md">
            Instagram
          </Text>
        </Box>
        <Box className="feeds-box">
          <HStack>
            {posts?.map((item) => (
              <Tag
                key={item._id}
                size="xs"
                colorScheme="red"
                borderRadius="full"
              >
                <Avatar
                  src={item.userId.image}
                  size="lg"
                  name={item.userId.username}
                  ml={1}
                  mr={1}
                />
              </Tag>
            ))}
          </HStack>
        </Box>
        <Box className="detail-box">
          <Tag size="lg" colorScheme="red" borderRadius="full">
            <Avatar
              src={data?.userData.image}
              size="lg"
              name={data?.userData.username}
              ml={-1}
              mr={2}
            />
            <VStack>
              <TagLabel>
                {data?.userData.username.toLowerCase().split(" ").join(".")}
              </TagLabel>
              <TagLabel>{data?.userData.username}</TagLabel>
            </VStack>
          </Tag>
        </Box>
      </Flex>
      <Flex className="container">
        <Sidebar
          createFile={createFile}
          setCreateFile={setCreateFile}
          createCaption={createCaption}
          setCreateCaption={setCreateCaption}
          handleOnClickPostCreation={handleOnClickPostCreation}
          isOpen={isOpen}
          onOpen={() => setIsOpen(true)}
          onClose={() => setIsOpen(false)}
        />
        <Post
          commentsData={comments}
          getLikes={getLikes}
          loggedInUserData={data}
          filterLikesByPostId={filterLikesByPostId}
          posts={posts}
          getPosts={getPosts}
        />
        <UserFollow />
      </Flex>
    </Box>
  );
};

export default Home;
