import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

// ✅ Create or find existing conversation
export const createOrFindConversation = createAsyncThunk(
  'message/createOrFindConversation',
  async ({ participantId, jobInvitationId, initialMessage }, { rejectWithValue }) => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.post(
        '/conversations',
        {
          participant_id: participantId,
          job_invitation_id: jobInvitationId,
          initial_message: initialMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status < 200 || response.status >= 300) {
        return rejectWithValue(response.data.message);
      }
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

// ✅ Fetch all conversations
export const fetchConversations = createAsyncThunk(
  "message/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get("/conversations", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const raw = res.data;
      if (Array.isArray(raw)) return raw;
      if (Array.isArray(raw?.data)) return raw.data;
      if (Array.isArray(raw?.conversations)) return raw.conversations;
      return [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "message/fetchMessages",
  async ({ receiverId, silent = false }, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const params = receiverId ? `?receiver_id=${receiverId}` : "";
      const res = await axios.get(`/messages${params}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      return { messages: res.data.messages, silent };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ✅ Send a message
export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  async (payload, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("message_type", payload.message_type);
      formData.append("message", payload.message);
      formData.append("receiver_id", payload.receiver_id);
      if (payload.offer_id) {
        formData.append("offer_id", payload.offer_id);
      }
      if (payload.file) {
        formData.append("file", payload.file);
      }
      const res = await axios.post("/messages", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ✅ Typing indicator
export const handleTypingIndicator = createAsyncThunk(
  "message/handleTypingIndicator",
  async ({ receiver_id, is_typing }, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        "/messages/typing",
        { receiver_id, is_typing },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to send typing indicator");
    }
  }
);

// ✅ Mark messages as read
export const markMessagesAsRead = createAsyncThunk(
  "message/markMessagesAsRead",
  async ({ conversation_id, message_ids }, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        "/messages/mark-read",
        { conversation_id, message_ids },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return { conversation_id, message_ids, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to mark messages as read");
    }
  }
);

// ✅ Set user online
export const setUserOnline = createAsyncThunk(
  "message/setUserOnline",
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        "/chat/online",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to set online status");
    }
  }
);

// ✅ Set user offline
export const setUserOffline = createAsyncThunk(
  "message/setUserOffline",
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        "/chat/offline",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to set offline status");
    }
  }
);

// ✅ Get online status
export const getOnlineStatus = createAsyncThunk(
  "message/getOnlineStatus",
  async ({ conversation_id }, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        `/chat/online-status?conversation_id=${conversation_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.participants;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get online status");
    }
  }
);

// ✅ Download authenticated file with CORS handling
export const downloadAuthenticatedFile = createAsyncThunk(
  'message/downloadAuthenticatedFile',
  async ({ filePath, fileName }, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      try {
        const response = await fetch(`/api/storage/messages/${filePath}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/octet-stream',
          },
          credentials: 'same-origin',
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || filePath.split('/').pop() || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return { success: true, fileName: fileName || filePath };
      } catch (fetchError) {
        console.log('Fetch failed, trying axios...', fetchError.message);
        const response = await axios.get(`/storage/messages/${filePath}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/octet-stream',
          },
          responseType: 'blob',
          withCredentials: false,
        });
        const blob = new Blob([response.data], {
          type: response.headers['content-type'] || 'application/octet-stream',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || filePath.split('/').pop() || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return { success: true, fileName: fileName || filePath };
      }
    } catch (error) {
      console.error('Download error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Download failed');
    }
  }
);

// ✅ Direct download - simple
export const downloadFileDirectSimple = async (filePath) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios({
        method: 'GET',
        url: `/storage/messages/${filePath}?token=${accessToken}`,
        responseType: 'blob',
        withCredentials: false,
      });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filePath.split('/').pop() || 'download';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      const response = await axios({
        method: 'GET',
        url: `/storage/messages/${filePath}`,
        headers: { 'Authorization': `Bearer ${accessToken}` },
        responseType: 'blob',
        withCredentials: false,
      });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filePath.split('/').pop() || 'download';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    }
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};

// ✅ Direct download
export const downloadFileDirect = (filePath) => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    const url = `/api/storage/messages/${filePath}?token=${accessToken}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = filePath.split('/').pop() || 'download';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Direct download failed:', error);
    throw error;
  }
};

// ✅ Iframe download (CORS workaround)
export const downloadWithIframe = (filePath) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.src = `/api/storage/messages/${filePath}?token=${accessToken}&download=1`;
    document.body.appendChild(iframe);
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 2000);
    return true;
  } catch (error) {
    console.error('Iframe download failed:', error);
    throw error;
  }
};

// ✅ Window.open download (CORS workaround)
export const downloadWithNewWindow = (filePath) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const url = `/api/storage/messages/${filePath}?token=${accessToken}&download=1`;
    const newWindow = window.open(url, '_blank', 'width=1,height=1');
    if (newWindow) {
      setTimeout(() => {
        newWindow.close();
      }, 1000);
    }
    return true;
  } catch (error) {
    console.error('New window download failed:', error);
    throw error;
  }
};

// ✅ MAIN SLICE
const messageSlice = createSlice({
  name: "message",
  initialState: {
    conversations: [],
    selectedConversation: null,
    messages: [],
    loading: false,
    error: null,
    typingUsers: {},
    onlineUsers: {}, // { userId: 'online' / 'offline' }
    creatingConversation: false,
    downloading: false,
    downloadError: null,
    downloadSuccess: null,
  },

  reducers: {

    // 1. Conversation select karna + unread count zero karna
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
      if (action.payload) {
        const idx = state.conversations.findIndex(
          (conv) => conv.id === action.payload.id
        );
        if (idx !== -1) {
          state.conversations[idx].unreadCount = 0;
        }
      }
    },

    clearMessages: (state) => {
      state.messages = [];
    },

    // 2. Naya message aana (real-time) - Chat window + Sidebar sync + WhatsApp style top
    addNewMessage: (state, action) => {
      const newMessage = action.payload;

      // A. Sirf selected conversation ka message chat window mein daalo
      if (state.selectedConversation?.id === newMessage.conversation_id) {
        const messageExists = state.messages.some(msg => msg.id === newMessage.id);
        if (!messageExists) {
          state.messages.push(newMessage);
        }
      }

      // B. Sidebar update: last message + unread count + top pe le aao (WhatsApp style)
      const convIdx = state.conversations.findIndex(
        (c) => c.id === newMessage.conversation_id
      );
      if (convIdx !== -1) {
        state.conversations[convIdx].lastMessage = newMessage.message;
        state.conversations[convIdx].lastMessageTime = newMessage.created_at;

        // Agar chat open nahi hai toh unread count barhao
        if (state.selectedConversation?.id !== newMessage.conversation_id) {
          state.conversations[convIdx].unreadCount =
            (state.conversations[convIdx].unreadCount || 0) + 1;
        }

        // 🔥 Conversation ko top par le aao (WhatsApp style)
        const [movedItem] = state.conversations.splice(convIdx, 1);
        state.conversations.unshift(movedItem);
      }
    },

    updateMessageStatus: (state, action) => {
      const { messageId, status } = action.payload;
      const message = state.messages.find(msg => msg.id === messageId);
      if (message) {
        message.read = status;
      }
    },

    setUserTyping: (state, action) => {
      const { conversationId, userId, isTyping } = action.payload;
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = {};
      }
      if (isTyping) {
        state.typingUsers[conversationId][userId] = true;
      } else {
        delete state.typingUsers[conversationId][userId];
      }
    },

    setMessagesForConversation: (state, action) => {
      const { messages } = action.payload;
      state.messages = messages;
    },

    clearConversationError: (state) => {
      state.error = null;
      state.creatingConversation = false;
    },

    clearDownloadStatus: (state) => {
      state.downloadError = null;
      state.downloadSuccess = null;
    },

    updateTypingUsers: (state, action) => {
      const { conversation_id, user_id, is_typing } = action.payload;
      if (!state.typingUsers[conversation_id]) state.typingUsers[conversation_id] = {};
      state.typingUsers[conversation_id][user_id] = is_typing;
    },

    clearTypingUser: (state, action) => {
      const { conversation_id, user_id } = action.payload;
      if (state.typingUsers[conversation_id]) {
        delete state.typingUsers[conversation_id][user_id];
      }
    },

    updateUserOnlineStatus: (state, action) => {
      const { user_id, status } = action.payload;
      state.onlineUsers[user_id] = status;
    },

    markMessagesAsReadByUser: (state, action) => {
      const { message_ids } = action.payload;
      state.messages = state.messages.map(msg =>
        message_ids.includes(msg.id) ? { ...msg, read: true } : msg
      );
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch messages
      .addCase(fetchMessages.pending, (state, action) => {
        if (!action.meta.arg.silent) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload.messages || [];
        if (!action.payload.silent) {
          state.loading = false;
        }
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        if (!action.meta.arg.silent) {
          state.loading = false;
        }
        state.error = action.payload;
      })

      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        const messageExists = state.messages.some(msg => msg.id === action.payload.id);
        if (!messageExists) {
          state.messages.push(action.payload);
        }
        // Khud bhejne par bhi sidebar top par aana chahiye (WhatsApp style)
        const convIdx = state.conversations.findIndex(
          (c) => c.id === action.payload.conversation_id
        );
        if (convIdx !== -1) {
          state.conversations[convIdx].lastMessage = action.payload.message;
          state.conversations[convIdx].lastMessageTime = action.payload.created_at;
          const [movedItem] = state.conversations.splice(convIdx, 1);
          state.conversations.unshift(movedItem);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create or find conversation
      .addCase(createOrFindConversation.pending, (state) => {
        state.creatingConversation = true;
        state.error = null;
      })
      .addCase(createOrFindConversation.fulfilled, (state, action) => {
        state.creatingConversation = false;
        const { conversation } = action.payload;
        if (conversation) {
          const existingIndex = state.conversations.findIndex(c => c.id === conversation.id);
          if (existingIndex !== -1) {
            state.conversations[existingIndex] = conversation;
          } else {
            state.conversations.push(conversation);
          }
          state.selectedConversation = conversation;
        } else {
          console.warn('No conversation returned from createOrFindConversation');
        }
      })
      .addCase(createOrFindConversation.rejected, (state, action) => {
        state.creatingConversation = false;
        state.error = action.payload;
      })

      // Download file
      .addCase(downloadAuthenticatedFile.pending, (state) => {
        state.downloading = true;
        state.downloadError = null;
        state.downloadSuccess = null;
      })
      .addCase(downloadAuthenticatedFile.fulfilled, (state, action) => {
        state.downloading = false;
        state.downloadSuccess = `File "${action.payload.fileName}" downloaded successfully`;
      })
      .addCase(downloadAuthenticatedFile.rejected, (state, action) => {
        state.downloading = false;
        state.downloadError = action.payload || 'Download failed';
      });
  },
});

// Export actions
export const {
  setSelectedConversation,
  clearMessages,
  addNewMessage,
  updateMessageStatus,
  setUserTyping,
  setMessagesForConversation,
  clearConversationError,
  clearDownloadStatus,
  updateTypingUsers,
  clearTypingUser,
  updateUserOnlineStatus,
  markMessagesAsReadByUser,

} = messageSlice.actions;

export default messageSlice.reducer;