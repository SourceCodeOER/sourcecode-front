<template>
  <ValidationProvider ref="fileObserver" :tag="tag" :rules="rules" :name="name" :vid="vid" v-slot="{ errors }">
    <slot></slot>
    <input :id="name" name="archive" ref="inputFile" @change="selectedFile" class="input--secondary-color input__file"
           type="file">
    <label :for="name">
      <Icon type="archive" theme="theme--white"/>
      {{labelFileText}}</label>
    <span class="error-message">{{errors[0]}}</span>
    <slot name="footer"></slot>
    <span class="message message--red" v-if="filename"
          style="text-decoration: underline; cursor: pointer;"
          @click="deleteFile">Supprimer le fichier</span>
  </ValidationProvider>
</template>

<script lang="ts">
  import {ValidationProvider} from 'vee-validate';
  import {Component, Emit, Prop, Ref, Vue} from "vue-property-decorator";
  import Icon from "~/components/Symbols/Icon.vue";

  @Component({
    components: {
      Icon,
      ValidationProvider
    }
  })
  export default class TextInput extends Vue {

    @Prop({type: [String, Object], default: ''}) rules!: string | object;
    @Prop({type: String, default: ''}) name!: string;
    @Prop({type: String, default: undefined}) vid!: string | undefined;
    @Prop({type: String, default: 'div'}) tag!: string;
    @Prop({type:String, default: ''}) defaultFilename!:string;

    /**
     * Observer for the input file element
     */
    @Ref() inputFile!: HTMLInputElement;
    /**
     * Validation Observer for the zip archive and the url
     */
    @Ref() fileObserver!: InstanceType<typeof ValidationProvider>;

    /**
     * The name of the uploaded file
     * Default is null
     */
    filename: string | null = null;

    /**
     * Returns the name of the uploaded file or a default message instead
     */
    protected get labelFileText() {
      if (this.filename !== null) {
        if (this.filename.length > 18) {
          return this.filename.slice(0, 18) + '...'
        }

        return this.filename
      }

      return 'Choisir un fichier...'
    }


    @Emit()
    input(file: File | null) {
      return file;
    }

    /**
     * Get the file from the input file element
     */
    file(): File | null {
      const inputFile: any = this.fileObserver.value;
      if (!inputFile) {
        return null;
      }
      return inputFile
    }

    /**
     * Event for the changed state of the input file
     */
    async selectedFile() {
      const inputElement: HTMLInputElement = this.inputFile;
      const files = inputElement.files;
      if (files !== null) {
        const file: File | null = files.item(0);
        this.filename = file !== null ? file.name : null;
        await this.fileObserver.validate(file);
        this.input(file);
      }
    }

    /**
     * Delete file from input and reset the filename
     */
    deleteFile() {
      this.$nextTick(async () => {
        this.filename = null;
        this.inputFile.files = null;
        this.inputFile.value = '';
        this.fileObserver.value = undefined;
        this.fileObserver.reset();
        this.input(null);
      });
    }

    mounted() {
      this.filename = this.defaultFilename === '' ? null : this.defaultFilename;
    }

  }
</script>


<style lang="scss" scoped>
  label {
    align-self: flex-start;
  }
</style>
