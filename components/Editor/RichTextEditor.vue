<template>
  <div class="editor">
    <client-only>
      <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
        <div class="menubar">

          <button
            class="menubar__button"
            :class="{ 'button--ternary-color-reverse': isActive.bold(), 'button--ternary-color': !isActive.bold() }"
            @click="commands.bold"
          >
            <b>B</b>
          </button>

          <button
            class="menubar__button"
            :class="{ 'button--ternary-color-reverse': isActive.italic(), 'button--ternary-color': !isActive.italic() }"
            @click="commands.italic"
          >
            <i>i</i>
          </button>

          <button
            class="menubar__button"
            :class="{ 'button--ternary-color-reverse': isActive.strike(), 'button--ternary-color': !isActive.strike() }"
            @click="commands.strike"
          >
            <del>S</del>
          </button>

          <button
            class="menubar__button"
            :class="{ 'button--ternary-color-reverse': isActive.underline(), 'button--ternary-color': !isActive.underline() }"

            @click="commands.underline"
          >
            <u>u</u>
          </button>

          <button
            class="menubar__button menubar__button--with-icon"
            :class="{ 'button--ternary-color-reverse': isActive.code(), 'button--ternary-color': !isActive.code() }"
            @click="commands.code"
          >
            <Icon type="codeBasic" :theme="isActive.code() ? 'theme--white' : 'theme--ternary-color'"/>
          </button>

          <button
            class="menubar__button"
            :class="{ 'button--ternary-color-reverse': isActive.paragraph(), 'button--ternary-color': !isActive.paragraph() }"
            @click="commands.paragraph"
          >
            p
          </button>

          <button
            class="menubar__button"
            :class="{ 'button--ternary-color-reverse': isActive.heading({ level: 1 }), 'button--ternary-color': !isActive.heading({ level: 1 }) }"

            @click="commands.heading({ level: 1 })"
          >
            H1
          </button>

          <button
            class="menubar__button"
            :class="{ 'button--ternary-color-reverse': isActive.heading({ level: 2 }), 'button--ternary-color': !isActive.heading({ level: 2 }) }"
            @click="commands.heading({ level: 2 })"
          >
            H2
          </button>

          <button
            class="menubar__button"
            :class="{ 'button--ternary-color-reverse': isActive.heading({ level: 3 }), 'button--ternary-color': !isActive.heading({ level: 3 }) }"
            @click="commands.heading({ level: 3 })"
          >
            H3
          </button>

          <button
            class="menubar__button"
            :class="{ 'button--ternary-color-reverse': isActive.bullet_list(), 'button--ternary-color': !isActive.bullet_list() }"
            @click="commands.bullet_list"
          >
            ul
          </button>

          <button
            class="menubar__button"
            :class="{ 'button--ternary-color-reverse': isActive.ordered_list(), 'button--ternary-color': !isActive.ordered_list() }"
            @click="commands.ordered_list"
          >
            ol
          </button>

          <button
            class="menubar__button menubar__button--with-icon"
            :class="{ 'button--ternary-color-reverse': isActive.blockquote(), 'button--ternary-color': !isActive.blockquote() }"
            @click="commands.blockquote"
          >
            <Icon type="quote" :theme="isActive.blockquote() ? 'theme--white' : 'theme--ternary-color'"/>
          </button>

          <button
            class="menubar__button menubar__button--with-icon"
            :class="{ 'button--ternary-color-reverse': isActive.code_block(), 'button--ternary-color': !isActive.code_block() }"
            @click="commands.code_block"
          >
            <Icon type="codeBlock" :theme="isActive.code_block() ? 'theme--white' : 'theme--ternary-color'"/>
          </button>

          <button
            class="menubar__button menubar__button--with-icon button--ternary-color"
            @click="commands.horizontal_rule"
          >
            <Icon type="lineH" theme="theme--ternary-color"/>
          </button>

          <button
            class="menubar__button menubar__button--with-icon button--ternary-color"
            @click="commands.undo"
          >
            <Icon type="undo" theme="theme--ternary-color"/>

          </button>

          <button
            class="menubar__button menubar__button--with-icon button--ternary-color"
            @click="commands.redo"
          >
            <Icon type="redo" theme="theme--ternary-color"/>
          </button>

        </div>
      </editor-menu-bar>
      <editor-content ref="editorContent" class="editor__content exercise-article" :editor="editor"/>

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
    CodeBlockHighlight
  } from 'tiptap-extensions'
  import {Component, Ref, Vue} from "vue-property-decorator";

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

    mounted() {
      this.editor = new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({levels: [1, 2, 3]}),
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
      })
    }

    beforeDestroy() {
      if (this.editor !== null) {
        this.editor.destroy()
      }
    }

    content() {
      const element = (this.editorContent.$el as HTMLElement).querySelector(".ProseMirror");

      return element ? element.innerHTML : '<p></p>'
    }
  }
</script>

<style lang="scss">
  @import '../../assets/css/editor';
</style>
