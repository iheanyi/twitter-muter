<template>
  <div class="db mb2">
    <h1>Add Words</h1>
    <word-list></word-list>
    <add-word></add-word>
  </div>
</template>

<script>
  import WordList from './components/WordList.vue';
  import AddWord from './components/AddWord.vue';

  export default {
    components: {
      WordList,
      AddWord
    }
  }
</script>

