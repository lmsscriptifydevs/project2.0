import { combineReducers } from 'redux';
import allGigsSlice from './slices/allGigsSlice';
import allOrderSlice from './slices/allOrderSlice';
import getBidPackages from './slices/bidsSlice';
import blogSlice from './slices/blogSlice';
import buyerRequestSlice from './slices/buyerRequestSlice';
import dashboardSlice from './slices/dashboardSlice';
import gigsSlice from './slices/gigsSlice';
import jobInvitationSlice from './slices/jobInvitationSlice';
import messageSlice from './slices/messageSlice';
import notificationsSlice from './slices/notificationsSlice';
import offersSlice from './slices/offersSlice';
import orderSlice from './slices/orderSlice';
import profileSlice from './slices/profileSlice';
import projectSlice from './slices/projectSlice';
import ratingSlice from './slices/ratingSlice';
import skillsSlice from './slices/skillsSlice';
import userSlice from './slices/userSlice';
import usersSlice from './slices/usersSlice';
import withdrawalSlice from './slices/withdrawalSlice';

const rootReducer = combineReducers({
  user: userSlice,
  users: usersSlice,
  withdrawal: withdrawalSlice,
  profile: profileSlice,
  gig: gigsSlice,
  allGigs: allGigsSlice,
  dashboard: dashboardSlice,
  skills: skillsSlice,
  rating: ratingSlice,
  allOrder: allOrderSlice,
  buyer: buyerRequestSlice,
  offers: offersSlice,
    blogs: blogSlice,
    orders: orderSlice,
    message: messageSlice,
    jobInvitation: jobInvitationSlice,
project: projectSlice,
  bids:getBidPackages,
  notifications: notificationsSlice,
});


export default rootReducer;