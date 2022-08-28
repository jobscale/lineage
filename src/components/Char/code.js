import Daily from '../Daily/VUE.vue'

export default {
  name: 'Char',
  props: ['app', 'char'],
  components: {
    Daily,
  },

  mounted() {
    this.$refs.input.addEventListener('input', () => {
      this.$refs.box.textContent = this.$refs.input.value + '\u200b';
    });
    this.$refs.box.textContent = this.$refs.input.value + '\u200b';
  },

  methods: {
    isUp() {
      const index = this.app.chars.findIndex(item => item.unique === this.char.unique);
      return index;
    },

    up() {
      const index = this.app.chars.findIndex(item => item.unique === this.char.unique);
      if (!index) return;
      this.app.chars.splice(index - 1, 2, this.app.chars[index], this.app.chars[index - 1]);
    },

    isDown() {
      const index = this.app.chars.findIndex(item => item.unique === this.char.unique);
      return index < (this.app.chars.length - 1);
    },

    down() {
      const index = this.app.chars.findIndex(item => item.unique === this.char.unique);
      if (index >= (this.app.chars.length - 1)) return;
      this.app.chars.splice(index, 2, this.app.chars[index + 1], this.app.chars[index]);
    },

    remove() {
      const index = this.app.chars.findIndex(item => item.unique === this.char.unique);
      this.app.chars.splice(index, 1);
    },
  },
}
