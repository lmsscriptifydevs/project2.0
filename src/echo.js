import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';

window.Pusher = Pusher;

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    if (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')) {
      return window.location.origin.replace(':3000', ':8000');
    }
  }
  return 'https://portal.grapetask.co';
};

const echo = new Echo({
    broadcaster: 'pusher',
    key: '1d3364e1e3ceb72dc540', 
    cluster: 'mt1',
    forceTLS: true,
    authorizer: (channel, options) => {
        return {
            authorize: (socketId, callback) => {
                const token = localStorage.getItem('accessToken');
                axios.post(`${getBaseUrl()}/broadcasting/auth`, {
                    socket_id: socketId,
                    channel_name: channel.name
                }, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : '',
                        Accept: 'application/json'
                    }
                })
                .then(response => {
                    callback(false, response.data);
                })
                .catch(error => {
                    callback(true, error);
                });
            }
        };
    }
});

export default echo;