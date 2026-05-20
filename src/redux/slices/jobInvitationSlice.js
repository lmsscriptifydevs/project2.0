import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "../../utils/axios";

const initialState = {
  invitations: [],
  isLoadingInvitations: false,
  error: null,
};

// ✅ Fetch job invitations
export const fetchJobInvitations = createAsyncThunk(
  "jobInvitation/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const userDataRaw = localStorage.getItem("UserData");
      const userId = userDataRaw ? JSON.parse(userDataRaw).id : null;

      if (!accessToken) {
        return rejectWithValue("Please log in to view job invitations.");
      }
      if (!userId) {
        return rejectWithValue("User ID not found. Please log in again.");
      }

      const { data } = await axios.get(`/expert/${userId}/job-invitations`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!data?.job_invitations) {
        throw new Error("Invalid response structure");
      }

      return data.job_invitations;
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || err.message;
      if (status === 401 || /unauthenticated/i.test(String(msg))) {
        return rejectWithValue("Please log in to view job invitations.");
      }
      return rejectWithValue(msg);
    }
  }
);

// ✅ Accept job invitation – try generic path first (backend authorizes from JWT), then expert-scoped
export const acceptJobInvitation = createAsyncThunk(
  "jobInvitation/accept",
  async (invitationId, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const userDataRaw = localStorage.getItem("UserData");
      const expertId = userDataRaw ? JSON.parse(userDataRaw)?.id : null;
      if (!accessToken) throw new Error("Authentication required");

      const id = Number(invitationId) || invitationId;
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };
      const body = { invitation_id: id };

      let data;
      let lastErr;

      // 1) Try generic path first – backend often authorizes current user from JWT and checks invitation.expert_id === user.id
      try {
        const res = await axios.post(`/job-invitations/${id}/accept`, body, { headers });
        data = res.data;
      } catch (e) {
        lastErr = e;
        const status = e?.response?.status;
        const msg = (e?.response?.data?.message || e?.response?.data?.error || e?.message || "").toLowerCase();

        // 2) If 404 or "not found", try expert-scoped URL (some backends use /expert/:id/job-invitations/:id/accept)
        if (status === 404 || msg.includes("not found")) {
          try {
            if (expertId != null) {
              const res = await axios.post(`/expert/${expertId}/job-invitations/${id}/accept`, body, { headers });
              data = res.data;
            } else {
              const res = await axios.post(`/expert/job-invitations/${id}/accept`, body, { headers });
              data = res.data;
            }
          } catch (e2) {
            lastErr = e2;
            if (e2?.response?.status === 404) {
              const res = await axios.post(`/expert/job-invitations/${id}/accept`, { invitation_id: id }, { headers });
              data = res.data;
            } else {
              throw e2;
            }
          }
        } else {
          throw e;
        }
      }

      if (!data?.message && !data?.status) {
        throw new Error("Invalid response structure");
      }

      return { message: data?.message || "Invitation accepted", invitationId: id };
    } catch (err) {
      const errData = err?.data ?? err?.response?.data ?? err;
      const msg = errData?.message ?? errData?.error ?? err?.message ?? (typeof err === 'string' ? err : 'Failed to accept invitation');
      return rejectWithValue(msg);
    }
  }
);

// ✅ Reject job invitation – try expert-scoped URL, then fallback
export const rejectJobInvitation = createAsyncThunk(
  "jobInvitation/reject",
  async ({ invitationId, reason }, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const userDataRaw = localStorage.getItem("UserData");
      const expertId = userDataRaw ? JSON.parse(userDataRaw)?.id : null;
      if (!accessToken) throw new Error("Authentication required");
      if (!reason.trim()) throw new Error("Rejection reason is required");

      const id = Number(invitationId) || invitationId;
      const body = { reason, invitation_id: id };
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };

      let data;
      try {
        const res = expertId != null
          ? await axios.post(`/expert/${expertId}/job-invitations/${id}/reject`, body, { headers })
          : await axios.post(`/expert/job-invitations/${id}/reject`, body, { headers });
        data = res.data;
      } catch (firstErr) {
        if (expertId != null && firstErr?.response?.status === 404) {
          const res = await axios.post(`/expert/job-invitations/${id}/reject`, body, { headers });
          data = res.data;
        } else {
          throw firstErr;
        }
      }

      if (!data?.message) {
        throw new Error("Invalid response structure");
      }

      return { message: data.message, invitationId, reason };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const jobInvitationSlice = createSlice({
  name: "jobInvitation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchJobInvitations.pending, (state) => {
        state.isLoadingInvitations = true;
        state.error = null;
      })
      .addCase(fetchJobInvitations.fulfilled, (state, action) => {
        state.invitations = action.payload ?? []; // ✅ payload is already array
        state.isLoadingInvitations = false;
        state.error = null;
      })
      .addCase(fetchJobInvitations.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoadingInvitations = false;
        toast.error(action.payload); // ✅ Added toast for fetch errors too
      })

      // ACCEPT
      .addCase(acceptJobInvitation.pending, (state) => {
        state.isLoadingInvitations = true;
        state.error = null;
      })
      .addCase(acceptJobInvitation.fulfilled, (state, action) => {
        const { invitationId } = action.payload; // ✅ FIXED bug
        state.invitations = state.invitations.map((inv) =>
          inv.id === invitationId ? { ...inv, status: "accepted" } : inv
        );
        state.isLoadingInvitations = false;
        toast.success("Invitation accepted!"); // ✅ kept toast
      })
      .addCase(acceptJobInvitation.rejected, (state) => {
        state.isLoadingInvitations = false;
        // Toast shown in component so user sees a single message (no duplicate)
      })

      // REJECT
      .addCase(rejectJobInvitation.pending, (state) => {
        state.isLoadingInvitations = true;
        state.error = null;
      })
      .addCase(rejectJobInvitation.fulfilled, (state, action) => {
        const { invitationId, reason } = action.payload;
        state.invitations = state.invitations.map((inv) =>
          inv.id === invitationId
            ? { ...inv, status: "rejected", rejectReason: reason }
            : inv
        );
        state.isLoadingInvitations = false;
        toast.success("Invitation rejected."); // ✅ kept toast
      })
      .addCase(rejectJobInvitation.rejected, (state, action) => {
        state.isLoadingInvitations = false;
        toast.error(action.payload || 'Failed to reject invitation');
        // Don't set state.error – keep showing list
      });
  },
});

export default jobInvitationSlice.reducer;
