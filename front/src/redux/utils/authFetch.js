import axios from "axios";


export const fetchReg = async (login, fullName, email, password, url = "http://localhost:5000/users") => {
  const { data } = await axios.post(url, {
    login,
    fullName,
    email,
    password
  })

  if (data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', data.login);

  }
  return data;
};


export const fetchLogin = async (login, password, url = "http://localhost:5000/users/login") => {
  const { data } = await axios.post(url, {
    login,
    password
  })
  if (data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', data.login);
  }
  return data;
};

export const fetchAllFriends = async (isAuth, url = "http://localhost:5000/users/contacts/all") => {
  const { data } = await axios.post(url, {
    isAuth
  })
  return data;
};


export const fetchAddNewContact = async (fullName, login, number, isAuth, url = "http://localhost:5000/chats") => {
  const { data } = await axios.post(url, {
    fullName,
    login,
    number,
    isAuth
  })
  return data;
};


export const fetchStartChat = async (chat, url = "http://localhost:5000/chats") => {
  debugger
  const { data } = await axios.get(url, {
    params: {
      id: chat
    }
  })
  debugger
  return data;
};

