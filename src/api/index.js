const axios = require("axios");
var crypto = require("crypto");
import Vue from "vue";

const API_URL = window.location.origin.replace(":8000", ":8001");
const api = axios.create({
  baseURL: API_URL,
  timeout: 100000
});
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  err => Promise.reject(err)
);
const notify = function(message, type) {
  if (!type) type = "success";
  Vue.$toast.open({ message: message, type: type, position: "top" });
};
const toDropdown = function() {
  if (!this.length) return [];
  var obj = this[0];
  var text, value;
  for (var x in obj) {
    if (!value) value = x;
    else if (!text) text = x;
    else break;
  }
  return this.map(d => {
    return {
      ...d,
      text: d[text],
      value: d[value]
    };
  });
};
const toXML = function(array, spacey) {
  if (!array) return "";

  var sxml = "";
  for (var i = 0; i < array.length; i++) {
    sxml += "{row ";
    for (let x in array[i]) {
      if (array[i][x] !== null) {
        if (spacey && array[i][x] && array[i][x].replace)
          sxml +=
            x +
            '="' +
            (array[i][x].replace
              ? array[i][x].replace(/\s/g, spacey)
              : array[i][x]) +
            '" ';
        else
          sxml +=
            x +
            '="' +
            (typeof array[i][x] == "boolean"
              ? array[i][x]
                ? 1
                : 0
              : array[i][x]) +
            '" ';
      }
    }
    sxml += "/}";
  }
  return sxml;
};
export default {
  url: API_URL,
  async login(params) {
    let { username, password } = params;
    if (password)
      password = crypto
        .createHash("md5")
        .update(params.password)
        .digest("hex");
    let { data } = await api.post("/api/login", {
      _Username: username,
      _Password: password
    });
    if (data.message) notify(data.message, data.success ? "success" : "error");
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data.data;
  },
  logout() {
    localStorage.setItem("token", null);
  },
  async getOne(sp, params) {
    let d = await this.call(sp, params);
    if (d.data.length) return d.data[0];
    else return {};
  },
  async call(sp, params) {
    sp = sp.replace(".", "_");
    for (var x in params) {
      if (typeof params[x] == "object") {
        if (params[x] && params[x].type == "Buffer")
          params[x] = params[x][0] === 1;
        else if (params[x] && params[x].length !== undefined) {
          params[x] = toXML(params[x]);
        }
      } else if (x.match(/Password/) && params[x].length < 32) {
        params[x] = crypto
          .createHash("md5")
          .update(params[x])
          .digest("hex");
      }
    }
    let { data } = await api.post(`/api/call/${sp}`, params);
    if (data.message) {
      notify(data.message, data.success ? "success" : "error");
      if (data.message.match(/Not authorized/))
        window.location = "/Main/App/Logout";
    }

    return data;
  },
  async select(obj, params) {
    let { data } = await api.post(`/api/select/${obj}`, params);
    if (data.message) notify(data.message, data.success ? "success" : "error");
    data.toDropdown = toDropdown.bind(data.data);
    return data;
  },
  async upload(params) {
    let { data } = await api.post(`/api/upload`, params, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return data;
  },
  async download(url) {
    var iframe = document.createElement("IFRAME");
    iframe.className = "hide";
    iframe.src = url.match(/^\//)
      ? API_URL.replace(":8000", ":8001") + url
      : url;
    document.body.appendChild(iframe);
    setTimeout(function() {
      iframe.remove();
    }, 10000);
  },
  async post(url, params, opts) {
    let { data } = await api.post(url, params, opts);
    return data;
  },
  async get(url, opts) {
    let { data } = await api.get(url, opts);
    return data;
  },
  async fromOutside(opts) {
    return axios(opts);
  }
};
