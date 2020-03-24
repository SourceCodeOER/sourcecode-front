<template>
  <div class="editor">
    <client-only>

      <editor-content ref="editorContent" class="editor__content exercise-article" :editor="editor"/>

      <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
        <div class="menubar">

          <div class="menubar__button__wrapper">

            <button
              class="menubar__button"
              title="Mettre en gras"
              :class="{ 'button--grey-light-reverse': isActive.bold(), 'button--grey-light': !isActive.bold() }"
              @click="commands.bold"
            >
              <b>B</b>
            </button>

            <button
              class="menubar__button"
              title="Mettre en italic"
              :class="{ 'button--grey-light-reverse': isActive.italic(), 'button--grey-light': !isActive.italic() }"
              @click="commands.italic"
            >
              <i>i</i>
            </button>

            <button
              class="menubar__button"
              title="Barrer"
              :class="{ 'button--grey-light-reverse': isActive.strike(), 'button--grey-light': !isActive.strike() }"
              @click="commands.strike"
            >
              <del>S</del>
            </button>

            <button
              class="menubar__button"
              title="Souligner"
              :class="{ 'button--grey-light-reverse': isActive.underline(), 'button--grey-light': !isActive.underline() }"
              @click="commands.underline"
            >
              <u>u</u>
            </button>
          </div>


          <div class="menubar__button__wrapper">


            <button
              class="menubar__button"
              title="Paragraphe"
              :class="{ 'button--grey-light-reverse': isActive.paragraph(), 'button--grey-light': !isActive.paragraph() }"
              @click="commands.paragraph"
            >
              p
            </button>

            <button
              class="menubar__button menubar__button--with-icon"
              title="Citation"
              :class="{ 'button--grey-light-reverse': isActive.blockquote(), 'button--grey-light': !isActive.blockquote() }"
              @click="commands.blockquote"
            >
              <Icon type="quote" :theme="isActive.blockquote() ? 'theme--white' : 'theme--grey-light'"/>
            </button>

            <button
              class="menubar__button menubar__button--with-icon button--grey-light"
              title="Séparateur horizontal"
              @click="commands.horizontal_rule"
            >
              <Icon type="lineH" theme="theme--grey-light"/>
            </button>

          </div>
          <div class="menubar__button__wrapper">


            <button
              class="menubar__button"
              :class="{ 'button--grey-light-reverse': isActive.heading({ level: 2 }), 'button--grey-light': !isActive.heading({ level: 2 }) }"
              title="Titre de niveau 2"
              @click="commands.heading({ level: 2 })"
            >
              H2
            </button>

            <button
              class="menubar__button"
              :class="{ 'button--grey-light-reverse': isActive.heading({ level: 3 }), 'button--grey-light': !isActive.heading({ level: 3 }) }"
              title="Titre de niveau 3"
              @click="commands.heading({ level: 3 })"
            >
              H3
            </button>
          </div>

          <div class="menubar__button__wrapper">


            <button
              class="menubar__button"
              :class="{ 'button--grey-light-reverse': isActive.bullet_list(), 'button--grey-light': !isActive.bullet_list() }"
              title="Liste à puces"
              @click="commands.bullet_list"
            >
              ul
            </button>

            <button
              class="menubar__button"
              title="Liste ordonnée"
              :class="{ 'button--grey-light-reverse': isActive.ordered_list(), 'button--grey-light': !isActive.ordered_list() }"
              @click="commands.ordered_list"
            >
              ol
            </button>

          </div>

          <div class="menubar__button__wrapper">

            <button
              class="menubar__button menubar__button--with-icon"
              :class="{ 'button--grey-light-reverse': isActive.code_block(), 'button--grey-light': !isActive.code_block() }"
              @click="commands.code_block"
              title="Bloc de code"
            >
              <Icon type="codeBlock" :theme="isActive.code_block() ? 'theme--white' : 'theme--grey-light'"/>
            </button>

            <button
              class="menubar__button menubar__button--with-icon"
              :class="{ 'button--grey-light-reverse': isActive.code(), 'button--grey-light': !isActive.code() }"
              title="Code sur une ligne"
              @click="commands.code"
            >
              <Icon type="codeBasic" :theme="isActive.code() ? 'theme--white' : 'theme--grey-light'"/>
            </button>


          </div>

          <div class="menubar__button__wrapper">

            <button
              class="menubar__button menubar__button--with-icon button--grey-light"
              @click="commands.undo"
              title="Revenir en arrière"
            >
              <Icon type="undo" theme="theme--grey-light"/>

            </button>

            <button
              class="menubar__button menubar__button--with-icon button--grey-light"
              @click="commands.redo"
              title="Revenir en avant"
            >
              <Icon type="redo" theme="theme--grey-light"/>
            </button>
          </div>


        </div>
      </editor-menu-bar>

    </client-only>

  </div>

</template>

<script lang="ts">
  import {Editor, EditorContent, EditorMenuBar} from 'tiptap'
  import javascript from 'highlight.js/lib/languages/javascript'
  import css from 'highlight.js/lib/languages/css'
  import java from 'highlight.js/lib/languages/java'
  import python from 'highlight.js/lib/languages/python'
  import cmake from 'highlight.js/lib/languages/cmake'
  import cs from 'highlight.js/lib/languages/cs'
  import Icon from "~/components/Symbols/Icon.vue";
  import {
    Blockquote,
    CodeBlock,
    HardBreak,
    Heading,
    HorizontalRule,
    OrderedList,
    BulletList,
    ListItem,
    TodoItem,
    TodoList,
    Bold,
    Code,
    Italic,
    Link,
    Strike,
    Underline,
    History,
    CodeBlockHighlight,
    Placeholder
  } from 'tiptap-extensions'
  import {Component, Prop, Ref, Vue} from "vue-property-decorator";

  @Component({
    components: {
      EditorContent,
      EditorMenuBar,
      Icon
    }
  })
  export default class RichTextEditor extends Vue {
    editor: null | any = null;
    @Ref() editorContent!: InstanceType<typeof EditorContent>;
    @Prop({type: String, default: ''}) defaultContent!: string;

    content: string = '';

    mounted() {
      const obj: { extensions: any[], content?: string, onUpdate?: (event: any) => void, onInit?: (event: any) => void } = {
        onUpdate: ({getHTML}) => {
          this.content = getHTML();
        },
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({levels: [2, 3]}),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
          new Placeholder({
            showOnlyCurrent: true,
            emptyNodeText: 'Entrez votre description...'
          }),
          new CodeBlockHighlight({
            languages: {
              javascript,
              css,
              python,
              java,
              cmake,
              cs
            }
          })
        ]
      };

      if (this.defaultContent !== '') {
        obj.content = this.defaultContent;
        this.content = this.defaultContent;
      }

      this.editor = new Editor(obj)
    }

    beforeDestroy() {
      if (this.editor !== null) {
        this.editor.destroy()
      }
    }

    /**
     * Reset the text editor
     * @param content
     */
    reset(content: string = '<p></p>') {
      this.editor.setContent(content);
    }

    /**
     * Check if the text editor is empty
     */
    get isEmpty(): boolean {
      return this.content === '<p></p>' || this.content === '<p><br></p>' || this.content === '';
    }
  }
</script>

<style lang="scss">
  @import '../../assets/css/editor';
</style>
