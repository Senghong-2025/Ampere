<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-300 flex items-center justify-center p-2">
    <div class="max-w-3xl mx-auto p-6 bg-red-200/10 shadow-lg rounded-lg">
      <div class="flex justify-end mb-4">
        <TheButton1
          type="primary" :name="currentLanguage === 'en' ? 'Switch to Khmer' : 'ប្តូរទៅអង់គ្លេស'"
          @click="toggleLanguage" />
      </div>
      <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        {{ translations[currentLanguage].title }}
      </h1>
      <p class="text-lg text-gray-600 mb-4">
        {{ translations[currentLanguage].intro }}
      </p>

      <section class="mb-6">
        <h2 class="text-2xl font-semibold text-gray-700 mb-3">
          {{ translations[currentLanguage].basicNeeds.title }}
        </h2>
        <ul class="list-disc list-inside text-gray-600 space-y-2">
          <li v-for="item in translations[currentLanguage].basicNeeds.items" :key="item">
            {{ item }}
          </li>
        </ul>
      </section>

      <section class="mb-6">
        <h2 class="text-2xl font-semibold text-gray-700 mb-3">
          {{ translations[currentLanguage].communication.title }}
        </h2>
        <ul class="list-disc list-inside text-gray-600 space-y-2">
          <li v-for="item in translations[currentLanguage].communication.items" :key="item">
            {{ item }}
          </li>
        </ul>
      </section>

      <section class="mb-6">
        <h2 class="text-2xl font-semibold text-gray-700 mb-3">
          {{ translations[currentLanguage].workEconomy.title }}
        </h2>
        <ul class="list-disc list-inside text-gray-600 space-y-2">
          <li v-for="item in translations[currentLanguage].workEconomy.items" :key="item">
            {{ item }}
          </li>
        </ul>
      </section>

      <section class="mb-6">
        <h2 class="text-2xl font-semibold text-gray-700 mb-3">
          {{ translations[currentLanguage].transportation.title }}
        </h2>
        <ul class="list-disc list-inside text-gray-600 space-y-2">
          <li v-for="item in translations[currentLanguage].transportation.items" :key="item">
            {{ item }}
          </li>
        </ul>
      </section>

      <section class="mb-6">
        <h2 class="text-2xl font-semibold text-gray-700 mb-3">
          {{ translations[currentLanguage].healthSafety.title }}
        </h2>
        <ul class="list-disc list-inside text-gray-600 space-y-2">
          <li v-for="item in translations[currentLanguage].healthSafety.items" :key="item">
            {{ item }}
          </li>
        </ul>
      </section>

      <section class="mb-6">
        <h2 class="text-2xl font-semibold text-gray-700 mb-3">
          {{ translations[currentLanguage].technologyInnovation.title }}
        </h2>
        <ul class="list-disc list-inside text-gray-600 space-y-2">
          <li v-for="item in translations[currentLanguage].technologyInnovation.items" :key="item">
            {{ item }}
          </li>
        </ul>
      </section>

      <p class="text-lg text-gray-600">
        {{ translations[currentLanguage].conclusion }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const currentLanguage = ref<'en' | 'kh'>('en');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const translations: Record<'en' | 'kh', any> = {
  en: {
    title: 'Why We Need Electricity',
    intro: 'Electricity powers almost everything in our modern lives. Here are the main reasons:',
    basicNeeds: {
      title: 'Basic Needs & Comfort',
      items: [
        'Lighting our homes, streets, and workplaces.',
        'Running fans, air conditioning, and heating systems.'
      ]
    },
    communication: {
      title: 'Communication',
      items: [
        'Powering phones, computers, and the internet.',
        'Enabling TV, radio, and other media.'
      ]
    },
    workEconomy: {
      title: 'Work & Economy',
      items: [
        'Factories, offices, and shops depend on electricity for machines, computers, and tools.',
        'Banks, hospitals, schools, and government services rely on it to function.'
      ]
    },
    transportation: {
      title: 'Transportation',
      items: [
        'Trains, subways, and electric vehicles need electricity.',
        'Even traffic signals and airport systems depend on it.'
      ]
    },
    healthSafety: {
      title: 'Health & Safety',
      items: [
        'Hospitals need electricity for surgeries, life-support machines, and storing medicine.',
        'Security systems (CCTV, alarms) depend on electricity.'
      ]
    },
    technologyInnovation: {
      title: 'Technology & Innovation',
      items: [
        'Everything from robotics to space exploration depends on electric power.'
      ]
    },
    conclusion: 'Without electricity, modern society would slow down dramatically—similar to going back to pre-industrial times.'
  },
  kh: {
    title: 'ហេតុអ្វីយើងត្រូវការអគ្គិសនី',
    intro: 'អគ្គិសនីផ្តល់ថាមពលស្ទើរតែគ្រប់យ៉ាងនៅក្នុងជីវិតទំនើបរបស់យើង។ នេះជាហេតុផលសំខាន់ៗ៖',
    basicNeeds: {
      title: 'តម្រូវការមូលដ្ឋាន និងភាពសុខស្រួល',
      items: [
        'បំភ្លឺផ្ទះ ផ្លូវ និងកន្លែងធ្វើការ។',
        'ដំណើរការកង្ហារ ម៉ាស៊ីនត្រជាក់ និងប្រព័ន្ធកំដៅ។'
      ]
    },
    communication: {
      title: 'ទំនាក់ទំនង',
      items: [
        'ផ្តល់ថាមពលដល់ទូរស័ព្ទ កុំព្យូទ័រ និងអ៊ីនធឺណិត។',
        'ធ្វើឱ្យទូរទស្សន៍ វិទ្យុ និងប្រព័ន្ធផ្សព្វផ្សាយផ្សេងទៀតដំណើរការ។'
      ]
    },
    workEconomy: {
      title: 'ការងារ និងសេដ្ឋកិច្ច',
      items: [
        'រោងចក្រ ការិយាល័យ និងហាងទំនិញពឹងផ្អែកលើអគ្គិសនីសម្រាប់ម៉ាស៊ីន កុំព្យូទ័រ និងឧបករណ៍។',
        'ធនាគារ មន្ទីរពេទ្យ សាលារៀន និងសេវាកម្មរដ្ឋាភិបាលពឹងផ្អែកលើវាដើម្បីដំណើរការ។'
      ]
    },
    transportation: {
      title: 'ការដឹកជញ្ជូន',
      items: [
        'រថភ្លើង រថភ្លើងក្រោមដី និងយានយន្តអគ្គិសនីត្រូវការអគ្គិសនី។',
        'សូម្បីតែសញ្ញាចរាចរណ៍ និងប្រព័ន្ធអាកាសយានដ្ឋានក៏ពឹងផ្អែកលើវាដែរ។'
      ]
    },
    healthSafety: {
      title: 'សុខភាព និងសុវត្ថិភាព',
      items: [
        'មន្ទីរពេទ្យត្រូវការអគ្គិសនីសម្រាប់ការវះកាត់ ម៉ាស៊ីនជួយជីវិត និងការរក្សាទុកថ្នាំ។',
        'ប្រព័ន្ធសុវត្ថិភាព (CCTV សំឡេងរោទិ៍) ពឹងផ្អែកលើអគ្គិសនី។'
      ]
    },
    technologyInnovation: {
      title: 'បច្ចេកវិទ្យា និងការច្នៃប្រឌិត',
      items: [
        'អ្វីៗគ្រប់យ៉ាងចាប់ពីមនុស្សយន្តរហូតដល់ការរុករកអវកាសពឹងផ្អែកលើថាមពលអគ្គិសនី។'
      ]
    },
    conclusion: 'បើគ្មានអគ្គិសនីទេ សង្គមទំនើបនឹងបន្ថយល្បឿនយ៉ាងខ្លាំង—ស្រដៀងនឹងការត្រលប់ទៅសម័យមុនឧស្សាហកម្ម។'
  }
};

const toggleLanguage = () => {
  currentLanguage.value = currentLanguage.value === 'en' ? 'kh' : 'en';
};
</script>

<style scoped>
/* Ensure Khmer font rendering */
body {
  font-family: 'Noto Serif Khmer', sans-serif;
}
</style>