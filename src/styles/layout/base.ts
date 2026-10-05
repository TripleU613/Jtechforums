// The home page's base layout: header, hero, sections, footer.
import { css } from "../css.ts";

export default css`
:root {
  font-family: var(--font-sans);
  color: var(--tone-96);
  background: var(--tone-2);
  font-synthesis: none;
  --paper: var(--tone-2);
  --ink: var(--tone-96);
  --muted: var(--tone-62);
  --green: var(--tone-96);
  --line: var(--tone-12);
  --soft: var(--tone-8);
}
* {
  box-sizing: border-box;
}
html {
  scroll-behavior: smooth;
  scroll-padding-top: 100px;
}
body {
  margin: 0;
  -webkit-font-smoothing: antialiased;
}
button,
input,
textarea,
select {
  font: inherit;
}
button,
a,
input,
summary {
  -webkit-tap-highlight-color: transparent;
}
button,
a {
  touch-action: manipulation;
}
button {
  cursor: pointer;
}
a {
  color: inherit;
  text-decoration: none;
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
button,
a {
  transition:
    background-color 0.18s,
    color 0.18s,
    transform 0.18s,
    border-color 0.18s;
}
a:focus-visible,
button:focus-visible,
input:focus-visible,
textarea:focus-visible,
summary:focus-visible {
  outline: 2px solid var(--green);
  outline-offset: 5px;
}
::selection {
  background: var(--tone-16);
  color: var(--ink);
}
h1,
h2,
h3,
p {
  margin: 0;
}
h1,
h2,
h3 {
  font-family: var(--font-sans);
}
h2 {
  font-size: 36px;
  letter-spacing: -1.7px;
  line-height: 1.25;
  font-weight: 650;
}
em {
  font-family: var(--font-sans);
  font-weight: 400;
  color: var(--green);
}
.container {
  width: min(1240px, calc(100% - 96px));
  margin-inline: auto;
}
.site-shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
.site-shell main {
  flex: 1;
}
.site-header {
  height: 89px;
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  z-index: 30;
  background: var(--tone-100-a96);
  backdrop-filter: blur(12px);
}
.header-inner {
  max-width: 1340px;
  margin: auto;
  height: 100%;
  padding: 0 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 13px;
  flex-shrink: 0;
}
.brand img {
  width: 83px;
  height: 34px;
  object-fit: contain;
  mix-blend-mode: multiply;
}
.brand > span {
  font-size: 10px;
  letter-spacing: 2px;
  border-left: 1px solid var(--tone-72);
  padding-left: 13px;
  font-weight: 600;
}
.desktop-nav {
  display: flex;
  gap: 28px;
  height: 100%;
  align-items: center;
  font-size: 13px;
}
.desktop-nav a {
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  color: var(--tone-60);
}
.desktop-nav a.active {
  color: var(--green);
  font-weight: 700;
}
.desktop-nav a.active:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--green);
}
.desktop-nav a:hover {
  color: var(--ink);
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 25px;
  font-size: 13px;
}
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  background: var(--green);
  color: var(--tone-0);
  padding: 17px 24px;
  border: 1px solid var(--green);
  border-radius: var(--radius-control);
  font-weight: 550;
  font-size: 14px;
  line-height: 1.2;
  min-height: 48px;
}
.button:hover {
  background: var(--tone-96);
  transform: translateY(-2px);
}
.button:active {
  transform: translateY(1px);
}
.button-small {
  font-size: 12px;
  padding: 12px 16px;
  gap: 12px;
  min-height: 40px;
}
.text-link {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-weight: 550;
  font-size: 13px;
}
.text-link:hover {
  color: var(--green);
}
.text-link:hover svg {
  transform: translateX(3px);
}
.text-link svg {
  transition: transform 0.18s;
}
.skip-link {
  position: fixed;
  left: 20px;
  top: -70px;
  background: var(--ink);
  color: var(--tone-100);
  padding: 15px;
  z-index: 50;
}
.skip-link:focus {
  top: 15px;
}
.menu-toggle {
  display: none;
}
.eyebrow {
  font-size: 10px;
  line-height: 1.5;
  letter-spacing: 1.9px;
  font-weight: 600;
  color: var(--tone-62);
  display: flex;
  align-items: center;
  gap: 9px;
}
.community-strip {
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: var(--tone-6);
}
.strip-inner {
  display: grid;
  grid-template-columns: 1.1fr repeat(3, 1fr) 1.1fr;
  padding-block: 24px;
  align-items: center;
}
.strip-inner > div {
  padding-left: 34px;
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.strip-inner > .strip-intro {
  padding-left: 0;
  border: 0;
  flex-direction: row;
  gap: 13px;
  align-items: center;
  font-size: 12px;
  line-height: 1.6;
}
.strip-intro svg {
  color: var(--green);
}
.strip-inner > div > strong {
  font-size: 27px;
  font-family: var(--font-sans);
  letter-spacing: -1px;
  font-weight: 550;
}
.strip-inner > div > span {
  font-size: 10px;
  color: var(--tone-62);
}
.strip-inner > .strip-note {
  font-size: 11px;
  line-height: 1.7;
  color: var(--tone-60);
}
.strip-note small {
  font-size: 8px;
  opacity: 0.8;
}
.section-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 25px;
  margin-bottom: 34px;
}
.section-top .eyebrow {
  margin-bottom: 13px;
}
.section-top > p {
  font-size: 12px;
  color: var(--tone-64);
  line-height: 1.7;
}
.conversation-section {
  display: grid;
  grid-template-columns: 1fr 310px;
  gap: 46px;
  padding-bottom: 80px;
}
.discussion-main {
  min-width: 0;
}
.topic-tabs {
  display: flex;
  align-items: center;
  gap: 24px;
  border-bottom: 1px solid var(--line);
  font-size: 11px;
}
.topic-tabs button {
  padding: 0 0 14px;
  color: var(--tone-64);
  border-bottom: 2px solid transparent;
}
.topic-tabs button[aria-selected="true"] {
  color: var(--green);
  border-color: var(--green);
  font-weight: 650;
}
.topic-tabs > span {
  margin-left: auto;
  color: var(--tone-68);
  font-size: 9px;
}
.topic-row {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 23px 0;
  border-bottom: 1px solid var(--line);
}
.topic-row:hover {
  background: var(--tone-6);
}
.topic-symbol {
  width: 40px;
  height: 42px;
  flex-shrink: 0;
  border: 1px solid var(--border);
  background: var(--tone-6);
  color: var(--tone-62);
  border-radius: var(--radius-md);
  display: grid;
  place-items: center;
}
.symbol-1 {
  background: var(--tone-6);
  color: var(--tone-62);
  border-color: var(--border);
}
.symbol-2 {
  background: var(--tone-6);
  color: var(--tone-64);
  border-color: var(--tone-12);
}
.topic-row > div {
  flex: 1;
}
.topic-row h3 {
  font-size: 13px;
  line-height: 1.5;
  font-weight: 650;
  letter-spacing: -0.2px;
}
.topic-row p {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 9px;
  color: var(--tone-66);
  margin-top: 7px;
}
.category-dot {
  width: 5px;
  height: 5px;
  background: var(--tone-66);
  border-radius: 2px;
}
.topic-date {
  margin-left: 9px;
  color: var(--tone-66);
}
.topic-replies {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  color: var(--tone-66);
}
.topic-row > svg {
  color: var(--tone-66);
}
.forum-search {
  margin-top: 22px;
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 12px 15px;
  background: var(--tone-0);
  border: 1px solid var(--line);
  border-radius: var(--radius-control);
  color: var(--tone-66);
}
.forum-search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  font-size: 12px;
  color: var(--ink);
}
.forum-search button {
  width: 30px;
  height: 28px;
  background: var(--tone-6);
  border-radius: var(--radius-sm);
  display: grid;
  place-items: center;
  color: var(--green);
}
.search-suggestions {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-top: 12px;
  font-size: 9px;
  flex-wrap: wrap;
  color: var(--tone-66);
}
.search-suggestions button {
  color: var(--tone-60);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.community-aside {
  padding: 28px;
  background: var(--tone-8);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.community-aside > .eyebrow {
  font-size: 8px;
  letter-spacing: 1.3px;
  margin-bottom: 35px;
}
.community-aside > svg {
  color: var(--green);
  margin-bottom: 19px;
}
.community-aside h3 {
  font-size: 24px;
  line-height: 1.35;
  letter-spacing: -1px;
  font-weight: 600;
}
.community-aside p {
  font-size: 12px;
  line-height: 1.9;
  color: var(--tone-64);
  margin: 19px 0 25px;
}
.community-aside .button {
  font-size: 11px;
  width: 100%;
  padding: 13px 16px;
  justify-content: space-between;
  min-height: 43px;
  margin-top: auto;
}
.aside-signoff {
  font-size: 8px;
  align-self: center;
  margin-top: 13px;
  color: var(--tone-64);
}
.people-section {
  border-block: 1px solid var(--line);
  background: var(--tone-6);
  padding: 61px 0 34px;
}
.people-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin: 39px 0;
}
.person {
  display: flex;
  align-items: center;
  gap: 15px;
}
.avatar {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  font-family: var(--font-sans);
  font-size: 18px;
  border-radius: 50%;
  background: var(--tone-14);
  color: var(--tone-60);
  overflow: hidden;
}
.avatar img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
.person:nth-child(2) .avatar {
  background: var(--tone-14);
  color: var(--tone-62);
}
.person:nth-child(3) .avatar {
  background: var(--tone-12);
  color: var(--tone-62);
}
.person h3 {
  font-size: 13px;
  font-weight: 650;
  letter-spacing: -0.2px;
}
.person div > span {
  font-size: 10px;
  color: var(--tone-64);
}
.person p {
  font-size: 10px;
  color: var(--tone-66);
  margin-top: 6px;
}
.person > svg {
  margin-left: auto;
  color: var(--tone-68);
}
.faq-section {
  border-top: 1px solid var(--line);
  display: grid;
  grid-template-columns: 1fr 1.65fr;
  gap: 80px;
  padding-top: 67px;
  padding-bottom: 70px;
}
.faq-section h2 {
  font-size: 43px;
  margin: 18px 0 21px;
}
.faq-section > div > p {
  font-size: 12px;
  color: var(--tone-64);
}
.faq-search {
  margin: 26px 0;
  display: flex;
  align-items: center;
  gap: 9px;
  border-bottom: 1px solid var(--line);
  padding-bottom: 12px;
  max-width: 240px;
  color: var(--tone-66);
}
.faq-search input {
  font-size: 12px;
  background: transparent;
  border: 0;
  min-width: 0;
  width: 100%;
}
.faq-list details {
  border-bottom: 1px solid var(--line);
}
.faq-list summary {
  padding: 17px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  cursor: pointer;
  font-size: 12px;
  list-style: none;
  font-weight: 550;
}
.faq-list summary::-webkit-details-marker {
  display: none;
}
.faq-list summary svg {
  flex-shrink: 0;
  color: var(--tone-66);
  transition: transform 0.2s;
}
.faq-list details[open] summary svg {
  transform: rotate(45deg);
}
.faq-list details p {
  font-size: 12px;
  line-height: 1.9;
  color: var(--tone-64);
  padding: 0 30px 20px 0;
}
.closing-section {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  text-align: center;
  background: var(--tone-8);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 62px 35px 70px;
  margin-bottom: 75px;
}
.closing-section .eyebrow {
  justify-content: center;
}
.closing-section h2 {
  font-size: 43px;
  margin: 17px 0;
}
.closing-section p {
  font-size: 12px;
  color: var(--tone-62);
  line-height: 1.9;
  margin-bottom: 26px;
}
.closing-section .button {
  font-size: 12px;
}
.closing-watermark {
  position: absolute;
  font-family: var(--font-sans);
  font-weight: 800;
  font-size: 250px;
  letter-spacing: -25px;
  bottom: -110px;
  right: -10px;
  color: var(--tone-12);
  z-index: -1;
}
.site-footer {
  border-top: 1px solid var(--line);
}
.footer-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block: 39px;
}
.footer-top p {
  font-size: 11px;
  color: var(--tone-66);
  margin-top: 16px;
}
.footer-bottom {
  border-top: 1px solid var(--line);
  padding-block: 22px;
  display: flex;
  justify-content: space-between;
  gap: 25px;
  font-size: 9px;
  color: var(--tone-68);
}
.footer-bottom nav {
  display: flex;
  gap: 23px;
}
.empty-state {
  padding: 30px 0;
  color: var(--tone-62);
  font-size: 13px;
}
/* Shared styling for the existing account, guide, app, and information pages. */
.inner-page {
  padding: 48px 0 70px;
  color: var(--ink);
}
.local-notice {
  padding: 13px 18px;
  border: 1px solid var(--line);
  background: var(--tone-6);
  border-radius: var(--radius-md);
  font-size: 12px;
  color: var(--tone-60);
  margin-bottom: 24px;
}
@media (max-width: 1100px) {
  .container {
    width: calc(100% - 64px);
  }
  .header-inner {
    padding: 0 30px;
    gap: 20px;
  }
  .desktop-nav {
    gap: 20px;
  }
  .header-actions {
    gap: 15px;
  }
  .conversation-section {
    gap: 30px;
    grid-template-columns: 1fr 280px;
  }
  .section-top h2 {
    font-size: 30px;
  }
  .person {
    gap: 10px;
  }
  .person h3 {
    font-size: 11px;
  }
  .person p {
    font-size: 9px;
  }
  .person > svg {
    display: none;
  }
}
@media (max-width: 850px) {
  .desktop-nav {
    display: none;
  }
  .header-actions {
    margin-left: auto;
  }
  .menu-toggle {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border: 1px solid var(--line);
    border-radius: var(--radius-control);
  }
  .mobile-nav {
    position: absolute;
    left: 0;
    right: 0;
    top: 88px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: var(--paper);
    padding: 20px 32px;
    border-bottom: 1px solid var(--line);
    gap: 0 20px;
    box-shadow: 0 12px 20px var(--tone-96-a5);
  }
  .mobile-nav a {
    font-size: 14px;
    padding: 12px;
    border-bottom: 1px solid var(--line);
  }
  .mobile-nav a.active {
    color: var(--green);
    font-weight: 650;
  }
  .strip-inner {
    grid-template-columns: repeat(3, 1fr);
  }
  .strip-inner > .strip-intro,
  .strip-inner > .strip-note {
    display: none;
  }
  .strip-inner > div {
    padding-left: 28px;
  }
  .strip-inner > div:nth-child(2) {
    border: 0;
    padding-left: 0;
  }
  .section-top {
    align-items: flex-start;
  }
  .section-top > p {
    display: none;
  }
  .conversation-section {
    grid-template-columns: 1fr;
  }
  .community-aside {
    display: none;
  }
  .people-grid {
    grid-template-columns: 1fr;
    gap: 22px;
  }
  .person h3 {
    font-size: 14px;
  }
  .person p {
    font-size: 11px;
  }
  .person > svg {
    display: block;
  }
  .faq-section {
    gap: 35px;
    grid-template-columns: 1fr 1.4fr;
  }
  .faq-section h2 {
    font-size: 36px;
  }
  .closing-section h2 {
    font-size: 35px;
  }
  .footer-bottom > span {
    display: none;
  }
}
@media (max-width: 580px) {
  .container {
    width: calc(100% - 40px);
  }
  .site-header {
    height: 73px;
  }
  .header-inner {
    padding: 0 20px;
    gap: 10px;
  }
  .brand {
    gap: 9px;
  }
  .brand img {
    width: 67px;
    height: 29px;
  }
  .brand > span {
    font-size: 8px;
    letter-spacing: 1.5px;
    padding-left: 9px;
  }
  .header-actions .button-small {
    font-size: 10px;
    padding: 10px 11px;
    gap: 8px;
    min-height: 36px;
  }
  .menu-toggle {
    width: 35px;
    height: 36px;
  }
  .mobile-nav {
    top: 72px;
    padding-inline: 20px;
  }
  .strip-inner {
    padding-block: 20px;
  }
  .strip-inner > div {
    padding-left: 20px;
  }
  .strip-inner > div > strong {
    font-size: 25px;
  }
  .strip-inner > div > span {
    font-size: 8px;
  }
  .section-top {
    margin-bottom: 26px;
    gap: 15px;
  }
  .section-top .eyebrow {
    font-size: 8px;
    letter-spacing: 1.5px;
  }
  .section-top h2 {
    font-size: 27px;
    letter-spacing: -1.2px;
  }
  .section-top > .text-link {
    font-size: 10px;
    gap: 6px;
    align-self: flex-end;
    flex-shrink: 0;
  }
  .conversation-section {
    padding-bottom: 47px;
  }
  .topic-tabs {
    gap: 20px;
    font-size: 10px;
  }
  .topic-tabs > span {
    font-size: 8px;
  }
  .topic-row {
    gap: 11px;
    padding: 20px 0;
  }
  .topic-row h3 {
    font-size: 12px;
  }
  .topic-symbol {
    width: 33px;
    height: 36px;
  }
  .topic-row > svg {
    display: none;
  }
  .topic-date {
    font-size: 8px;
  }
  .topic-replies {
    font-size: 9px;
  }
  .forum-search {
    padding: 10px;
    font-size: 11px;
  }
  .forum-search input {
    font-size: 11px;
  }
  .search-suggestions {
    gap: 11px;
    font-size: 8px;
  }
  .people-section {
    padding: 43px 0 30px;
  }
  .people-section .section-top {
    display: block;
  }
  .people-section .section-top > .text-link {
    margin-top: 16px;
  }
  .people-grid {
    margin: 28px 0;
  }
  .faq-section {
    grid-template-columns: 1fr;
    gap: 25px;
    padding: 43px 0;
  }
  .faq-section h2 {
    font-size: 36px;
  }
  .faq-section h2 br {
    display: none;
  }
  .faq-search {
    max-width: none;
    margin: 20px 0;
  }
  .faq-section .text-link {
    font-size: 11px;
  }
  .faq-list summary {
    font-size: 12px;
    line-height: 1.6;
  }
  .closing-section {
    padding: 38px 22px 42px;
    margin-bottom: 43px;
  }
  .closing-section h2 {
    font-size: 34px;
  }
  .closing-section h2 em {
    display: block;
  }
  .closing-section p {
    font-size: 11px;
  }
  .closing-section p br {
    display: none;
  }
  .closing-section .eyebrow {
    font-size: 8px;
    letter-spacing: 1.5px;
  }
  .closing-watermark {
    font-size: 170px;
    bottom: -75px;
    letter-spacing: -16px;
  }
  .footer-top {
    padding-block: 28px;
    align-items: flex-start;
    gap: 18px;
  }
  .footer-top > .text-link {
    font-size: 9px;
    gap: 5px;
    max-width: 110px;
  }
  .footer-top p {
    font-size: 9px;
    max-width: 190px;
    line-height: 1.7;
  }
  .footer-bottom {
    gap: 15px;
    font-size: 8px;
    flex-direction: column;
    padding-block: 18px;
  }
  .footer-bottom nav {
    gap: 23px;
  }
  .inner-page {
    padding-top: 20px;
  }
}
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
  }
  .button:hover {
    transform: none;
  }
}

.faq-section h2 em::before {
  content: " ";
}
.brand img {
  width: 96px;
  height: 38px;
}
@media (max-width: 580px) {
  .brand img {
    width: 72px;
    height: 29px;
  }
  .faq-section h2 em {
    display: block;
  }
}
.section-top > p {
  color: var(--tone-62);
}
.person p {
  color: var(--tone-62);
}
.footer-bottom {
  color: var(--tone-62);
}
.topic-tabs > span,
.topic-date {
  color: var(--tone-62);
}
.faq-list details p {
  color: var(--tone-60);
}
.closing-section p {
  color: var(--tone-60);
}
.community-aside p {
  color: var(--tone-60);
}
`;
