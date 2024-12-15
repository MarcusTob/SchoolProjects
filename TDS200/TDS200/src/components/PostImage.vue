<script setup lang="ts">
type Props= {
    imageUrl: string;  
}
const props = defineProps<Props>();
</script>

<template>
    <img class="post-image" :src="imageUrl" alt="post image"/>
</template>

<style scoped>
.post-image {
    width: 100%;
    object-fit:contain;
    display: block;
    padding: 2%;
}
</style>