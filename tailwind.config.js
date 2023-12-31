/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      height:{
        '11/12':'91.66667%',
        '20/21':'95.23809523809524%',
        '86p':'86%'

      },
      width:{
        '19/20':'95.23809523809524%',
        '20/21':'97.23809523809524%',
        '2/8':'25%',
        
      }

    },
    fontFamily:
    {
      'Monteserrat': ['Montserrat','sans-serif'],
      'Monteserrat-bold': ['Montserrat-bold','sans-serif'],
      'Monteserrat-black': ['Montserrat-black','sans-serif'],
      'Monteserrat-elight': ['Montserrat-elight','sans-serif'],
    }
  },
  plugins: [
  ],
}

