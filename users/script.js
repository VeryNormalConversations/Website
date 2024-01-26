document.addEventListener("DOMContentLoaded", function() {
    const userIds = ['895724257076711434', '1158863724317249707', '1052290524427591731','1122272031417827358','783078812614131723','719917107575390249']; // User IDs in desired order
    fetchUsersSequentially(userIds, 0);
});

function fetchUsersSequentially(userIds, index) {
    if (index < userIds.length) {
        const userId = userIds[index];
        fetchPresenceData(userId, () => fetchUsersSequentially(userIds, index + 1));
    }
}

function fetchPresenceData(userId, callback) {
    const apiUrl = `https://api.lanyard.rest/v1/users/${userId}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                createUserPresenceElement(data.data);
                callback(); // Proceed to next user
            } else {
                console.error('Failed to fetch data for user:', userId);
                callback(); // Proceed to next user even if current fetch fails
            }
        })
        .catch(error => {
            console.error('Error:', error);
            callback(); // Proceed to next user in case of error
        });
}

function createUserPresenceElement(userInfo) {
    const container = document.getElementById('discord-presences');
    const userDiv = document.createElement('div');
    userDiv.className = 'user-presence';

    // Determine the class for the status ring
    let statusClass = '';
    switch (userInfo.discord_status) {
        case 'online':
            statusClass = 'status-online';
            break;
        case 'idle':
            statusClass = 'status-idle';
            break;
        case 'dnd':
            statusClass = 'status-dnd';
            break;
        case 'offline':
            statusClass = 'status-offline';
            break;
        default:
            statusClass = 'status-offline'; // Default status if none of the above
            break;
    }

    userDiv.innerHTML = `
        <div class="user-info">
            <div class="act">Activity:</div>
            <img class="avatar ${statusClass}" src="https://cdn.discordapp.com/avatars/${userInfo.discord_user.id}/${userInfo.discord_user.avatar}.png" alt="User Avatar">
            <h2>${userInfo.discord_user.username}</h2>
            <p>Status: ${userInfo.discord_status}</p>
        </div>
    `;
    
    if (userInfo.listening_to_spotify) {
        userDiv.innerHTML += `
            <div class="spotify-info">
                <div class="text-content">
                    <h3>Listening to Spotify</h3>
                    <p>Song: ${userInfo.spotify.song}</p>
                    <p>Artist: ${userInfo.spotify.artist}</p>
                </div>
                <img class="album-art" src="${userInfo.spotify.album_art_url}" alt="Album Art">
            </div> 
        `;
    }

    container.appendChild(userDiv);
}
