<template>
  <div class="db mb2 cf w-100">
    <input class="pa2 fl w-80" v-model="inputWord" placeholder="Input word or
    phrase you want to block." />
    <button v-on:click="addWord" class="pv2 ph1 w-10 bg-blue white fr ba bw1
    b--blue">+</button>
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
          this.$store.dispatch('addWord', this.inputWord);
          this.inputWord = '';
        }
      }
    }
  }
</script>
