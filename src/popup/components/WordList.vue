<template>
  <div>
    <ul class="list pl0">
      <li class="mb2 flex" v-for="(word, index) in bannedWords">
        <span class="w-100 f6 mr1 pv2 dib">{{word}}</span>
        <div class="items-end">
          <button type='button' @click="removeWord(word)" class="f6 content-end w2
            pa2 white bg-red bn btn cursor-pointer">-</button>
        </div>
      </li>
    </ul>
    <div v-if="bannedWords.length === 0">
      <p class="f6">You haven't added any banned words yet.</p>
    </div>
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

