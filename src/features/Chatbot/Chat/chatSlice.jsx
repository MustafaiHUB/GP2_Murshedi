import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  questions: [],
  isLoading: false,
  error: "",
  // conversation: [
  //   {
  //     id: "8d7798c5-a9bf-47e1-b905-3eb89ab67821",
  //     thread_id: "thread_123",
  //     messages: [
  //       {
  //         question: "What is your name?",
  //         answer: "I am Murshedi.",
  //         response_id: "123123",
  //       },
  //     ],
  //   },
  // ],
  conversation: [],
  currentId: "",
  latestQuestion: "",
  latestAnswer: "",
  firstQuestion: "",
  allowBackHistory: true,
  thread_ids: [], // [{chatId, thread_id}]
  current_thread_id: "",
};

const chatReducer = createSlice({
  name: "chat",
  initialState,
  reducers: {
    createChat: {
      prepare(id, title) {
        return { payload: { id, title } };
      },
      reducer(state, action) {
        const { id, title } = action.payload;
        state.questions = [...state.questions, { id, title }];

        localStorage.removeItem("questions");
        localStorage.setItem("questions", JSON.stringify(state.questions));

        // console.log(state.questions);
        state.firstQuestion = title;
        state.currentId = id;
        state.error = "";
      },
    },
    updateCurrentId(state, action) {
      // console.log(action.payload);
      state.currentId = action.payload;
      state.error = "";
    },
    sendQuestion: {
      prepare(question, answer, response_id, thread_id) {
        return {
          payload: { question, answer, response_id, thread_id },
        };
      },
      reducer(state, action) {
        const { question, answer, response_id, thread_id } = action.payload;
        const { currentId, conversation } = state;

        // Look for an existing conversation with the currentId
        const existingConversationIndex = conversation.findIndex(
          (conv) => conv.id === currentId
        );

        if (existingConversationIndex !== -1) {
          // Update the existing conversation by adding the new message
          const updatedConversation = conversation.map((conv, index) =>
            index === existingConversationIndex
              ? {
                  ...conv,
                  messages: [
                    ...conv.messages,
                    { question, answer, response_id },
                  ],
                }
              : conv
          );
          state.current_thread_id = thread_id;
          state.conversation = updatedConversation;
          state.isLoading = false;
          state.currentQuestion = question;
          state.currentAnswer = answer;
          state.error = "";
        } else {
          // const newThreadId = {
          //   id: currentId,
          //   thread_id: thread_id,
          // };
          // Create a new conversation object if it doesn't exist
          const newConversation = {
            id: currentId,
            thread_id: thread_id,
            messages: [{ question, answer, response_id }],
          };

          // state.thread_ids = [...state.thread_ids, newThreadId];
          // console.log(state.thread_ids);
          state.conversation = [...conversation, newConversation];
          state.isLoading = false;
          state.firstQuestion = "";
          state.currentQuestion = question;
          state.currentAnswer = answer;
          state.current_thread_id = thread_id;
          state.error = "";

          // localStorage.removeItem("thread_ids");
          // localStorage.setItem("thread_ids", JSON.stringify(state.thread_ids));
        }
      },
    },
    addConversation(state, action) {
      const conversation = state.conversation;
      state.conversation = [...conversation, action.payload];
    },
    deleteAllChats(state) {
      state.conversation = [];
      state.questions = [];
      state.thread_ids = [];
      state.currentId = "";
      state.isLoading = false;
      state.error = "";
      state.latestQuestion = "";
      state.latestAnswer = "";

      localStorage.removeItem("questions");
      localStorage.setItem("questions", JSON.stringify(state.questions));
      // localStorage.removeItem("thread_ids");
      // localStorage.setItem("thread_ids", JSON.stringify(state.thread_ids));
    },
    deleteChat(state, action) {
      console.log(action.payload);
      state.conversation = state.conversation.filter(
        (conv) => conv.id !== action.payload
      );
      state.questions = state.questions.filter(
        (question) => question.id !== action.payload
      );
      state.thread_ids = state.thread_ids.filter(
        (thread) => thread.id !== action.payload
      );
      state.error = "";
      state.latestQuestion = ""; // to prevent the user from coming back to the deleted chat
      state.latestAnswer = "";
      state.allowBackHistory = state.conversation.length > 0; // if there are still conversations, allow back history

      localStorage.removeItem("questions");
      localStorage.setItem("questions", JSON.stringify(state.questions));
      // localStorage.removeItem("thread_ids");
      // localStorage.setItem("thread_ids", JSON.stringify(state.thread_ids));
    },
    setLoading(state) {
      state.isLoading = true;
      state.error = "";
    },
    setError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError(state) {
      state.error = "";
    },
    setLatestQuestion(state, action) {
      state.latestQuestion = action.payload;
    },
    setLatestAnswer(state, action) {
      state.latestAnswer = action.payload;
    },
    setQuestions(state, action) {
      console.log(action.payload);
      state.questions = action.payload;
    },
    // setThreadsIds(state, action) {
    //   console.log(action.payload);
    //   state.thread_ids = action.payload;
    // },
    updateCurrentThreadId(state, action) {
      state.current_thread_id = action.payload;
    },
    setConversationMessages(state, action) {
      const { currentId } = state;
      state.conversation = [
        ...state.conversation,
        { id: currentId, messages: action.payload }, // messages: [{ question, answer }]
      ];
    },
  },
});

export const {
  createChat,
  updateCurrentId,
  sendQuestion,
  deleteAllChats,
  deleteChat,
  setLoading,
  setError,
  clearError,
  setLatestQuestion,
  setLatestAnswer,
  setQuestions,
  setConversationMessages,
  addConversation,
  updateCurrentThreadId,
  // setThreadsIds,
} = chatReducer.actions;
export default chatReducer.reducer;
