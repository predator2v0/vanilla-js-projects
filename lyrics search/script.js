const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';

// search by song or artist
async function searchSongs(term) {
    const res = await fetch(`${apiURL}/suggest/${term}`);
    const data = await res.json();

    showData(data);
}
// show songs and artists in DOM
function showData(data) {
    // let output = '';
    // data.data.forEach((song) => {
    //     output += `
    //         <li>
    //             <span>
    //                 <strong>${song.artist.name}</strong> - ${song.title}
    //             </span>
    //             <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
    //         </li>
    //     `;
    // });
    // result.innerHTML = `
    //     <ul class="songs">
    //         ${output}
    //     </ul>
    // `;

    result.innerHTML = `
        <ul class="songs">
            ${data.data
                .map(
                    (song) => `<li>
                        <span>
                            <strong>${song.artist.name}</strong> - ${song.title}
                        </span>
                        <button
                            class='btn'
                            data-artist='${song.artist.name}'
                            data-songtitle='${song.title}'
                        >
                            Get Lyrics
                        </button>
                    </li>`
                )
                .join('')}
        </ul>
    `;

    if (data.prev || data.next) {
        more.innerHTML = `
            ${
                data.prev
                    ? `<button class="btn" onClick="getMoreSongs('${data.prev}')">Prev</button>`
                    : ''
            }
            ${
                data.next
                    ? `<button class="btn" onClick="getMoreSongs('${data.next}')">Next</button>`
                    : ''
            }
        `;
    } else {
        more.innerHTML = '';
    }
}

// get prev and next page results.
async function getMoreSongs(url) {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/corsdemo/${url}`);
    const data = await res.json();

    showData(data);
}

// get lyrics for song
async function getLyrics(artist, songTitle) {
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();
    
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

    result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2> <span>${lyrics}</span>`;
    more.innerHTML = '';
}

// event listeners
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value.trim();
    if (!searchTerm) {
        alert('please type in a search term!');
    } else {
        searchSongs(searchTerm);
    }
});

// get lyrics on button click
result.addEventListener('click', (e) => {
    const clickedEl = e.target;
    if (clickedEl.tagName === 'BUTTON') {
        const artist = clickedEl.getAttribute('data-artist');
        const songTitle = clickedEl.getAttribute('data-songtitle');
        getLyrics(artist, songTitle);
    }
});
