const axios = jest.fn(() => Promise.resolve({
  headers: { openlaw_jwt: '' },
  data: {},
}));

axios.get = jest.fn(() => Promise.resolve({
  headers: { openlaw_jwt: '' },
  data: {},
}));

export default axios;
