<template>

    <div v-bind:style="{ height:height+'px' }">first-page</div>

</template>

<script>
    export default {
        name: "firstPage",
        data:function() {
            return {
                height:200
            }
        },
        created: function () {
            this.height = window.innerHeight-145
        }
    }
</script>

<style scoped>

</style>
