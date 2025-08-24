<template>
    <div class="w-full relative">
        <TheHeader />
        <div class="min-h-[calc(100vh-60px)] mt-[52px] w-full mb-4">
            <slot/>
        </div>
        <TheFooter />
    </div>
</template>