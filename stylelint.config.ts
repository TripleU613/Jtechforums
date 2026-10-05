// stylelint for src/styles: the standard SCSS rules, set up like JtechTools'
// (Discourse's shared config, minus its Discourse-only plugin).
import type { Config } from "stylelint";

const config: Config = {
  extends: ["stylelint-config-standard-scss"],
  rules: {
    "rule-empty-line-before": [
      "always",
      { except: ["after-single-line-comment", "first-nested"] },
    ],
    "declaration-empty-line-before": "never",
    "selector-class-pattern": null,
    "custom-property-pattern": null,
    "keyframes-name-pattern": null,
    "alpha-value-notation": null,
    "color-function-notation": null,
    // keep rgba() for colors that carry an alpha, as JtechTools does
    "color-function-alias-notation": null,
    "shorthand-property-no-redundant-values": null,
    "declaration-block-no-redundant-longhand-properties": null,
    "number-max-precision": null,
    // the sections override each other on purpose; the cascade order is the design
    "no-descending-specificity": null,
    "scss/load-no-partial-leading-underscore": null,
    "scss/comment-no-empty": null,
    // min-width/max-width: the build targets Safari 14, which predates range syntax
    "media-feature-range-notation": "prefix",
    // :not(.a):not(.b) outweighs :not(.a, .b); merging them would change the cascade
    "selector-not-notation": null,
    "value-keyword-case": [
      "lower",
      { ignoreProperties: ["/^\\$/", "font", "font-family"] },
    ],
  },
};

export default config;
