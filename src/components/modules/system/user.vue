<template>
    <div v-bind:style="{ height:height+'px' }">user-page</div>
</template>

<script>
    export default {
        name: "user",
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
