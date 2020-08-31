module.exports = {
  purge: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx', 'public/**/*.html'],
  theme: {
    extend: {},
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
