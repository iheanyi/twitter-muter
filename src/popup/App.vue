<template>
  <div id="app">

  <h1>Add Words</h1>
      <ul>
        <li v-for="(word, index) in blacklistedWords">
          <span class="mr1 pv2 dib">{{word}}</span>
          <button v-on:click="removeWord(index)" class="fr white bg-red bn">-</button>
        </li>
      </ul>

      <div class="db">
        <form v-on:submit="addWord">
          <input v-model="bannedWord" placeholder="Add Banned Word">
          <button v-on:click="addWord" class="bg-blue white fr bn">+</button>
        </form>
      </div>
  </div>
</template>

<script>
import WordList from './components/WordList.vue';

export default {
  components: {
    WordList
  }
}
</script>

