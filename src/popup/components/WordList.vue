<template>
  <div>
    <ul class="list pl0">
      <li class="mb2" v-for="(word, index) in bannedWords">
        <span class="mr1 pv2 dib">{{word}}</span>
        <button v-on:click="removeWord(word)" class="w1 pa1 fr white bg-red bn">-</button>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    computed: mapGetters({
      bannedWords: 'allWords'
    }),
    methods: mapActions(['removeWord'])
  }
</script>

