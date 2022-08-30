import dayjs from 'dayjs';
import { logger } from '@jobscale/logger';
import { uuid } from '@jobscale/uuid';
import Top from '../Top/VUE.vue';
import { share, items } from '../../data';

const store = localStorage;

export default {
  name: 'App',
  components: {
    Top
  },
  data() {
    return {
      app: undefined,
    };
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      this.initCharData();
      this.resetCharData();

      this.app.append = () => this.append();
      this.app.reset0 = () => this.reset0();
      this.app.reset4 = () => this.reset4();
      this.app.reset43 = () => this.reset43();
      this.app.reserve = data => this.reserve(data);
      setInterval(() => this.save(), 2000);
    },

    initCharData() {
      const data = this.parse(store.getItem('v1'));
      if (data) this.app = data;
      if (!this.app || !Object.keys(this.app).length) {
        this.app = {
          share: {},
          chars: [],
        };
      }
      if (!Object.keys(this.app.share).length) {
        this.app.share = JSON.parse(JSON.stringify(share));
      }
      if (!this.app.chars || !this.app.chars.length) {
        this.app.chars.push({
          unique: uuid(),
          name: '',
          items: JSON.parse(JSON.stringify(items)),
        });
        this.app.chars.push({
          unique: uuid(),
          name: 'サブ',
          items: JSON.parse(JSON.stringify(items)),
        });
      }

      this.app.share = this.sanitize(share, this.app.share);
      this.app.chars.forEach(char => {
        char.items = this.sanitize(items, char.items);
      });
    },

    sanitize(base, older) {
      const result = JSON.parse(JSON.stringify(base));
      Object.keys(result).forEach(key => {
        result[key].checked = older[key] && older[key].checked;
      });
      return result;
    },

    reset0() {
      const target = ['shop'];
      this.app.chars.forEach(char => {
        Object.keys(char.items).forEach(key => {
          if (target.indexOf(key) === -1) return;
          char.items[key].checked = false;
        });
      });
    },

    reset4() {
      const target = ['pan', 'tower', 'battle', 'elite', 'friend', 'guild', 'free', 'greedy', 'field'];
      this.app.chars.forEach(char => {
        Object.keys(char.items).forEach(key => {
          if (target.indexOf(key) === -1) return;
          char.items[key].checked = false;
        });
      });

      // TODO: start of week hook and store data.
      if (dayjs().day() === 1) {
        const weekly = ['gran'];
        this.app.chars.forEach(char => {
          Object.keys(char.items).forEach(key => {
            if (weekly.indexOf(key) === -1) return;
            char.items[key].checked = false;
          });
        });
      }

      const targetShare = ['weekly', 'collect', 'equipment', 'summon', 'dimension', 'experience', 'adena', 'event'];
      Object.keys(this.app.share).forEach(key => {
        if (targetShare.indexOf(key) === -1) return;
        this.app.share[key].checked = false;
      });
    },

    reset43() {
      const target = ['quest'];
      this.app.chars.forEach(char => {
        Object.keys(char.items).forEach(key => {
          if (target.indexOf(key) === -1) return;
          char.items[key].checked = false;
        });
      });
    },

    append() {
      this.app.chars.push({
        unique: uuid(),
        name: 'サブ',
        items: JSON.parse(JSON.stringify(items)),
      });
    },

    save() {
      const data = JSON.stringify(this.app);
      if (data === this.stored) return;
      this.stored = data;
      store.setItem('v1', data);
    },

    parse(text) {
      try {
        return JSON.parse(text);
      }
      catch (e) {
        logger.error(e.message);
        return undefined;
      }
    },
  },
}
