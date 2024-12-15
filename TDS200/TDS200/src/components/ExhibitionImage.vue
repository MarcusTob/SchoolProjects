<script setup lang="ts">
type Props= {
    imageUrl: string;  
}
const props = defineProps<Props>();
</script>

<template>
    <img class="xhib-image" :src="imageUrl" alt="post image"/>
</template>

<style scoped>
.xhib-image {
    width: 100%;
    object-fit:contain;
    display: block;
}
</style>