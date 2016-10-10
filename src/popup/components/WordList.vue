<template>
  <ul class="list pl0">
  <li v-for="(word, index) in bannedWords">
    <span class="mr1 pv2 dib">{{word}}</span>
    <button v-on:click="removeWord(index)" class="fr white bg-red bn"></button>
  </li>

  </ul>
</template>

<script>
  import { mapActions } from 'vuex';

  console.log(this);
  console.log(this.$store);
  export default {
    data: blacklistedWords,
    methods: mapActions(['removeWord'])
  }
</script>

