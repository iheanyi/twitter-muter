<template>
  <div class="db mb2 cf w-100">
    <form class="flex" @submit.prevent="addWord">
      <input class="pa2 fl mr2 w-80" v-model="inputWord" 
      placeholder="Enter word/hashtag/username you want to block." />
      <button type='submit' @click="addWord" class="cursor-pointer f6 bold
      content-end pv2 ph1 w2 pa2 bg-blue white ba bw1 btn b--blue">+</button>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    data: function() {
      return {
        inputWord: ''
      };
    },
    methods: {
      addWord() {
        if(this.inputWord.trim().length > 0) {
          window.analytics.track('Add Word', {
            word: this.inputWord.trim()
          });

          this.$store.dispatch('addWord', this.inputWord.trim());
          this.inputWord = '';
        }
      }
    }
  }
</script>
