import api from "./axios.js";

export const authApi = {
  register: (body) => api.post("/auth/register", body).then((r) => r.data),
  login: (body) => api.post("/auth/login", body).then((r) => r.data),
  me: () => api.get("/auth/me").then((r) => r.data),
  updateBrand: (body) => api.put("/auth/brand", body).then((r) => r.data),
};

export const aiApi = {
  caption: (body) => api.post("/ai/caption", body).then((r) => r.data),
  virality: (body) => api.post("/ai/virality", body).then((r) => r.data),
  trends: () => api.get("/ai/trends").then((r) => r.data),
  influencers: (params) => api.get("/ai/influencers", { params }).then((r) => r.data),
  strategy: () => api.get("/ai/strategy").then((r) => r.data),
};

export const postApi = {
  list: (params) => api.get("/posts", { params }).then((r) => r.data),
  create: (body) => api.post("/posts", body).then((r) => r.data),
  update: (id, body) => api.put(`/posts/${id}`, body).then((r) => r.data),
  remove: (id) => api.delete(`/posts/${id}`).then((r) => r.data),
};

export const inboxApi = {
  list: () => api.get("/inbox").then((r) => r.data),
  receive: (body) => api.post("/inbox", body).then((r) => r.data),
  reply: (id, body) => api.put(`/inbox/${id}/reply`, body).then((r) => r.data),
  heatmap: () => api.get("/inbox/heatmap").then((r) => r.data),
};

export const analyticsApi = {
  overview: () => api.get("/analytics/overview").then((r) => r.data),
  timeseries: () => api.get("/analytics/timeseries").then((r) => r.data),
  topPosts: () => api.get("/analytics/top-posts").then((r) => r.data),
};

export const influencerApi = {
  list: (params) => api.get("/influencers", { params }).then((r) => r.data),
};
