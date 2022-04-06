const generateMessage = (username,text) => {
  return {
    username,
    text: text,
    createdAt: new Date().getTime(),
  };
};

const generateLocationMessage = (username,location) => {
  return {
    username,
    location,
    createdAt: new Date().getTime(),
  };
};
module.exports = { generateMessage, generateLocationMessage };
