<template>
    <div class="w-full mx-auto">
        <FormHeader title="Generate Load" />
        <form action="#" class="grid sm:grid-cols-2" :class="{ 'opacity-50 pointer-events-none': isShowPreview }">
            <div class="input-form">
                <label for="date">Date</label>
                <input id="date" v-model="model.date" type="date" name="date" >
            </div>
            <div class="input-form">
                <label for="homeId">Home</label>
                <select id="homeId" v-model="model.homeId" name="homeId">
                    <option v-for="home in homes" :key="home" :value="home">{{ home }}</option>
                </select>
            </div>
            <div class="input-form">
                <label for="extra">Extra Amount/ Room</label>
                <input id="extra" v-model="model.extraAmount" type="number" name="extra">
            </div>
            <div class="input-form">
                <label for="load">Total usage (KW)</label>
                <input id="load" v-model="model.totalUsage" type="number" name="load">
            </div>
            <div class="input-form">
                <label for="usageAmount">Total Load Amount</label>
                <input id="usageAmount" v-model="model.usageAmount" type="text" name="usageAmount">
            </div>
            <div v-if="model.usageAmount > 0 && model.totalUsage > 0" class="input-form" >
                <label for="#">Amount for 1KW/h</label>
                <span class="text-red-500 h-[42px] bg-gray-100 rounded-sm flex items-center px-4"> {{ accountingWithoutRoundUp(model.usageAmount / model.totalUsage, 2) }} ៛/kwh</span>
            </div>
        </form>
        <div class="flex gap-2 mb-2">
            <TheButton1 v-if="!isShowPreview" name="Generate To Preview" type="tertiary" :loading="isLoading" @click="generateNewLoad"/>
            <TheButton1 v-if="isShowPreview" name="Save" type="primary" :loading="isLoading" @click="onSave"/>
            <TheButton1 v-if="isShowPreview" name="Reset" type="secondary" @click="onReset"/>
        </div>
        <LoadDetailTable v-if="isShowPreview" :is-loading="isLoading" :generated-load="generateLoad ?? {} as GenerateLoad" :is-show-action="false" />
    </div>
</template>
<script lang="ts" setup>
import { accountingWithoutRoundUp  } from '~/helpers/textFormatHelper';
import LoadDetailTable from '@/components/loads/LoadDetailTable.vue';

import useGenerateLoad from '~/composables/loads/useGenerateLoad';
import type { GenerateLoad } from '~/models/generateLoad';
const { model, generateNewLoad, isLoading, generateLoad, isShowPreview, homes, onSave, onReset } = useGenerateLoad();
</script>