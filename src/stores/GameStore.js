import { defineStore } from "pinia";

export const useGameStore = defineStore('gameStore', {
  state: () => ({
    currentGame: {},
    currentCharacter: {},
    currentCharData: {}
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
    updateCurrentCharacter() {
      this.currentCharacter = this.currentGame.characters.find(e => e.id === this.currentCharacter.id)
    }
  }
});