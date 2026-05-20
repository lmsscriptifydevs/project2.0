import Chating from '../../../components/frelancerChat/Chat/Chating';
import ChatUserProfile from '../../../components/frelancerChat/Chat/ChatUserProfile';
import UsersChat from '../../../components/frelancerChat/Chat/UsersChat';
import '../../../style/frelancerChat.scss';
import SidebarLayout from "../sidebarLayout";

const Chat = () => {
  return (
    <SidebarLayout>
      <div className="container-fluid mt-4 poppins">
        <div className="row px-lg-3 px-md-3 mt-3 mb-3 justify-content-center">
          <div className="col-lg-3 col-12">
            <UsersChat />
          </div>
          <div className="col-lg-6 col-12 mt-lg-0 mt-3">
            <Chating />
          </div>
          <div className="col-lg-3 col-12 mt-lg-0 mt-3">
            <ChatUserProfile />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Chat;
