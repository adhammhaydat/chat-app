const users = [];

// addUser , removeUser , getUser , getUsersInRoom

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  // validat the data
  if (!username || !room) {
    return {
      error: "username or room are requered",
    };
  }
  // check for existing user
  const exisitingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });
  // validat username
  if (exisitingUser) {
    return {
      error: "username is in use",
    };

  }
  // store user
  const user = { id, username, room };
   users.push(user);
   return {
     user
   }
};

const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id;
  });
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  return users.find((user) =>user.id === id)
 
};

const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase()
  return users.filter((user) => {
    return user.room === room;
  })
};

module.exports = {
  addUser,
  getUser,
  getUsersInRoom,
  removeUser
}
