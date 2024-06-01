import axios from "axios";

export const customFetch = axios.create({
  baseURL: 'http://192.168.1.7/api/' ,
});
