import http from "./http";
const Api = process.env.REACT_APP_API;
const cancelRequest = async (id, _id) => {
  await http.delete(`${Api}/api/users/requests/${id}/${_id}`);
  await http.delete(`${Api}/api/users/requests/${_id}/${id}`);
};

const getUserById = async (id) => {
  const { data: user } = await http.get(`${Api}/api/users/${id}`);
  return user;
};
const getRequestsFromServer = async (id) => {
  const { data: requests } = await http.get(`${Api}/api/users/requests/${id}`);
  return requests;
};
const requestFriendship = async (id, _id) => {
  await http.post(`${Api}/api/users/${id}/requests`, {
    id: _id,
  });
};
const deleteFriend = async (id, _id) => {
  await http.delete(`${Api}/api/users/${id}/${_id}`);
  await http.delete(`${Api}/api/users/${_id}/${id}`);
};
const addFriend = async (id, _id) => {
  await http.post(`${Api}/api/users/${id}/friends`, { id: _id });
  await http.post(`${Api}/api/users/${_id}/friends`, { id });
};

export {
  getUserById,
  addFriend,
  deleteFriend,
  requestFriendship,
  cancelRequest,
  getRequestsFromServer,
};
