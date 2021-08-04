module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    // extend: {
    //   fontFamily: {
    //     sans: 'OpenDyslexic',
    //   },
    // },
    inset: {
      0: 0,
      '1/2': '50%',
    },
  },
  variants: {},
  plugins: [],
  'tailwindCSS.includeLanguages': {
    typescript: 'javascript',
    typescriptreact: 'javascript',
  },
};
