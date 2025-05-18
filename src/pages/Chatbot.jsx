import { Outlet, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../features/Chatbot/Sibebar/Sidebar";
import { useSidebar } from "../context/SidebarContext";
import SmallScreenHeader from "../features/Chatbot/Chat/SmallScreenHeader";
import SettingsMenu from "../features/account/SettingsMenu";
import Overlay from "../ui/Overlay";
import { useEffect } from "react";
import Message from "../ui/Message";
import { useSelector } from "react-redux";
import { useChatActions } from "../hooks/useChatActions";
// import TextareaField from "../features/Chatbot/TextareaField/TextareaField";

function Chatbot() {
  // const {chatId} = useParams();
  const navigate = useNavigate();
  const { setQuestionsHandler } = useChatActions();
  const { isOpen, openSettings } = useSidebar();

  const error = useSelector((state) => state.chat.error);
  useEffect(
    function () {
      const questions = JSON.parse(localStorage.getItem("questions"));
      if (questions) {
        setQuestionsHandler(questions);
      }
      navigate("/chatbot/new");
    },
    [navigate, setQuestionsHandler]
  );

  return (
    <div className='bg-[#212121] h-[100dvh] w-full flex relative'>
      {error && <Message message={error} />}
      {isOpen && <Sidebar />}
      <main className='relative flex-1 h-[100dvh] grid grid-rows-[auto_1fr_auto] scrollbar'>
        <SmallScreenHeader />

        <Outlet />

        {/* <TextareaField /> */}
      </main>

      <>
        {(openSettings || isOpen) && <Overlay />}
        {openSettings && <SettingsMenu />}
      </>
    </div>
  );
}
export default Chatbot;
