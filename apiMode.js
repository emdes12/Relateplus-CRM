import axios from "axios";

/*
    Depending you need, comment out appropriately
    1. The first one is for Production - i.e working online with railway backend (which you'll need to dump your local dump to regularly)
    2. The Second one is for Development (which means you working with local backend)
*/

// 1. The Railway backend link to connect

// export default apiMode = axios.create({
//   baseURL: "https://relate-server-production.up.railway.app/",
//   // withCredentials: true // Optional: for cookies/sessions
// });

// 2. the Local backend for dev

const apiMode = axios.create({
  baseURL: "http://localhost:4123", // Change this for production
  // withCredentials: true // Optional: for cookies/sessions
});

export default apiMode;