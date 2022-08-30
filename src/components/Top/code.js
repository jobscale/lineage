import dayjs from 'dayjs';
import Char from '../Char/VUE.vue';

const store = localStorage;

export default {
  name: 'Top',
  props: ['app'],
  components: {
    Char,
  },
  data() {
    return {
      ts0: '',
      ts4: '',
      ts43: '',
    };
  },

  created() {
    this.init();
    this.update();
    setInterval(() => this.update(), 1000);
  },

  methods: {
    init() {
      this.resetCharData();
      const { ts0, ts4, ts43 } = this.times();
      const after0 = this.span(ts0);
      const after4 = this.span(ts4);
      const after43 = this.span(ts43);
      setTimeout(() => {
        this.app.reset0();
        location.href = (() => location.href)();
      }, after0);
      setTimeout(() => {
        this.app.reset4();
        location.href = (() => location.href)();
      }, after4);
      setTimeout(() => {
        this.app.reset43();
        location.href = (() => location.href)();
      }, after43);
      store.setItem('reserve', JSON.stringify({
        reserve0: dayjs().add(after0, 'milliseconds'),
        reserve4: dayjs().add(after4, 'milliseconds'),
        reserve43: dayjs().add(after43, 'milliseconds'),
      }));
    },

    resetCharData() {
      const data = this.parse(store.getItem('reserve'));
      if (!data) return;
      const ts = dayjs();
      const check = {};
      if (dayjs(data.reserve0) < ts) {
        this.app.reset0();
        check.reset = true;
      }
      if (dayjs(data.reserve4) < ts) {
        this.app.reset4();
        check.reset = true;
      }
      if (dayjs(data.reserve43) < ts) {
        this.app.reset43();
        check.reset = true;
      }
      if (check.reset) {
        location.href = (() => location.href)();
      }
    },

    times() {
      return {
        ts0: dayjs(`${dayjs().format('YYYY-MM-DD 00:00:00')} +0900`).add(1, 'days'),
        ts4: dayjs(`${dayjs().format('YYYY-MM-DD 04:00:00')} +0900`).add(1, 'days'),
        ts43: dayjs(`${dayjs().format('YYYY-MM-DD 04:30:00')} +0900`).add(1, 'days'),
      };
    },

    update() {
      const { ts0, ts4, ts43 } = this.times();
      this.ts0 = this.tsString(this.span(ts0));
      this.ts4 = this.tsString(this.span(ts4));
      this.ts43 = this.tsString(this.span(ts43));
    },

    span(to) {
      const d24h = 24 * 60 * 60 * 1000;
      const milliseconds = dayjs(to).diff(dayjs());
      return milliseconds > d24h ? milliseconds - d24h : milliseconds;
    },
  
    tsString(milliseconds) {
      const fmt = num => `0${num}`.slice(-2);
      const seconds = Math.floor(milliseconds / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      return `${hours}:${fmt(minutes % 60)}:${fmt(seconds % 60)}`;
    },
  },
}
