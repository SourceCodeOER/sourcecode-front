<template>
  <div class="rating">
    <span v-for="i in nbOfStars" :key="i" @click="rate(i)">
      <Icon theme="theme--primary-color" :type="currentRate >= i ? 'star' : 'starEmpty'"/>
    </span>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";
  import Icon from "../Symbols/Icon.vue";

  @Component({
    components: {Icon}
  })
  export default class Rating extends Vue {
    @Prop({type: Number, default: 5}) nbOfStars!: number;
    @Prop({type: Number, default: 0}) rating!: number;

    currentRate:number = this.rating;

    rate(i: number) {
      this.currentRate = i;
      this.$emit('rating', i)
    }
  }
</script>

<style lang="scss" scoped>
  .rating {
    display: flex;
    flex-wrap: wrap;

    span {
      cursor: pointer;
    }

    svg {
      width: 25px;
    }
  }
</style>
