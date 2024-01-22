import HeaderComponent from "../components/Header/HeaderComponent";
import ToolBox from "./ToolBox";
import { useRef, useState } from "react";
import Cookies from "js-cookie";
import ToolBoxAdmin from "./ToolBoxAdmin";
import searchIcon from "../assets/icons/Search.svg";
import { useEffect } from "react";
import { listSearchCustomer } from "../actions/customer";
import { useDispatch, useSelector } from "react-redux";
import { PropagateLoader } from "react-spinners";
import { socket } from "../socket";
import {
  chatDetail,
  clearChat,
  clearChatGroup,
  createGroup,
  listChat,
  listSearchChatCustomer,
} from "../actions/chat";
import Moment from "react-moment";
import SearchBarChat from "../components/SearchBarChat/SearchBarChat";
import SearchBarChatPopup from "../components/SearchBarChatPopup/SearchBarChatPopup";
import swal from "sweetalert";
import * as api from "../api/index";
import { Navigate } from "react-router-dom";

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;
const loggedInUser = Cookies.get("loggedInUserId")
  ? JSON.parse(Cookies.get("loggedInUserId"))
  : null;

let preventMessageLoading = true;

const Chat = () => {
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState({ _id: "", inboxData: {} });
  const [dropdownData, setDropdownData] = useState([]);
  const [dropdownGroup, setDropdownGroup] = useState([]);

  // Add a state to keep track of the message count
  const [messageCount, setMessageCount] = useState(0);
  const [selectedCustomers, setSelectedCustomers] = useState([
    { _id: loggedInUser },
  ]);

  const [chatData, setChatData] = useState({
    name: "",
    users: [
      {
        userId: loggedInUser,
      },
    ],
  });

  const clear = () => {
    setChatData({
      name: "",
      users: [
        {
          userId: "",
        },
      ],
    });
    setSelectedCustomers([{ _id: loggedInUser }]);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // if (chatData?.name === "") {
    //   setErrors((prevErrors) => ({
    //     ...prevErrors,
    //     name: "Group name is required.",
    //   }));
    // } else {
    //   setErrors((prevErrors) => ({
    //     ...prevErrors,
    //     name: "",
    //   }));
    // }

    // const hasError = Object.values(errors).some((error) => error);
    // if (!hasError) {
    //   console.log("chatData -- submit ", chatData);
    //   dispatch(createGroup(chatData));
    //   clear();
    // }

    // if (chatData?.name !== "" && chatData?.users.length > 1) {
    //   console.log("chatData -- submit ", chatData);
    //   dispatch(createGroup(chatData));
    //   closePopup();
    //   clear();
    // }

    if (chatData?.name === "" && chatData?.users.length < 3) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Group name is required.",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        users: "Please select more than 1 user",
      }));
    } else if (chatData?.name === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Group name is required.",
      }));
    } else if (chatData?.users.length < 3) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        users: "Please select more than 1 user",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        users: null,
      }));
      console.log("chatData -- submit ", chatData);
      dispatch(createGroup(chatData));
      closePopup();
      clear();
    }
  };

  const [errors, setErrors] = useState({});

  const handleNameBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Group name is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: null,
      }));
    }
  };

  const [toggle, setToggle] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    dispatch(listChat(1, 1000));
    socket.emit("authenticate", { token: loginToken });

    // dispatch(listSearchCustomer(1, 1000, ""));
    // dispatch(listSearchChatCustomer(1, 1000, ""));
  }, []);

  const { loading, activechat, chat, chatSearch, group, Length, chatLoading } =
    useSelector((state) => state.chatReducer);
  useEffect(() => {
    const selectedUserIds = selectedCustomers.map(
      (selectedCustomer) => selectedCustomer._id
    );
    setChatData((prevChatData) => ({
      ...prevChatData,
      users: selectedUserIds.map((userId) => ({ userId })),
    }));

    if (selectedCustomers.length < 3) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        users: "Please select more than 1 user",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        users: null,
      }));
    }
  }, [selectedCustomers]);

  const { customer } = useSelector((state) => state.customerReducer);
  console.log("selectedCustomers ---> ", selectedCustomers);

  useEffect(() => {
    if (selectedUser.length > 0) {
      dispatch(chatDetail(1, 1000, selectedUser?.inboxData?.threadId));
    }
  }, [messageCount]);

  useEffect(() => {
    // Scroll to the last message when the component is loaded or when new messages are added
    scrollToBottom();
  }, [chatLoading]);

  useEffect(() => {
    socket.on(
      "receiveMessage",
      (data) => {
        console.log("Received message:", data.message);
        console.log("Received payload:", data.payload);
        if (preventMessageLoading === false) {
          dispatch(chatDetail(1, 1000, data?.payload?.threadId));
          scrollToBottom();
        }
        // const markDeliverObj = {
        //   token: loginToken,
        //   id: data?.payload?.messageId,
        // };

        // console.log("markDeliverObj -- ", markDeliverObj);

        // socket.emit("markMessageAsDelivered", markDeliverObj);

        let markDeliverObj = {};

        if (data?.payload?.groupId !== null) {
          markDeliverObj = {
            token: loginToken,
            id: data?.payload?.groupId,
          };
        } else {
          markDeliverObj = {
            token: loginToken,
            id: data?.payload?.messageId,
          };
        }

        console.log(
          "markDeliverObj from send message click -- ",
          markDeliverObj
        );

        socket.emit("markMessageAsDelivered", markDeliverObj);

        // Handle the received message and update the messages state
        // setMessages((prevMessages) => [...prevMessages, data]);
      },
      []
    );

    // Clean up the listener when the component unmounts
    return () => {
      socket.off("receiveMessage");
    };
  });

  // const scrollToBottom = () => {
  //   if (chatContainerRef.current) {
  //     console.log("scrolled")
  //     // Using `scrollHeight` to get the total height of the content, including overflow
  //     // `clientHeight` gives the visible height of the container
  //     chatContainerRef.current.scrollTop =
  //       chatContainerRef.current.scrollHeight;
  //   }
  // };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      // console.log("ScrollTop:", scrollTop);
      // console.log("ScrollHeight:", scrollHeight);
      // console.log("ClientHeight:", clientHeight);

      // Calculate the scroll position needed to reach the bottom
      // const scrollTo = scrollHeight - clientHeight;

      // Set scrollTop to scroll to the bottom
      chatContainerRef.current.scrollTop = scrollHeight;
      // console.log("Scrolled to:", scrollTo);
    } else {
      console.log("chatContainerRef is null or undefined");
    }
  };

  const clickChatHandler = (e, chat) => {
    e.preventDefault();

    preventMessageLoading = false;
    console.log("click chat", chat);
    setSelectedUser(chat);
    dispatch(chatDetail(1, 1000, chat?._id));

    let readMessageObj = {};

    if (chat?.groupInfo) {
      readMessageObj = {
        token: loginToken,
        id: chat?.groupInfo?._id,
        type: "all",
      };
    } else {
      readMessageObj = {
        token: loginToken,
        id:
          chat?.inboxData?.senderId === loggedInUser
            ? chat?.inboxData?.receiverId
            : chat?.inboxData?.senderId,
        type: "single",
      };
    }

    console.log("readMessageObj -- ", readMessageObj);

    socket.emit("readMessage", readMessageObj);

    setToggle(!toggle);

    console.log("user -- ", selectedUser);

    setTimeout(() => {
      scrollToBottom();
    }, 0);
  };

  const selectCustomerForGroup = (e, customer) => {
    e.preventDefault();
    // Check if the customer is already selected
    const isCustomerSelected = selectedCustomers.some(
      (c) => c._id === customer._id
    );

    console.log("isCustomerSelected -- ", isCustomerSelected);

    // if (isCustomerSelected !== true) {
    //   if (chatData?.users.length < 2) {
    //     setErrors((prevErrors) => ({
    //       ...prevErrors,
    //       users: "Please select more than 1 user",
    //     }));
    //   } else {
    //     setErrors((prevErrors) => ({
    //       ...prevErrors,
    //       users: null,
    //     }));
    //   }
    // } else if (isCustomerSelected !== false) {
    //   if (chatData?.users.length < 2) {
    //     setErrors((prevErrors) => ({
    //       ...prevErrors,
    //       users: "Please select more than 1 user",
    //     }));
    //   } else {
    //     setErrors((prevErrors) => ({
    //       ...prevErrors,
    //       users: null,
    //     }));
    //   }
    // }

    // if (isCustomerSelected === true && chatData?.users.length < 2) {
    //   setErrors((prevErrors) => ({
    //     ...prevErrors,
    //     users: "Please select more than 1 user",
    //   }));
    // } else if (isCustomerSelected === false && chatData?.users.length < 2) {
    //   setErrors((prevErrors) => ({
    //     ...prevErrors,
    //     users: "Please select more than 1 user",
    //   }));
    // }

    // if (chatData?.users.length < 2) {
    //   setErrors((prevErrors) => ({
    //     ...prevErrors,
    //     users: "Please select more than 1 user",
    //   }));
    // } else {
    //   setErrors((prevErrors) => ({
    //     ...prevErrors,
    //     users: null,
    //   }));
    // }

    if (isCustomerSelected) {
      // If the customer is already selected, remove it from the selectedCustomers array
      setSelectedCustomers((prevSelectedCustomers) =>
        prevSelectedCustomers.filter((c) => c._id !== customer._id)
      );
      // if (selectedCustomers.length < 2) {
      //   setErrors((prevErrors) => ({
      //     ...prevErrors,
      //     users: "Please select more than 1 user",
      //   }));
      // } else {
      //   setErrors((prevErrors) => ({
      //     ...prevErrors,
      //     users: null,
      //   }));
      // }
    } else {
      // If the customer is not selected, add it to the selectedCustomers array
      setSelectedCustomers((prevSelectedCustomers) => [
        ...prevSelectedCustomers,
        customer,
      ]);
    }
  };

  const [typedMessage, setTypedMessage] = useState("");
  const sendMessageHandler = (e) => {
    e.preventDefault();

    const sendMessageObj = {
      token: loginToken,
      message: typedMessage,
      receiverId: selectedUser?.inboxData?.alertNotification
        ? selectedUser?.inboxData?._id
        : selectedUser?.inboxData?.receiverId === loggedInUser
        ? selectedUser?.inboxData?.senderId
        : selectedUser?.inboxData?.receiverId,

      type: "one2one",
    };
    socket.emit("sendMessage", sendMessageObj);

    console.log("sendMessageObj ===== ", sendMessageObj);

    console.log("messageId ---- ", selectedUser?.inboxData?.messageId);

    const markDeliverObj = {
      token: loginToken,
      id: selectedUser?.inboxData?.messageId,
    };
    console.log("markDeliverObj from send message click -- ", markDeliverObj);

    socket.emit("markMessageAsDelivered", markDeliverObj);

    console.log("selectedUser --- ", selectedUser);

    let readMessageObj = {};

    readMessageObj = {
      token: loginToken,
      id: selectedUser?.inboxData?.messageId,
      type: "single",
    };

    socket.emit("readMessage", readMessageObj);

    setTypedMessage("");
    // Increment the messageCount to trigger useEffect when a new message is sent
    setMessageCount((prevCount) => prevCount + 1);
    dispatch(chatDetail(1, 1000, selectedUser?._id)); //chat?.inboxData?.threadId need to solve this
  };

  const sendGroupMessageHandler = (e) => {
    e.preventDefault();

    const sendMessageObj = {
      token: loginToken,
      message: typedMessage,
      groupId: selectedUser?.groupInfo?._id,
      type: "group",
    };
    socket.emit("sendMessage", sendMessageObj);

    console.log("sendMessageObj group ===== ", sendMessageObj);
    const markDeliverObj = {
      token: loginToken,
      id: selectedUser?.groupInfo?._id,
    };
    console.log(
      "markDeliverObj from group send message click -- ",
      markDeliverObj
    );

    socket.emit("markMessageAsDelivered", markDeliverObj);

    setTypedMessage("");
    // Increment the messageCount to trigger useEffect when a new message is sent
    setMessageCount((prevCount) => prevCount + 1);
    dispatch(chatDetail(1, 1000, selectedUser?._id)); //chat?.inboxData?.threadId need to solve this
  };

  // const searchFriendHandler = (e, user) => {
  //   e.preventDefault();
  //   setSelectedUser(user);

  //   const sendMessageObj = {
  //     token: loginToken,
  //     message: "Hi",
  //     receiverId: user._id,
  //     type: "one2one",
  //   };
  //   socket.emit("sendMessage", sendMessageObj);

  //   // console.log("user =-=- ", user);

  //   // const markDeliverObj = {
  //   //   token: loginToken,
  //   //   id: user?.socketId,
  //   // };

  //   // socket.emit("markMessageAsDelivered", markDeliverObj);

  //   dispatch(listChat(1, 1000));

  //   // dispatch(chatDetail(1, 1000, user?.inboxData?.threadId));

  //   // console.log("user == ", user);
  // };
  // const clickChatHandler = (e, chat) => {
  //   e.preventDefault();

  //   preventMessageLoading = false;
  //   console.log("click chat", chat);
  //   setSelectedUser(chat);
  //   dispatch(chatDetail(1, 1000, chat?._id));

  //   let readMessageObj = {};

  //   if (chat?.groupInfo) {
  //     readMessageObj = {
  //       token: loginToken,
  //       id: chat?.groupInfo?._id,
  //       type: "all",
  //     };
  //   } else {
  //     readMessageObj = {
  //       token: loginToken,
  //       id:
  //         chat?.inboxData?.senderId === loggedInUser
  //           ? chat?.inboxData?.receiverId
  //           : chat?.inboxData?.senderId,
  //       type: "single",
  //     };
  //   }

  //   console.log("readMessageObj -- ", readMessageObj);

  //   socket.emit("readMessage", readMessageObj);

  //   setToggle(!toggle);

  //   console.log("user -- ", selectedUser);

  //   setTimeout(() => {
  //     scrollToBottom();
  //   }, 0);
  // };

  const searchFriendHandler = async (e, chat) => {
    e.preventDefault();
    console.log("clickkkkkkk");

    console.log("click chat 2", chat);
    setSelectedUser((prev) => ({
      ...prev,
      _id: chat.threadId,
      inboxData: chat,
    }));

    if (chat?.threadId === "") {
      const sendMessageObj = {
        token: loginToken,
        message: "Hi",
        receiverId: chat?._id,
        type: "one2one",
      };
      socket.emit("sendMessage", sendMessageObj);

      console.log("sendMessageObj ===== ", sendMessageObj);

      const { data } = await api.fetchThreadId(chat?._id);

      console.log("data  =-- ", data);
      setSelectedUser((prev) => ({
        ...prev,
        _id: data?.data,
      }));
      dispatch(chatDetail(1, 1000, data?.data));

      dispatch(listChat(1, 1000));

      setToggle(!toggle);

      let readMessageObj = {};

      if (chat?.groupData?.length !== 0) {
        readMessageObj = {
          token: loginToken,
          id: chat?.groupData?._id,
          type: "all",
        };
      } else {
        readMessageObj = {
          token: loginToken,
          id:
            chat?.inboxData?.senderId === loggedInUser
              ? chat?.inboxData?.receiverId
              : chat?.inboxData?.senderId,
          type: "single",
        };
      }

      console.log("readMessageObj -- ", readMessageObj);

      socket.emit("readMessage", readMessageObj);
    } else {
      console.log("not now");
      let readMessageObj = {};

      if (chat?.groupInfo) {
        readMessageObj = {
          token: loginToken,
          id: chat?.groupInfo?._id,
          type: "all",
        };
      } else {
        readMessageObj = {
          token: loginToken,
          id: chat?.inboxData?.messageId,
          type: "single",
        };
      }

      socket.emit("readMessage", readMessageObj);
      setToggle(!toggle);
      // setSelectedUser(chat);
      dispatch(chatDetail(1, 1000, chat?.threadId));
    }
  };

  const override = {
    display: "flex",
    justifyContent: "center",
    marginTop: "100px ",
    borderColor: "red",
  };

  const clearChatHandler = async (e, ID, nameOfChat) => {
    e.preventDefault();
    swal({
      title: "Are you sure?",
      text: `You want to clear chat data with ${nameOfChat}`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal(`Chat data with ${nameOfChat} is deleted successfully`, {
          icon: "success",
        });
        dispatch(clearChat(ID)); //delete action
      }
    });
  };

  const clearChatHandlerGroup = async (e, ID, nameOfChat, threadId) => {
    e.preventDefault();
    swal({
      title: "Are you sure?",
      text: `You want to clear chat data with ${nameOfChat}`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal(`Chat data with ${nameOfChat} is deleted successfully`, {
          icon: "success",
        });
        console.log("group clear", ID, nameOfChat, threadId);
        dispatch(clearChatGroup(ID, threadId)); //delete action
      }
    });
  };

  const popupRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => {
    setErrors({});
    setIsOpen(true);
  };
  const closePopup = () => {
    setIsOpen(false);
  };
  const closePopupBlur = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  console.log("dropdownGroup -- ", dropdownGroup);
  console.log("selectedUser -> ", selectedUser);
  return (
    <div className="chat">
      <div className="container-fluid">
        <HeaderComponent />

        {loading ? (
          <div className="loader">
            <PropagateLoader
              cssOverride={override}
              size={15}
              color={"#000"}
              loading={loading}
            />
          </div>
        ) : (
          <div className="row ms-4 me-md-4 me-0">
            <div className="col-12 px-0">
              <div className="chatBox" onClick={() => setDropdownData([])}>
                <div
                  className={`contactList ${
                    toggle === true ? "" : "translate"
                  }`}
                >
                  <div className="chatListHeader">
                    <div className="profile">
                      <div className="col-md-10 ">
                        <div
                          style={{
                            background: "white",
                            paddingRight: "10px",
                            borderRadius: "20px",
                            // width: "200px",
                          }}
                          className="search text-end cursor-pointer d-flex align-items-center"
                        >
                          <SearchBarChat
                            setDropdownData={setDropdownData}
                            setDropdownGroup={setDropdownGroup}
                          />
                        </div>
                      </div>
                      <div
                        className="col-2"
                        style={{
                          paddingLeft: "10px",
                          background: "#fff",
                          borderRadius: "50%",
                          width: "40px",
                          height: "40px",
                          flex: "1",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <i
                            className="fa-sharp fa-solid fa-people-group"
                            title="Create New Group"
                            style={{ paddingRight: "10px" }}
                            onClick={openPopup}
                            // onClick={async (e) => {
                            //   await getDetailHandler(e, data._id);
                            //   await editHandler(e, data._id);
                            // }}
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  {dropdownData && dropdownData?.length > 0 && (
                    <div className="dropdown">
                      {dropdownData?.map((user) => (
                        <div
                          key={user._id}
                          className="dropdownItem"
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            setSelectedUser({ _id: "", inboxData: {} });
                            searchFriendHandler(e, user);
                          }}

                          // onClick={(e) => searchFriendHandler(e, user)}
                        >
                          {user.fullName}
                        </div>
                      ))}
                    </div>
                  )}

                  {dropdownGroup && dropdownGroup?.length > 0 && (
                    <div className="dropdown">
                      {dropdownGroup?.map((group) => (
                        <div
                          key={group._id}
                          className="dropdownItem"
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            setSelectedUser({ _id: "", inboxData: {} });
                            searchFriendHandler(e, group);
                          }}
                        >
                          {group.name}
                        </div>
                      ))}
                    </div>
                  )}

                  {chat.map((c, index) => (
                    <div
                      className="contact"
                      onClick={(e) => clickChatHandler(e, c)}
                      key={index}
                    >
                      <div className="profile">
                        <div className="image">
                          {c?.groupInfo && c?.groupInfo?._id !== "" ? (
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                backgroundColor: "black",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontWeight: "bold",
                                color: "white",
                              }}
                            >
                              {c?.groupInfo?.name.slice(0, 1)}
                            </div>
                          ) : (
                            <img
                              src={
                                c?.inboxData?.receiverId === loggedInUser
                                  ? c?.inboxData?.senderData?.image ||
                                    "./assets/profile.png"
                                  : c?.inboxData?.receiverData?.image ||
                                    "./assets/profile.png"
                              }
                              alt=""
                            />
                          )}
                        </div>
                        <div className="text">
                          <h5>
                            {c?.inboxData?.groupId !== null
                              ? c?.groupInfo?.name
                              : c?.inboxData?.receiverId === loggedInUser
                              ? c?.inboxData?.senderData?.fullName
                              : c?.inboxData?.receiverData?.fullName}
                          </h5>
                          <p>
                            {c?.inboxData?.receiverId === loggedInUser
                              ? c?.inboxData?.senderData?.role === 1
                                ? "Admin"
                                : c?.inboxData?.senderData?.role === 2
                                ? "Carrier"
                                : c?.inboxData?.senderData?.role === 3
                                ? "Broker"
                                : c?.inboxData?.senderData?.role === 4
                                ? "Driver"
                                : "Company"
                              : c?.inboxData?.receiverData?.role === 1
                              ? "Admin"
                              : c?.inboxData?.receiverData?.role === 2
                              ? "Carrier"
                              : c?.inboxData?.receiverData?.role === 3
                              ? "Broker"
                              : c?.inboxData?.receiverData?.role === 4
                              ? "Driver"
                              : "Company"}
                            &#58; {c?.inboxData?.lastMessage.slice(0, 10)} ...
                          </p>
                        </div>
                      </div>
                      {/* {c?.unReadMsgCount !== 0 && (
                        <div
                          className="msgCount"
                          style={{
                            background: "black",
                            color: "white",
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            paddingTop: "15px",
                            fontSize: "14px",
                          }}
                        >
                          <p>{c?.unReadMsgCount}</p>
                        </div>
                      )} */}
                      <div className="time">
                        <p className="mb-0">
                          {c?.inboxData?.receiverId === loggedInUser ? (
                            c?.inboxData?.senderData?.isOnline === true ? (
                              "Now"
                            ) : (
                              <Moment fromNow>{c?.inboxData?.createdAt}</Moment>
                            )
                          ) : c?.inboxData?.receiverData?.isOnline === true ? (
                            "Now"
                          ) : (
                            <Moment fromNow>{c?.inboxData?.createdAt}</Moment>
                          )}
                        </p>
                        <div className="msgCount">
                          <p>
                            {c?.unReadMsgCount > 99 ? `99+` : c?.unReadMsgCount}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* this is chating area */}
                <div className="contactChat">
                  {selectedUser?.inboxData &&
                  Object.keys(selectedUser.inboxData).length == 0 ? (
                    ""
                  ) : (
                    <div className="chatHeader">
                      <div className="toggle">
                        <i
                          className="fa-solid fa-bars"
                          onClick={() => setToggle(!toggle)}
                        ></i>
                      </div>
                      <div className="profile">
                        <div className="image">
                          {selectedUser?.groupInfo &&
                          selectedUser?.groupInfo?._id !== "" ? (
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                backgroundColor: "black",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontWeight: "bold",
                                color: "white",
                              }}
                            >
                              {selectedUser?.groupInfo?.name.slice(0, 1)}
                            </div>
                          ) : (
                            <img
                              src={
                                selectedUser?.inboxData?.alertNotification
                                  ? !selectedUser?.inboxData?.image
                                    ? "./assets/profile.png"
                                    : selectedUser?.inboxData?.image !== ""
                                    ? selectedUser?.inboxData?.image
                                    : "./assets/profile.png"
                                  : selectedUser?.inboxData?.receiverId ===
                                    loggedInUser
                                  ? selectedUser?.inboxData?.senderData
                                      ?.image || "./assets/profile.png"
                                  : selectedUser?.inboxData?.receiverData
                                      ?.image || "./assets/profile.png"
                              }
                              // src={selectedUser?.inboxData?.image}
                              alt=""
                            />
                          )}
                        </div>
                        <div className="text">
                          <h5>
                            {selectedUser?.inboxData?.alertNotification
                              ? selectedUser?.inboxData?.fullName
                              : selectedUser?.groupInfo &&
                                selectedUser?.groupInfo?._id !== ""
                              ? selectedUser?.groupInfo?.name
                              : selectedUser?.inboxData?.receiverId ===
                                loggedInUser
                              ? selectedUser?.inboxData?.senderData?.fullName
                              : selectedUser?.inboxData?.receiverData?.fullName}
                          </h5>
                          <p>
                            {selectedUser?.inboxData?.receiverId ===
                            loggedInUser
                              ? selectedUser?.inboxData?.senderData?.role === 1
                                ? "Admin"
                                : selectedUser?.inboxData?.senderData?.role ===
                                  2
                                ? "Carrier"
                                : selectedUser?.inboxData?.senderData?.role ===
                                  3
                                ? "Broker"
                                : selectedUser?.inboxData?.senderData?.role ===
                                  4
                                ? "Driver"
                                : "Company"
                              : selectedUser?.inboxData?.receiverData?.role ===
                                1
                              ? "Admin"
                              : selectedUser?.inboxData?.receiverData?.role ===
                                2
                              ? "Carrier"
                              : selectedUser?.inboxData?.receiverData?.role ===
                                3
                              ? "Broker"
                              : selectedUser?.inboxData?.receiverData?.role ===
                                4
                              ? "Driver"
                              : "Company"}
                          </p>
                        </div>
                      </div>
                      <div className="clearChat">
                        {selectedUser?.groupInfo ? (
                          <button
                            type="button"
                            className="btn"
                            onClick={async (e) => {
                              await clearChatHandlerGroup(
                                e,
                                selectedUser?.groupInfo?._id,
                                selectedUser?.groupInfo
                                  ? selectedUser?.groupInfo?.name
                                  : selectedUser?.inboxData?.receiverData
                                      ?._id === loggedInUser
                                  ? selectedUser?.inboxData?.senderData
                                      ?.fullName
                                  : selectedUser?.inboxData?.receiverData
                                      ?.fullName,
                                selectedUser?._id
                              );
                            }}
                          >
                            Clear Group Chat
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn"
                            onClick={async (e) => {
                              await clearChatHandler(
                                e,
                                selectedUser?._id,
                                selectedUser?.groupInfo
                                  ? selectedUser?.groupInfo?.name
                                  : selectedUser?.inboxData?.receiverData
                                      ?._id === loggedInUser
                                  ? selectedUser?.inboxData?.senderData
                                      ?.fullName
                                  : selectedUser?.inboxData?.receiverData
                                      ?.fullName
                              );
                            }}
                          >
                            Clear Chat
                          </button>
                        )}

                        {/* <i className="fa-solid fa-ellipsis-vertical"></i> */}
                      </div>
                    </div>
                  )}
                  <div className="chatConversation" ref={chatContainerRef}>
                    {chatLoading === true && (
                      <div className="loader">
                        <PropagateLoader
                          cssOverride={override}
                          size={10}
                          color={"#000"}
                          loading={chatLoading}
                        />
                      </div>
                    )}
                    {activechat
                      ?.slice() // Make a shallow copy to avoid modifying the original array
                      ?.reverse() // Reverse the array to change the rendering order
                      ?.map((a, index) => (
                        <div className="messageBox" key={index}>
                          {a?.messageData?.messageData?.senderId ===
                          loggedInUser ? (
                            <div className="SendedMessage">
                              <div className="text">
                                {a?.messageData?.messageData?.message}
                              </div>
                              <i className="fa-solid fa-play"></i>
                              <p className="time">
                                <Moment fromNow>
                                  {a?.messageData?.createdAt}
                                </Moment>
                              </p>
                            </div>
                          ) : (
                            <div className="receivedMessage">
                              <div className="text">
                                {a?.messageData?.messageData?.message}
                              </div>
                              <img src="./assets/corner.png" alt="" />
                              <p className="time">
                                <Moment
                                  fromNow
                                  calendar={{
                                    sameDay: "[Today]",
                                    nextDay: "[Tomorrow]",
                                    lastDay: "[Yesterday]",
                                    sameElse: "LLL",
                                  }}
                                >
                                  {a?.messageData?.createdAt}
                                </Moment>
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                  {selectedUser?.inboxData &&
                  Object.keys(selectedUser.inboxData).length == 0 ? (
                    ""
                  ) : (
                    <div className="sendMessage">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Type Something"
                        value={typedMessage}
                        onChange={(e) => setTypedMessage(e.target.value)}
                        // onBlur={(e) => handleUnitNumberBlur(e)}
                        required
                      />
                      <button
                        className="btn"
                        onClick={
                          selectedUser?.groupInfo
                            ? sendGroupMessageHandler
                            : sendMessageHandler
                        }
                      >
                        <i className="fa-solid fa-paper-plane"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {JSON.parse(Cookies.get("role")) === 1 ? <ToolBoxAdmin /> : <ToolBox />}

      {/* add new driver popup */}
      {isOpen && (
        <div className="popup-container" onClick={closePopupBlur}>
          <div className="popup" ref={popupRef}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Create Group
                </h5>
                <button
                  type="button"
                  className="btn-closed"
                  onClick={closePopup}
                  aria-label="Close"
                  // onClick={() => clear()}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="chatBoxPopup">
                  <div className="contactListPopup">
                    <div className="col-md-12">
                      <div className="inputField">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Group Name"
                          value={chatData.name}
                          onChange={(e) => {
                            setChatData({
                              ...chatData,
                              name: e.target.value,
                            });
                            handleNameBlur(e);
                          }}
                          onBlur={handleNameBlur}
                          required
                        />
                      </div>
                      {errors.name && (
                        <h6 className="text-danger validation-error mt-2">
                          {errors.name}
                        </h6>
                      )}
                    </div>
                    {errors.users && (
                      <h6 className="text-danger validation-error mt-2">
                        {errors.users}
                      </h6>
                    )}
                    <div className="col-md-12 ">
                      <div
                        style={{
                          background: "white",
                          paddingRight: "10px",
                          borderRadius: "20px",
                          // width: "200px",
                        }}
                        className="search text-end cursor-pointer d-flex align-items-center"
                      >
                        <SearchBarChatPopup />
                      </div>
                      <div className="resultList">
                        {customer?.map((c, index) => (
                          <div
                            // className="contact"
                            className={`contact ${
                              selectedCustomers.includes(c) ? "selected" : ""
                            }`}
                            onClick={(e) => selectCustomerForGroup(e, c)}
                            key={index}
                          >
                            <div className="profile">
                              <div className="image">
                                <img
                                  src={
                                    c?.image ? c?.image : "./assets/profile.png"
                                  }
                                  alt=""
                                />
                              </div>
                              <div className="text">
                                <h5>{c?.fullName}</h5>
                                <p>
                                  {c?.role === 1
                                    ? "Admin"
                                    : c?.role === 2
                                    ? "Carrier"
                                    : c?.role === 3
                                    ? "Broker"
                                    : c?.role === 4
                                    ? "Driver"
                                    : "Company"}
                                  {/* &#58; {c?.inboxData?.lastMessage.slice(0, 10)} ... */}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-border"
                  onClick={closePopup}
                >
                  Back
                </button>
                <button type="button" className="btn" onClick={submitHandler}>
                  Create Group
                  {/* {currentId === 0 ? "Add Driver" : "Update Driver"} */}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
