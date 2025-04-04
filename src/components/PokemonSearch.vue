<template>
    <div class="form-control">
        <div class="relative">
            <input type="text" class="w-full pr-40 bg-gray-200 input input-lg text-black" placeholder="Search..." @change=handleChange />
            <button type="button" class="absolute top-0 right-0 rounded-l-none w-36 btn btn-primary btn-lg">Search</button>
        </div>
    </div>
</template>

<script setup lang="ts">

const handleChange = (e: Event) => {
    console.log(">>> Changed: ", e.target?.value)
}

</script>