
import { css } from "styled-components"

const sizes = {
  desktop1: 1920,
  desktop2: 1366,
  desktop3: 992,
  tablet: 768,
  phone1: 576,
  phone2: 320,
}

// Iterate through the sizes and create a media template
export const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label] / 16}em) {
      ${css(...args)}
    }
  `
  return acc
}, {})