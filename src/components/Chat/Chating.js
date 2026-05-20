import { Button } from "@mui/material";
import Pusher from "pusher-js";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux"; // Redux add kiya
import { BsThreeDotsVertical, BsCheck2, BsCheck2All } from "react-icons/bs"; // Ticks ke icons
import { FaMicrophone } from "react-icons/fa";
import { IoMdAttach } from "react-icons/io";
import { RiSendPlaneFill } from "react-icons/ri";
import userImg from "../../assets/chatImg.webp";
import videos from "../../assets/VideoCall.webp";
import voice from "../../assets/VoiceCall.webp";

// Redux actions import kiye (Apne folder structure ke hisaab se path theek kar lijiyega agar error aye)
import { 
  sendMessage, 
  handleTypingIndicator, 
  markMessagesAsRead 
} from "../../redux/messageSlice"; 

// Props mein receiverId, conversationId, aur myUserId add kiye hain
const Chating = ({ handlevideo, video, receiverId, conversationId, myUserId }) => {
  const dispatch = useDispatch();
  const inputReference = useRef(null);
  const scrollRef = useRef(null);
  const typingTimeout = useRef(null); // Typing roknay ke timer ke liye ref

  const [getInputVal, setGetInputVal] = useState("");
  const [text, setText] = useState([]);
  const [showDail, setShowDail] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // Typing state

  // Pusher configuration
  const pusher_key = "9f595c24255fa4029398";

  // Dynamic channel name based on conversation ID
  const channel_name = conversationId ? `conversation.${conversationId}` : "my-channel";

  // PERF STARTUP: Defer Pusher initialization until after first paint - UI renders first
  useEffect(() => {
    if (!conversationId) return; // Agar chat select nahi hui toh Pusher connect na kare

    const initPusher = () => {
      // Initialize Pusher
      const pusher = new Pusher(pusher_key, {
        cluster: "mt1",
        encrypted: true,
      });

      // Subscribe to the channel
      const channel = pusher.subscribe(channel_name);

      // 1. Listen for NEW MESSAGES
      channel.bind("App\\Events\\MessageSent", (data) => {
        setText((prevMessages) => [...prevMessages, data.message]);

        // Agar main receiver hu aur message aya hai, toh backend ko batao ke maine Read kar liya hai
        if (data.message.receiver_id === myUserId) { 
            dispatch(markMessagesAsRead({ 
                conversation_id: conversationId, 
                message_ids: [data.message.id] 
            }));
        }
      });

      // 2. Listen for TYPING INDICATOR
      channel.bind("App\\Events\\UserTyping", (data) => {
        // Sirf tab typing dikhao jab dusra banda type kar raha ho
        if (data.user_id !== myUserId) {
          setIsTyping(data.is_typing);
        }
      });

      // 3. Listen for MESSAGE READ (Blue Ticks)
      channel.bind("App\\Events\\MessageRead", (data) => {
        setText((prevMessages) => 
          prevMessages.map(msg => 
            data.message_ids.includes(msg.id) ? { ...msg, read: true } : msg
          )
        );
      });

      // Cleanup
      return () => {
        pusher.unsubscribe(channel_name);
        pusher.disconnect();
      };
    };

    // PERF: Defer Pusher connection until after first paint
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initPusher, { timeout: 500 });
    } else {
      setTimeout(initPusher, 0);
    }
  }, [conversationId, myUserId, dispatch, channel_name]);

  // Handle Typing Input (Debouncing ke sath)
  const handleInputChange = (e) => {
    setGetInputVal(e.target.value);

    if (receiverId) {
      // Backend ko batao main type kar raha hu
      dispatch(handleTypingIndicator({ receiver_id: receiverId, is_typing: true }));
    }

    // Puraana timeout clear karo
    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    // Agar 2 seconds tak mazeed type na kiya toh typing band kardo
    typingTimeout.current = setTimeout(() => {
      if (receiverId) {
        dispatch(handleTypingIndicator({ receiver_id: receiverId, is_typing: false }));
      }
    }, 2000);
  };

  // Send message
  const handleSendMessage = () => {
    if (!getInputVal) return;

    // Redux action call karo message bhejne ke liye
    dispatch(sendMessage({
        receiver_id: receiverId,
        message: getInputVal,
        message_type: 'text'
    })).then((res) => {
        // Redux se response ane ke baad local state update karein (taake foran UI pe show ho)
        // Note: Agar backend Pusher se hi apna message wapas bhej raha hai, toh yeh line hata dein warna double show hoga.
        if (res.payload) {
          setText((prevMessages) => [...prevMessages, res.payload]);
        }
    });

    // Message chala gaya, ab typing animation foran band kardo
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    if (receiverId) {
      dispatch(handleTypingIndicator({ receiver_id: receiverId, is_typing: false }));
    }

    setGetInputVal("");
    inputReference.current.focus();
  };

  // Handle Enter key press
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  // Toggle dial (for mobile)
  const toggleDail = () => {
    setShowDail(!showDail);
  };

  // Scroll to bottom jab naya message aye
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [text, isTyping]);

  return (
    <div className="h-100 poppins">
      <div className="cahting h-100">
        <div className="card h-100 justify-content-between">
          <div>
            <div className="scroll px-3">
              {text.length > 0 ? (
                text.map((curelem, ind) => (
                  <div
                    key={ind}
                    className={`d-flex justify-content-${
                      curelem.sender_id === myUserId ? "end" : "start" // User comparison update
                    } mb-4 position-relative p-3 ${
                      curelem.sender_id === myUserId ? "user-msg" : "my-msg"
                    }`}
                  >
                    <div>
                      <img
                        src={userImg}
                        width={42}
                        className="user_img_msg"
                        alt="user"
                      />
                    </div>
                    <div
                      className={`msg_cotainer${
                        curelem.sender_id === myUserId ? "" : "_user"
                      } ps-lg-3 ps-md-3 ps-4`}
                    >
                      <p
                        className="fw-medium font-16 mb-1"
                        style={{ color: "#1D2B3C" }}
                      >
                        {curelem.sender_id === myUserId ? "You" : (curelem.name || "User")}{" "}
                        <span className="msg-time ms-3">
                          {curelem.created_at ? new Date(curelem.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "13:00"}
                        </span>
                      </p>

                      <div className="d-flex align-items-end">
                        <p className="font-12 mb-0">{curelem.message}</p>

                        {/* TICK SYSTEM */}
                        {curelem.sender_id === myUserId && (
                          <span className="ms-2 mb-1" style={{ fontSize: '14px' }}>
                            {curelem.read ? (
                                <BsCheck2All color="#34B7F1" /> // Blue Double Ticks (Read)
                            ) : (
                                <BsCheck2 color="#8696A0" /> // Single/Double Grey Tick
                            )}
                          </span>
                        )}
                      </div>

                    </div>
                  </div>
                ))
              ) : (
                <h3 className="mt-5 text-center text-muted">
                  Please Select any Chat to view messages
                </h3>
              )}

              {/* TYPING INDICATOR (3 Dots wali feel) */}
              {isTyping && (
                <div className="d-flex justify-content-start mb-4 p-3 position-relative">
                   <div className="msg_cotainer_user ps-lg-3 ps-md-3 ps-4 d-flex align-items-center">
                     <p className="font-12 mb-0 text-muted fst-italic">Typing...</p>
                   </div>
                </div>
              )}

              {/* Dummy div to scroll to bottom */}
              <div ref={scrollRef} />

            </div>
          </div>

          <div className="p-3">
            <div className="card-footer pt-0 pb-0 border-0 rounded-3 position-relative">
              <div className="call-option">
                <div>
                  <img
                    src={videos}
                    width={30}
                    height={30}
                    style={{ cursor: "pointer" }}
                    onClick={handlevideo}
                    alt="video"
                  />
                </div>
                <img
                  src={voice}
                  width={30}
                  className="mt-2"
                  height={30}
                  alt="voice"
                />
              </div>

              {showDail && (
                <div
                  className="chat-icons bg-gray mobile-link"
                  style={{ width: "fit-content" }}
                >
                  <span className="cursor-pointer text-white">
                    <IoMdAttach size={20} className="ms-2" />
                  </span>
                  <span className="cursor-pointer">
                    <FaMicrophone size={20} className="mx-2 text-white" />
                  </span>
                  <span className="cursor-pointer text-white">
                    <BsThreeDotsVertical size={25} />
                  </span>
                </div>
              )}

              <div className="input-group align-items-center">
                <span
                  className={`input-group-text addIcon d-lg-none d-md-none d-block ${
                    showDail === false
                      ? "mbl-btn-rotate-befor"
                      : "mbl-btn-rotate-after"
                  }`}
                  id="basic-addon1"
                  onClick={toggleDail}
                >
                  +
                </span>
                <input
                  className="form-control type_msg font-12 pt-0 pb-0"
                  ref={inputReference}
                  id="input"
                  type="text"
                  value={getInputVal}
                  style={{ color: "black" }}
                  onChange={handleInputChange} // Yahan handleInputChange lagaya
                  autoFocus={true}
                  placeholder="Type here...."
                  onKeyDown={handleKeyDown}
                />
                <button className="btn-snd px-1" onClick={handleSendMessage}>
                  <RiSendPlaneFill size={20} />
                </button>
                <span className="cursor-pointer d-lg-block d-md-block d-none">
                  <IoMdAttach size={20} color="#ed5623" className="ms-2" />
                </span>
                <span className="cursor-pointer d-lg-block d-md-block d-none">
                  <FaMicrophone size={20} className="mx-2 takegraycolor" />
                </span>
                <span className="cursor-pointer d-lg-block d-md-block d-none takegraycolor">
                  <BsThreeDotsVertical size={30} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chating;