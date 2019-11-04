<template>
  <div class="container">
    <div class="search-banner">
      <div class="input-wrapper">
        <SearchSymbol theme="red-theme"/>
        <input type="text" placeholder="Rechercher">
      </div>
    </div>

    <div class="wrapper">
      <FilterPanel/>
      <ExercisesPanel/>
    </div>
  </div>
</template>

<script>
    import FilterPanel from "../components/Panel/FilterPanel";
    import ExercisesPanel from "../components/Panel/ExercisesPanel";
    import SearchSymbol from "../components/Symbols/SearchSymbol";

    export default {
        components: {
            FilterPanel,
            ExercisesPanel,
            SearchSymbol
        }
    }
</script>

<style lang="scss" scoped>
  @import "./../assets/css/_variables";
  @import "./../assets/css/_function";
  @import "./../assets/css/_font";


  .container {
    width: calc(100% - #{$MENU_WIDTH});
    margin-left: auto;
    position: relative;
  }

  .wrapper {
    padding-left: $PADDING_CONTENT;
    padding-right: $PADDING_CONTENT;
    padding-top: $PADDING_TOP_CONTENT;
  }

  .search-banner {
    background-color: white;
    height: $BANNER_LOGO_HEIGHT;
    position: fixed;
    top: 0;
    width: calc(100% - #{$MENU_WIDTH});
    padding-left: $PADDING_CONTENT;
    padding-right: $PADDING_CONTENT;
    display: flex;
    align-items: center;

    .input-wrapper {
      width: 100%;
      position: relative;
    }

    input {
      width: 100%;
      padding-left: 50px;
    }

    svg {
      width: 15px;
      position: absolute;
      top: 50%;
      left: 20px;
      transform: translateY(-50%);
    }
  }
</style>
