import { defineStore } from "pinia";
import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userList: [],
    loader: false
  }),

  getters: {

  },

  actions: {
    async getUsers() {
      await axios({
        method: 'get',
        url: `${apiURL}/user/list`,
        headers: { 'Authorization': `Bearer ${localStorage.accessToken}` }
      }).then(res => {
        this.userList = res.data
        console.log('GOT this.userList', this.userList)
      }).catch((error) => {
        console.log(error)
      })
    },
  }
});