<script lang="ts">
  import {Component, Vue, Prop} from 'vue-property-decorator'

  @Component({
    name: 'SymbolLogo'
  })
  export default class Symbol extends Vue {
    @Prop({type: String, default: "theme--default"}) readonly theme?: string;

    get themeStroke() {
      return this.theme + '--stroke';
    }
  }
</script>
