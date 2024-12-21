import { defineStore } from "pinia";
import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL

export const useGameStore = defineStore('gameStore', {
  state: () => ({
    currentGame: {},
    currentCharacter: {},
    currentCharData: {},
    toast: {}
  }),

  getters: {
    getCurrentCharData() {
      return this.currentCharacter.charData ? JSON.parse(this.currentCharacter.charData) : {}
    },
    getCurrentCharItems() {
      return this.currentCharacter.charData ? JSON.parse(this.currentCharacter.charData).items : {}
    },
  },

  actions: {
    setCurrentCharacter(index) {
      this.currentCharacter = this.currentGame.characters[index]
      this.currentCharData = this.currentCharacter.charData ? JSON.parse(this.currentCharacter.charData) : {}
    },
    setCurrentCharacterValue(character) {
      this.currentCharacter = character
      this.currentCharData = character.charData ? character.charData : {}
    },
    updateCurrentCharacter() {
      this.currentCharacter = this.currentGame.characters.find(e => e.id === this.currentCharacter.id)
    },

    async updateGamePlayers(players) {
      const game = {
        id: this.currentGame.id,
        players: players
      }
      await axios({
        method: 'post',
        url: `${apiURL}/game/update/players`, 
        data: { game }, 
        headers: { 'Authorization': `Bearer ${localStorage.accessToken}` } 
      // }).then(res => {
      //   this.toast = {
      //     severity: 'success', summary: `Players updated in game ${res.data.name}!`, detail: ``, life: 3000
      //   };
      }).catch(error => {
        this.toast = {
          severity: 'error', summary: 'An error occured when creating a game', detail: error.response.data.error, life: 10000
        };
      })
    },

    async removePlayers(players) {
      const game = {
        id: this.currentGame.id,
        players: players
      }
    
      await axios({
        method: 'post',
        url: `${apiURL}/game/remove/player`, 
        data: { game }, 
        headers: { 'Authorization': `Bearer ${localStorage.accessToken}` } 
      }).then(res => {
        this.toast = { 
          severity: 'success', 
          summary: `Players removed!`, 
          detail: ``, 
          life: 3000 
        };
        this.currentGame = res.data.updatedGame    
      }).catch(error => {
        console.log(error.message)
        this.toast = {
          severity: 'error', 
          summary: 'An error occured when creating a game', 
          detail: error.response.data.error, 
          life: 10000
        };
      })
    }
  }
});