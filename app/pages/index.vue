<template>
   <div class="min-h-screen flex items-center w-full justify-center">
        <!-- <div>Hello Home Page!</div> -->
        <div class="h-full flex justify-center items-center w-full">
            <!-- <iframe src="https://trm-7pr.pages.dev" frameborder="0" class="min-h-screen" style="height: 100%; width: 100%;" /> -->
            <button @click="test">TEST</button>
        </div>
   </div>
</template>
<script lang="ts" setup>
import { addDoc, collection } from 'firebase/firestore';
const { $db } = useNuxtApp();

const test = async () => {
    try {
    const docRef = await addDoc(collection($db, "users"), {
      first: "Ada",
      last: "Lovelace",
      born: 1815
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
</script>