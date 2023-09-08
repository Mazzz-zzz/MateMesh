// contentScript.js
let observer = new MutationObserver(() => {
    let element = document.querySelector('[aria-label="Chats"]');
    console.log(element)
    if (element) {
        observer.disconnect(); // Stop observing when element is found

        // Find all divs that represent a chat message
        let chatDivs = element.querySelectorAll('div[role="listitem"]');

        let data = [];

        chatDivs.forEach(div => {
            // Find the image tag which contains the profile picture
            let img = div.querySelector('img[alt="User avatar"]');
            console.log(img)
            let profilePicture = img ? img.src : null;

            // Find the span tag which contains the user's name
            let nameSpan = div.querySelector('span.x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft');
            let name = nameSpan ? nameSpan.textContent : null;
            console.log(name)
            if (profilePicture && name) {
                data.push({name: name, profilePicture: profilePicture});
            }
        });
        console.log(data)
        chrome.runtime.sendMessage({action: "dataFetched", data: data});
    }
});

// Start observing
console.log("start script....")
observer.observe(document.body, {childList: true, subtree: true});
