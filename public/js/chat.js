const socket = io();

const $message = document.getElementById("message-form");
const $messageFormInput = $message.querySelector("input");
const $messageFormButton = $message.querySelector("button");
const $sidebar = document.getElementById('sidebar')
const $messages = document.getElementById("messages");

// Templates
const messageTemplate = document.getElementById("message-template").innerHTML;
const locationsTemplate =
  document.getElementById("locations-template").innerHTML;
const sidebarTemplate =document.getElementById('sidebar-template').innerHTML
  // option 
 const {username , room }= Qs.parse(location.search,{ignoreQueryPrefix:true})
 
 const autoScrolling = () =>{
  // new message element
  $newMessage = $messages.lastElementChild

  // get height od the new message
  const newMessageStyles = getComputedStyle($newMessage) //to get styles for new mesage
  
  // get margin top
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)

  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  // get visible hright
  const visibleHeight = $messages.offsetHeight

  // height of message container
  const containerHeight = $messages.scrollHeight

  // how far have i scrolled?

  const scrolleOffset = $messages.scrollTop + visibleHeight

  if(containerHeight - newMessageHeight <= scrolleOffset){
      $messages.scrollTop = $messages.scrollHeight
  }

 }

socket.on("message", (message) => {
  console.log(message.text, message.createdAt);
  const html = Mustache.render(messageTemplate, {
    username:message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:m a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScrolling();
});

socket.on("locationMessage", (url) => {
  const locationHtom = Mustache.render(locationsTemplate, {
    username:url.username,
    location: url.location,
    createdAt: moment(url.createdAt).format("h:m a"),
  });
  $messages.insertAdjacentHTML("beforeend", locationHtom);
  autoScrolling();

});
$message.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = e.target.elements.message.value;
  $messageFormButton.setAttribute("disabled", "disabled");

  socket.emit("sendMessage", message,room, (err) => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    if (err) {
      return console.log(err);
    }
    console.log("the message was delivered!");
  });
});

socket.on('roomData',(room , users)=>{
  const html = Mustache.render(sidebarTemplate,{
    room,
    users
  })
  $sidebar.innerHTML = html
})
const $location = document.querySelector("#location");

$location.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("geolocation is not suported");
  }
  $location.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((postion) => {
    socket.emit(
      "sendLocation",
      {
        lat: postion.coords.latitude,
        long: postion.coords.longitude,
      },
      () => {
        console.log("the location was shard");
      }
    );
    $location.removeAttribute("disabled");
  });
});

socket.emit('join',{username , room},(error)=>{
  if(error){
    alert(error)
    location.href = '/'
  }
})