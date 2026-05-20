import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: '1d3364e1e3ceb72dc540', 
    cluster: 'mt1',
    forceTLS: true,
    authEndpoint: 'https://portal.grapetask.co/broadcasting/auth', 
    auth: {
        headers: {
            // Yeh function har request par localStorage se fresh token uthayega
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`, 
            Accept: 'application/json',
        },
    },
});

export default echo;