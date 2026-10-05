// The home page's scenes on top of the base: the branded hero, the story,
// the pinned horizontal rail, the forum feed, the people and the FAQ.
import { css } from "../css.ts";

export default css`
:root {
  --paper: var(--tone-0);
  --ink: var(--tone-100);
  --muted: var(--tone-66);
  --green: var(--tone-88);
  --line: var(--tone-24);
  --soft: var(--tone-14);
  background: var(--tone-0);
  color: var(--tone-100);
}
body {
  background: var(--tone-0);
}
::selection {
  background: var(--tone-90);
  color: var(--tone-4);
}
em {
  font-family: var(--font-sans);
  font-style: normal;
  font-weight: 600;
  color: var(--tone-88);
}
.site-header {
  background: var(--tone-0-a86);
  border-color: var(--border);
}
.brand img {
  mix-blend-mode: normal;
}
.brand > span {
  color: var(--tone-66);
  border-color: var(--border);
}
.desktop-nav a {
  color: var(--tone-68);
}
.desktop-nav a.active {
  color: var(--tone-92);
}
.button {
  background: var(--tone-92);
  border-color: var(--tone-92);
  color: var(--tone-8);
  border-radius: var(--radius-control);
  font-weight: 700;
  box-shadow: 0 0 30px var(--tone-80-a4);
}
.button:hover {
  background: var(--tone-98);
  color: var(--tone-4);
  box-shadow: 0 0 35px var(--tone-80-a18);
}
.button-small {
  background: transparent;
  color: var(--tone-96);
  border-color: var(--border-strong);
}
.button-small:hover {
  color: var(--tone-4);
}
.text-link:hover {
  color: var(--tone-92);
}
.eyebrow {
  color: var(--tone-72);
  font-family: var(--font-mono);
}
.site-scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--tone-90);
  transform: scaleX(0);
  transform-origin: left;
  z-index: 50;
  box-shadow: 0 0 10px var(--tone-84);
}
.immersive-hero {
  min-height: min(850px, calc(100svh - 89px));
  height: 760px;
  position: relative;
  isolation: isolate;
  padding: 30px max(48px, calc((100vw - 1240px) / 2));
  overflow: hidden;
  background: var(--tone-0);
}
.hero-blueprint {
  position: absolute;
  inset: 0;
  z-index: -2;
  background-image:
    linear-gradient(var(--tone-70-a4) 1px, transparent 1px),
    linear-gradient(90deg, var(--tone-70-a4) 1px, transparent 1px);
  background-size: 90px 90px;
  mask-image: linear-gradient(90deg, transparent, #000);
}
.hero-ambient {
  position: absolute;
  right: -100px;
  top: -100px;
  height: 850px;
  width: 850px;
  z-index: -1;
  background: radial-gradient(ellipse at 50% 40%, var(--tone-36-a18), transparent 62%);
}
.hero-bottom {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  font-family: var(--font-mono);
  letter-spacing: 1.2px;
  font-size: 9px;
  color: var(--tone-60);
}
.hero-caption {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 45px;
  margin-top: 30px;
}
.hero-caption p {
  font-size: 18px;
  line-height: 1.6;
  letter-spacing: -0.3px;
  color: var(--tone-94);
}
.hero-caption > span {
  font-size: 12px;
  line-height: 1.7;
  color: var(--tone-58);
  border-left: 1px solid var(--border);
  padding-left: 35px;
}
.hero-caption .button {
  margin-left: 10px;
  padding: 17px 25px;
  gap: 28px;
  font-size: 12px;
}
.hero-bottom {
  position: absolute;
  left: max(48px, calc((100vw - 1240px) / 2));
  right: max(48px, calc((100vw - 1240px) / 2));
  bottom: 28px;
  align-items: center;
  font-size: 8px;
}
.scroll-cue {
  display: flex;
  align-items: center;
  gap: 14px;
}
.scroll-cue > span {
  display: grid;
  place-items: center;
  border: 1px solid var(--border);
  width: 29px;
  height: 38px;
  border-radius: var(--radius-control);
  font-size: 17px;
  color: var(--tone-96);
  animation: scroll-nudge 2.8s ease-in-out infinite;
}
.community-strip {
  background: var(--tone-8);
  border-color: var(--border);
}
.strip-inner > div {
  border-color: var(--border);
}
.strip-inner > div > span,
.strip-inner > .strip-note,
.strip-note small {
  color: var(--tone-64);
}
.strip-inner > div > strong {
  color: var(--tone-96);
}
.strip-intro svg {
  color: var(--tone-88);
}
.experience-rail {
  position: relative;
  overflow: hidden;
  padding: 35px 0 22px;
  background: var(--tone-0);
  height: calc(100svh - 89px);
  min-height: 640px;
  max-height: 940px;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--border);
}
.rail-heading {
  padding: 0 5vw;
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 25px;
  flex-shrink: 0;
}
.rail-heading .eyebrow {
  font-size: 9px;
  letter-spacing: 2px;
  margin-bottom: 12px;
}
.rail-heading h2 {
  font-size: clamp(28px, 3.3vw, 49px);
  letter-spacing: -2px;
  line-height: 1.02;
}
.rail-heading h2 br {
  display: none;
}
.rail-heading h2 > span {
  margin-left: 12px;
  color: var(--tone-58);
}
.rail-heading-right {
  text-align: right;
}
.rail-heading-right > span {
  font: 8px var(--font-mono);
  letter-spacing: 1.6px;
  color: var(--tone-82);
}
.rail-heading-right p {
  font-size: 11px;
  color: var(--tone-62);
  margin-top: 10px;
}
.rail-heading-right p > span {
  color: var(--tone-90);
  margin-left: 20px;
}
.rail-viewport {
  width: 100%;
  overflow: hidden;
  flex: 1;
  min-height: 0;
}
.rail-track {
  display: flex;
  width: max-content;
  height: 100%;
  gap: 0;
  will-change: transform;
}
.experience-panel {
  width: 100vw;
  flex-shrink: 0;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  align-items: center;
  gap: 4vw;
  padding: 35px 8vw 35px 8vw;
  overflow: hidden;
  isolation: isolate;
  background: radial-gradient(ellipse at 80% 40%, var(--tone-30-a22), transparent 60%);
}
.experience-panel::after {
  content: "";
  position: absolute;
  top: 20%;
  bottom: 20%;
  left: 50%;
  width: 1px;
  background: linear-gradient(transparent, var(--tone-52-a34), transparent);
  z-index: -1;
}
.panel-copy {
  position: relative;
  z-index: 3;
  max-width: 430px;
}
.panel-copy .eyebrow {
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--tone-82);
}
.panel-copy h3 {
  font-size: clamp(45px, 5.2vw, 80px);
  line-height: 1.02;
  font-weight: 600;
  letter-spacing: -3.5px;
  margin: 22px 0;
}
.panel-copy > p {
  font-size: 14px;
  color: var(--tone-68);
  line-height: 1.8;
  max-width: 340px;
}
.panel-link {
  margin-top: 32px;
  display: inline-flex;
  gap: 30px;
  align-items: center;
  border-bottom: 1px solid var(--tone-56);
  padding: 0 0 12px;
  font-size: 13px;
  color: var(--tone-94);
}
.panel-link:hover {
  color: var(--tone-100);
  gap: 40px;
}
.panel-visual {
  position: relative;
  height: 100%;
  min-height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
}
.panel-number {
  position: absolute;
  bottom: -35px;
  right: 5vw;
  font-size: clamp(180px, 24vw, 360px);
  font-weight: 700;
  font-family: var(--font-sans);
  line-height: 1;
  color: var(--tone-84-a2);
  letter-spacing: -30px;
  z-index: -1;
}
.rail-footer {
  padding: 24px 5vw 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.rail-pagination {
  display: flex;
  gap: 14px;
}
.rail-pagination button {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--tone-50);
  font: 9px var(--font-mono);
  padding: 6px 0;
}
.rail-pagination button i {
  width: 48px;
  height: 2px;
  background: var(--tone-26);
  transition: background 0.3s;
}
.rail-pagination button[aria-current="true"] {
  color: var(--tone-94);
}
.rail-pagination button[aria-current="true"] i {
  background: var(--tone-90);
  box-shadow: 0 0 10px var(--tone-82-a26);
}
.rail-footer-label {
  display: flex;
  align-items: center;
  gap: 18px;
  font: 8px var(--font-mono);
  letter-spacing: 1.5px;
  color: var(--tone-54);
}
.rail-guide-stack {
  position: relative;
  width: 310px;
  height: 390px;
  transform: rotate(-8deg) rotateY(-12deg);
}
.rail-app-wall {
  display: grid;
  grid-template-columns: repeat(3, 95px);
  gap: 24px;
  transform: rotate(-13deg) rotateY(-15deg);
}
.rail-app-wall > div {
  width: 95px;
  height: 95px;
  display: grid;
  place-items: center;
  background: var(--tone-20);
  border: 1px solid var(--border-strong);
  border-radius: 22px;
  box-shadow: 15px 18px 30px var(--shade-a34);
  animation: app-bob 5s ease-in-out infinite;
  animation-delay: calc(var(--tile) * -0.4s);
}
.rail-app-wall img {
  height: 65px;
  width: 65px;
  object-fit: contain;
  border-radius: 16px;
}
.panel-apps {
  background: radial-gradient(ellipse at 75% 40%, var(--tone-34-a22), transparent 65%);
}
.panel-apps .eyebrow,
.panel-apps .panel-link {
  color: var(--tone-86);
}
.panel-egate {
  background: radial-gradient(ellipse at 75% 40%, var(--tone-30-a44), transparent 65%);
}
.rail-phone {
  width: 215px;
  height: 465px;
  border-radius: 35px;
  background: linear-gradient(135deg, var(--tone-32), var(--tone-14) 40%);
  border: 2px solid var(--border-strong);
  box-shadow:
    30px 35px 60px var(--shade-a54),
    inset 0 0 0 4px var(--shade-a100);
  transform: rotate(9deg);
  padding: 17px 18px;
}
.phone-speaker {
  display: block;
  width: 45px;
  height: 5px;
  border-radius: 6px;
  background: var(--tone-0);
  margin: 0 auto 13px;
}
.rail-phone video {
  width: 100%;
  height: 230px;
  object-fit: cover;
  border-radius: 10px;
  background: var(--tone-0);
}
.phone-dial {
  font-size: 45px;
  text-align: center;
  color: var(--tone-54);
  margin: 5px;
}
.phone-keys {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 7px;
}
.phone-keys span {
  border: 1px solid var(--border-strong);
  border-radius: 9px;
  text-align: center;
  font-size: 10px;
  padding: 4px;
  background: var(--tone-22);
  color: var(--tone-82);
}
.panel-installer {
  background: radial-gradient(ellipse at 75% 40%, var(--tone-38-a20), transparent 65%);
}
.panel-installer .eyebrow,
.panel-installer .panel-link {
  color: var(--tone-84);
}
.rail-terminal {
  width: 470px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-lg);
  background: var(--tone-10);
  box-shadow: 30px 40px 70px var(--shade-a54);
  transform: rotate(-5deg) rotateY(-12deg);
}
.terminal-top {
  padding: 17px;
  border-bottom: 1px solid var(--border);
  font: 8px var(--font-mono);
  color: var(--tone-70);
  display: flex;
  gap: 60px;
}
.terminal-top > span {
  color: var(--tone-56);
  font-size: 7px;
  letter-spacing: 4px;
}
.terminal-content {
  padding: 35px;
  font: 12px/2 var(--font-mono);
}
.terminal-muted {
  display: block;
  color: var(--tone-62);
  margin-bottom: 28px;
}
.terminal-content p {
  color: var(--tone-80);
  margin-bottom: 9px;
}
.terminal-content p > span {
  color: var(--tone-80);
  margin-right: 12px;
}
.terminal-bar {
  height: 5px;
  background: var(--tone-20);
  margin: 30px 0 20px;
}
.terminal-bar > span {
  display: block;
  width: 85%;
  height: 100%;
  background: var(--tone-70);
  box-shadow: 0 0 15px var(--tone-72-a26);
}
.terminal-content strong {
  font-size: 8px;
  font-weight: 400;
  letter-spacing: 1.5px;
  color: var(--tone-74);
}
.terminal-content b {
  animation: blink 1s steps(1) infinite;
}
.conversation-section {
  padding-top: 100px;
  padding-bottom: 100px;
}
.section-top h2 {
  font-size: 42px;
  letter-spacing: -2px;
}
.topic-row {
  padding-block: 27px;
}
.topic-row h3 {
  font-size: 15px;
}
.topic-row:hover {
  background: var(--tone-16);
}
.topic-symbol {
  background: var(--tone-20);
  border-color: var(--border);
  color: var(--tone-80);
}
.symbol-1 {
  background: var(--tone-20);
  border-color: var(--border);
  color: var(--tone-78);
}
.symbol-2 {
  background: var(--tone-20);
  border-color: var(--border);
  color: var(--tone-78);
}
.topic-tabs button[aria-selected="true"] {
  color: var(--tone-90);
  border-color: var(--tone-90);
}
.community-aside {
  background:
    radial-gradient(ellipse at top right, var(--tone-34-a26), transparent 80%), var(--tone-14);
  border-color: var(--border);
  border-radius: var(--radius-xl);
}
.community-aside h3 {
  font-size: 28px;
  color: var(--tone-96);
}
.community-aside p {
  color: var(--tone-66);
}
.community-aside .button {
  color: var(--tone-6);
}
.people-section {
  background: var(--tone-8);
  border-color: var(--border);
  padding: 75px 0 40px;
}
.avatar {
  background: var(--tone-26);
  color: var(--tone-92);
  border: 1px solid var(--border-strong);
}
.person:nth-child(2) .avatar {
  background: var(--tone-20);
  color: var(--tone-82);
}
.person:nth-child(3) .avatar {
  background: var(--tone-22);
  color: var(--tone-82);
}
.person h3 {
  color: var(--tone-92);
}
.person p {
  color: var(--tone-64);
}
.faq-list summary {
  font-size: 14px;
  color: var(--tone-88);
}
.faq-list details p {
  color: var(--tone-68);
}
.faq-section h2 {
  font-size: 50px;
  letter-spacing: -2px;
}
.faq-section h2 em {
  color: var(--tone-62);
}
.closing-section {
  border-radius: var(--radius-xl);
  background:
    radial-gradient(ellipse at 80% 100%, var(--tone-36-a32), transparent 65%), var(--tone-14);
  border-color: var(--border);
  text-align: left;
  padding: 80px 60px;
  min-height: 350px;
}
.closing-section .eyebrow {
  justify-content: flex-start;
}
.closing-section h2 {
  font-size: 56px;
  max-width: 750px;
  letter-spacing: -2.5px;
}
.closing-section h2 em {
  color: var(--tone-86);
}
.closing-section p {
  color: var(--tone-68);
}
.closing-section .button {
  position: relative;
  z-index: 2;
}
.closing-watermark {
  color: var(--tone-78-a4);
  font-size: 280px;
  bottom: -95px;
}
.site-footer {
  background: var(--tone-0);
  border-color: var(--border);
}
.footer-bottom {
  color: var(--tone-60);
}
.inner-page {
  background: var(--tone-0);
}
.local-notice {
  background: var(--tone-20);
  border-color: var(--border-strong);
  color: var(--tone-74);
}
@keyframes orbit-rotation-one {
  from {
    transform: rotateX(65deg) rotateY(-25deg) rotateZ(0);
  }
  to {
    transform: rotateX(65deg) rotateY(-25deg) rotateZ(360deg);
  }
}
@keyframes orbit-rotation-two {
  from {
    transform: rotateX(35deg) rotateY(65deg) rotateZ(0);
  }
  to {
    transform: rotateX(35deg) rotateY(65deg) rotateZ(-360deg);
  }
}
@keyframes orbit-rotation-three {
  from {
    transform: rotateX(-40deg) rotateY(45deg) rotateZ(0);
  }
  to {
    transform: rotateX(-40deg) rotateY(45deg) rotateZ(360deg);
  }
}
@keyframes star-spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes scroll-nudge {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(5px);
  }
}
@keyframes app-bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-13px);
  }
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}
@media (min-width: 1500px) {
  .immersive-hero {
    height: 850px;
  }
  .hero-caption {
    margin-top: 40px;
  }
}
@media (max-height: 780px) and (min-width: 1100px) {
  .immersive-hero {
    height: 660px;
    min-height: 660px;
  }
  .hero-caption {
    margin-top: 18px;
  }
  .experience-rail {
    min-height: 590px;
  }
  .panel-copy h3 {
    font-size: 58px;
  }
  .rail-heading h2 {
    font-size: 34px;
  }
  .rail-heading {
    margin-bottom: 10px;
  }
  .rail-guide-stack {
    height: 340px;
    width: 270px;
  }
  .rail-phone {
    transform: rotate(9deg) scale(0.82);
  }
  .rail-app-wall {
    transform: rotate(-13deg) scale(0.9);
  }
}
@media (max-width: 1099px) {
  .immersive-hero {
    padding-inline: 32px;
    height: 690px;
    min-height: 690px;
  }
  .hero-caption {
    gap: 25px;
    margin-top: 45px;
  }
  .hero-caption > span {
    padding-left: 22px;
  }
  .hero-caption .button {
    margin-left: 0;
    padding: 16px 20px;
  }
  .hero-bottom {
    left: 32px;
    right: 32px;
  }
  .experience-rail {
    height: auto;
    min-height: 0;
    padding-block: 40px;
  }
  .rail-viewport {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: thin;
    scrollbar-color: var(--tone-54) var(--tone-20);
  }
  .experience-panel {
    width: 90vw;
    min-height: 520px;
    scroll-snap-align: start;
    padding: 40px 5vw;
    gap: 25px;
    border-right: 1px solid var(--border);
  }
  .panel-copy h3 {
    font-size: 52px;
  }
  .panel-copy > p {
    font-size: 13px;
  }
  .rail-heading {
    margin-bottom: 25px;
  }
  .rail-guide-stack {
    transform: rotate(-8deg) scale(0.8);
  }
  .rail-app-wall {
    transform: rotate(-12deg) scale(0.8);
  }
  .rail-terminal {
    width: 350px;
  }
  .terminal-content {
    padding: 25px;
  }
  .rail-phone {
    transform: rotate(9deg) scale(0.85);
  }
  .rail-heading h2 {
    font-size: 37px;
  }
  .rail-heading-right p {
    font-size: 10px;
  }
  .rail-heading-right > span {
    font-size: 7px;
  }
}
@media (max-width: 760px) {
  .immersive-hero {
    height: 770px;
    min-height: 770px;
    padding: 27px 24px;
  }
  .hero-caption {
    margin-top: 35px;
    display: block;
    max-width: 310px;
  }
  .hero-caption p {
    font-size: 19px;
  }
  .hero-caption > span {
    display: block;
    padding-left: 0;
    border: 0;
    margin-top: 15px;
    font-size: 12px;
  }
  .hero-caption .button {
    margin-top: 25px;
    font-size: 12px;
    gap: 30px;
  }
  .hero-bottom {
    left: 24px;
    right: 24px;
    bottom: 25px;
  }
  .rail-heading-right {
    display: none;
  }
  .rail-heading h2 {
    font-size: 35px;
  }
  .rail-heading h2 br {
    display: block;
  }
  .rail-heading h2 > span {
    margin-left: 0;
  }
  .experience-panel {
    width: 91vw;
    grid-template-columns: 1fr;
    gap: 10px;
    min-height: 760px;
    padding: 30px 25px;
    align-content: start;
  }
  .panel-copy {
    max-width: none;
  }
  .panel-copy h3 {
    font-size: 47px;
    letter-spacing: -2.5px;
    margin: 18px 0;
  }
  .panel-copy h3 br {
    display: none;
  }
  .panel-copy > p {
    font-size: 13px;
    max-width: 340px;
  }
  .panel-copy .eyebrow {
    font-size: 8px;
  }
  .panel-link {
    margin-top: 20px;
    font-size: 12px;
  }
  .panel-visual {
    height: 350px;
    min-height: 350px;
  }
  .rail-guide-stack {
    height: 350px;
    width: 280px;
    transform: rotate(-8deg) scale(0.85);
  }
  .rail-app-wall {
    transform: rotate(-12deg) scale(0.8);
    gap: 17px;
  }
  .rail-phone {
    transform: rotate(9deg) scale(0.72);
  }
  .rail-terminal {
    width: 320px;
    transform: rotate(-5deg) scale(0.92);
  }
  .terminal-content {
    padding: 22px;
    font-size: 10px;
  }
  .terminal-content strong {
    font-size: 7px;
  }
  .rail-pagination {
    gap: 12px;
  }
  .rail-pagination button i {
    width: 28px;
  }
  .rail-footer-label {
    font-size: 6px;
    letter-spacing: 1px;
    gap: 8px;
  }
  .rail-footer-label svg {
    width: 16px;
  }
  .conversation-section {
    padding-block: 65px;
  }
  .section-top h2 {
    font-size: 32px;
  }
  .topic-row h3 {
    font-size: 12px;
  }
  .people-section {
    padding: 55px 0 35px;
  }
  .faq-section h2 {
    font-size: 40px;
  }
  .closing-section {
    padding: 45px 28px;
    min-height: 350px;
  }
  .closing-section h2 {
    font-size: 38px;
    letter-spacing: -1.8px;
  }
  .closing-section h2 em {
    display: block;
  }
  .closing-watermark {
    font-size: 200px;
    bottom: -70px;
  }
  .mobile-nav {
    background: var(--tone-10);
    border-color: var(--border);
  }
  .mobile-nav a {
    border-color: var(--border);
  }
  .mobile-nav a.active {
    color: var(--tone-90);
  }
  .menu-toggle {
    border-color: var(--border-strong);
  }
}
@media (max-width: 380px) {
  .immersive-hero {
    height: 730px;
    min-height: 730px;
  }
  .hero-caption p {
    font-size: 17px;
  }
  .hero-caption > span {
    font-size: 11px;
  }
  .rail-heading h2 {
    font-size: 32px;
  }
  .panel-copy h3 {
    font-size: 41px;
  }
  .rail-app-wall {
    transform: rotate(-12deg) scale(0.67);
  }
  .rail-terminal {
    transform: rotate(-5deg) scale(0.78);
  }
  .rail-pagination {
    gap: 8px;
  }
  .rail-pagination button i {
    width: 20px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .experience-rail {
    height: auto;
    min-height: 0;
  }
  .rail-viewport {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
  }
  .experience-panel {
    min-height: 550px;
    scroll-snap-align: start;
  }
  .site-scroll-progress {
    display: none;
  }
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
  }
}
.rail-guide-stack {
  width: 390px;
  height: 440px;
  transform: rotate(-8deg) rotateY(-14deg);
}
.guide-screen {
  height: 100%;
  overflow: hidden;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-lg);
  background: var(--tone-16);
  box-shadow: 30px 30px 70px var(--shade-a60);
  position: relative;
  mask-image: linear-gradient(#000 80%, transparent);
}
.guide-screen-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--tone-20);
  font: 8px var(--font-mono);
  letter-spacing: 1px;
  color: var(--tone-78);
  border-bottom: 1px solid var(--border-strong);
}
.guide-screen-top > span:first-child {
  letter-spacing: 4px;
  font-size: 6px;
  color: var(--tone-68);
}
.guide-screen > img {
  width: 100%;
  display: block;
  filter: brightness(0.95);
}
.guide-popover {
  position: absolute;
  right: -35px;
  bottom: 50px;
  display: flex;
  gap: 16px;
  align-items: center;
  background: var(--tone-24);
  border: 1px solid var(--tone-58);
  border-radius: var(--radius-md);
  padding: 20px 24px;
  box-shadow: 0 15px 40px var(--shade-a54);
  transform: rotate(12deg);
  font-size: 12px;
  color: var(--tone-76);
  animation: app-bob 6s ease-in-out infinite;
}
.guide-popover svg {
  color: var(--tone-90);
}
.guide-popover strong {
  color: var(--tone-94);
  font-weight: 500;
  line-height: 2;
}
.story-bridge {
  height: 740px;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border);
  background: var(--tone-2);
}
.story-image {
  position: absolute;
  inset: 0 0 0 25%;
  z-index: -2;
  transform-origin: 75% 50%;
}
.story-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  mix-blend-mode: screen;
}
.story-bridge::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    var(--tone-0) 0%,
    var(--tone-0-a92) 24%,
    var(--tone-0-a26) 70%,
    var(--tone-0-a7)
  );
  z-index: -1;
}
.story-content {
  width: min(1240px, calc(100% - 96px));
  margin: auto;
}
.story-content .eyebrow {
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--tone-76);
}
.story-words {
  font-size: clamp(60px, 6.5vw, 100px);
  line-height: 1.07;
  letter-spacing: -5px;
  font-weight: 600;
  margin: 30px 0;
}
.story-words > span {
  display: block;
}
.story-dot {
  color: var(--tone-88);
}
.story-content p {
  font-size: 16px;
  line-height: 1.8;
  color: var(--tone-72);
}
.story-content .text-link {
  margin-top: 28px;
  color: var(--tone-88);
}
.story-marker {
  position: absolute;
  right: 5vw;
  bottom: 35px;
  font: 8px var(--font-mono);
  letter-spacing: 2px;
  color: var(--tone-58);
}
@media (max-height: 780px) and (min-width: 1100px) {
  .rail-guide-stack {
    height: 340px;
    width: 300px;
  }
  .guide-popover {
    padding: 15px;
    right: -30px;
    bottom: 25px;
    font-size: 10px;
  }
}
@media (max-width: 1099px) {
  .rail-guide-stack {
    width: 340px;
    height: 420px;
    transform: rotate(-8deg) scale(0.9);
  }
  .story-bridge {
    height: 650px;
  }
  .story-words {
    font-size: 70px;
    letter-spacing: -3px;
  }
}
@media (max-width: 760px) {
  .rail-guide-stack {
    width: 290px;
    height: 350px;
    transform: rotate(-8deg) scale(0.9);
  }
  .guide-popover {
    padding: 13px 17px;
    right: -10px;
    bottom: 25px;
    font-size: 10px;
  }
  .story-bridge {
    height: 620px;
    align-items: flex-start;
    padding-top: 60px;
  }
  .story-content {
    width: calc(100% - 48px);
  }
  .story-words {
    font-size: clamp(40px, 10vw, 60px);
    letter-spacing: -2px;
    margin: 25px 0;
  }
  .story-content p {
    font-size: 13px;
  }
  .story-image {
    inset: 160px -160px -20px 0;
  }
  .story-bridge::after {
    background: linear-gradient(var(--tone-0) 5%, var(--tone-0-a66) 40%, var(--tone-0-a1) 100%);
  }
  .story-content .eyebrow {
    font-size: 8px;
  }
  .story-marker {
    font-size: 6px;
    bottom: 23px;
  }
  .story-content .text-link {
    font-size: 11px;
  }
}
.guide-expand {
  display: block;
  position: relative;
  width: 100%;
  text-align: left;
}
.guide-expand > img {
  display: block;
  width: 100%;
  filter: brightness(0.95);
}
.guide-expand > span {
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  gap: 12px;
  align-items: center;
  background: var(--tone-16-a90);
  border: 1px solid var(--tone-54);
  color: var(--tone-94);
  font: 7px var(--font-mono);
  letter-spacing: 1px;
  padding: 10px;
  opacity: 0;
  transition: opacity 0.2s;
}
.guide-expand:hover > span,
.guide-expand:focus-visible > span {
  opacity: 1;
}
.image-lightbox {
  position: fixed;
  inset: 0;
  width: min(680px, 92vw);
  max-height: 90dvh;
  margin: auto;
  padding: 0;
  background: var(--tone-14);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-xl);
  overflow: auto;
  color: var(--tone-96);
  box-shadow: 0 30px 100px var(--shade-a80);
  animation: lightbox-pop 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.image-lightbox::backdrop {
  background: var(--tone-0-a86);
  backdrop-filter: blur(12px);
}
.lightbox-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  padding: 18px 22px;
  background: var(--tone-16);
  font: 9px var(--font-mono);
  letter-spacing: 2px;
  border-bottom: 1px solid var(--border-strong);
  z-index: 1;
}
.lightbox-toolbar button {
  padding: 5px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
}
.image-lightbox > img {
  width: 100%;
  display: block;
}
@keyframes lightbox-pop {
  from {
    opacity: 0;
    transform: translateY(35px) scale(0.92);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@media (hover: none) {
  .guide-expand > span {
    opacity: 1;
  }
}
/* A single brand, quieter copy, and a device made of light. */
.branded-hero {
  height: 760px;
  min-height: 760px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 115px;
}
.tech-particle-scene {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}
.branded-hero .hero-blueprint {
  opacity: 0.4;
  background-size: 120px 120px;
}
.branded-hero .hero-ambient {
  background: radial-gradient(ellipse at 55% 40%, var(--tone-42-a22), transparent 63%);
  width: 1000px;
  right: -180px;
}
.hero-brand {
  position: relative;
  width: min(60%, 740px);
  margin: 0 0 45px -38px;
  z-index: 2;
}
.hero-brand h1 {
  margin: 0;
  line-height: 1;
}
.hero-brand-logo {
  display: block;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 2px 20px var(--tone-88-a7));
}
.footer-bottom .footer-credit {
  font-size: 12px;
  line-height: 1.7;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: baseline;
  gap: 5px;
  color: var(--tone-70);
}
.footer-credit a {
  color: var(--tone-94);
  text-decoration: underline;
  text-decoration-color: var(--tone-78-a26);
  text-underline-offset: 4px;
  transition: color .2s, text-decoration-color .2s;
}
.footer-credit a:hover {
  color: var(--tone-100);
  text-decoration-color: var(--tone-94);
}
.footer-credit a:focus-visible {
  outline: 2px solid var(--tone-88);
  outline-offset: 5px;
}
.footer-credit-partners {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  white-space: nowrap;
}
.footer-credit-cross {
  margin-inline: 0;
  color: var(--tone-66);
}
.brand-light-line {
  position: absolute;
  left: 11%;
  right: 9%;
  bottom: -25px;
  height: 1px;
  background: linear-gradient(90deg, var(--tone-86-a54), transparent);
  box-shadow: 0 0 22px var(--tone-80-a18);
}
.branded-hero .hero-caption {
  margin-top: 24px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 21px;
  max-width: 560px;
}
.branded-hero .hero-caption p {
  font-size: 26px;
  line-height: 1.45;
  font-weight: 450;
  letter-spacing: -0.7px;
  color: var(--tone-92);
}
.branded-hero .hero-caption > span {
  font-size: 14px;
  line-height: 1.65;
  padding: 0;
  border: 0;
  color: var(--tone-68);
}
.branded-hero .hero-caption > span br {
  display: none;
}
.branded-hero .hero-caption .button {
  justify-self: start;
  margin: 5px 0 0;
  padding: 17px 27px;
  font-size: 13px;
  gap: 40px;
}
.branded-hero .hero-bottom {
  font-family: var(--font-sans);
  font-size: 12px;
  letter-spacing: 0;
  color: var(--tone-62);
}
.branded-hero .scroll-cue {
  font-size: 12px;
  color: var(--tone-80);
}
.home-main .eyebrow,
.experience-rail .eyebrow,
.rail-heading-right,
.story-marker,
.aside-signoff,
.rail-footer-label {
  display: none;
}
.rail-heading {
  padding-top: 0;
  margin-bottom: 18px;
}
.rail-heading h2 {
  font-size: 40px;
}
.rail-pagination button {
  font: 12px var(--font-sans);
  gap: 12px;
}
.story-pin-shell {
  position: relative;
  overflow: visible;
}
.story-pin-shell.is-scroll-story > .experience-rail {
  position: sticky;
  top: var(--story-top, 89px);
  margin: 0;
  transform: none;
}
.experience-rail {
  padding-top: 25px;
}
.faq-section {
  align-items: start;
  position: relative;
  overflow: visible;
  gap: 100px;
}
.faq-intro {
  position: sticky;
  top: 135px;
  align-self: start;
  transform: none !important;
  opacity: 1 !important;
  padding-bottom: 30px;
}
.faq-section h2 {
  margin-top: 0;
  font-size: 56px;
  line-height: 1.08;
  color: var(--tone-98);
}
.faq-section h2 em {
  color: var(--tone-82);
}
.faq-list summary {
  padding-block: 22px;
  font-size: 15px;
  font-weight: 450;
}
.faq-list details p {
  font-size: 14px;
  line-height: 1.9;
}
.faq-search {
  max-width: 290px;
  padding-block: 14px;
  margin-block: 30px;
}
.faq-search input {
  font-size: 14px;
}
.people-section {
  position: relative;
  overflow: hidden;
  padding: 95px 0 45px;
  background:
    radial-gradient(ellipse at 5% 30%, var(--tone-28-a18), transparent 60%), var(--tone-8);
}
.people-section .section-top {
  margin-bottom: 46px;
  align-items: flex-end;
}
.people-section h2 {
  font-size: 64px;
  line-height: 1.02;
  letter-spacing: -3px;
  font-weight: 550;
}
.people-section h2 > span {
  color: var(--tone-74);
}
.people-section .section-top > .text-link {
  font-size: 15px;
  margin-bottom: 8px;
}
.people-grid.team-roster {
  display: block;
  margin: 0 0 40px;
  border-top: 1px solid var(--border);
}
.team-roster .person {
  display: grid;
  grid-template-columns: 80px 1fr 44px;
  gap: 30px;
  padding: 31px 5px;
  border-bottom: 1px solid var(--border);
  position: relative;
  transition:
    padding 0.35s,
    background 0.35s;
}
.team-roster .person:hover {
  padding-left: 22px;
  background: linear-gradient(90deg, var(--tone-38-a16), transparent);
}
.team-roster .person .avatar {
  width: 74px;
  height: 74px;
  border-radius: var(--radius-avatar);
  background: var(--tone-26);
  border: 1px solid var(--border-strong);
  font-size: 27px;
  filter: saturate(0.7);
  transition:
    filter 0.3s,
    transform 0.3s;
}
.team-roster .person:hover .avatar {
  filter: saturate(1);
  transform: rotate(-4deg);
}
.team-roster .person > div {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  align-items: center;
  column-gap: 25px;
}
.team-roster .person h3 {
  font-size: 30px;
  line-height: 1.2;
  letter-spacing: -1px;
  font-weight: 500;
  grid-column: 1;
  grid-row: 1;
  color: var(--tone-96);
}
.team-roster .person .person-handle {
  font-size: 15px;
  color: var(--tone-66);
  margin-top: 9px;
  grid-column: 1;
  grid-row: 2;
}
.team-roster .person p {
  font-size: 14px;
  line-height: 1.6;
  grid-column: 2;
  grid-row: 1/3;
  color: var(--tone-74);
  margin: 0;
}
.team-roster .person > svg {
  width: 27px;
  height: 27px;
  display: block;
  color: var(--tone-80);
}
.section-top .eyebrow + h2 {
  margin-top: 0;
}
.story-content .story-words {
  margin-top: 0;
}
@media (min-width: 1500px) {
  .branded-hero {
    height: 830px;
    min-height: 830px;
  }
  .hero-brand {
    width: 65%;
    max-width: 790px;
  }
}
@media (max-width: 1099px) {
  .branded-hero {
    height: 730px;
    min-height: 730px;
    padding-inline: 32px;
  }
  .hero-brand {
    width: 66%;
    margin-left: -25px;
  }
  .branded-hero .hero-caption p {
    font-size: 24px;
  }
  .people-section h2 {
    font-size: 54px;
  }
  .team-roster .person h3 {
    font-size: 26px;
  }
  .team-roster .person p {
    font-size: 12px;
  }
  .team-roster .person {
    gap: 22px;
  }
  .faq-section {
    gap: 40px;
  }
  .faq-section h2 {
    font-size: 43px;
  }
}
@media (max-width: 760px) {
  .branded-hero {
    height: 780px;
    min-height: 780px;
    padding: 70px 24px 90px;
    justify-content: flex-start;
  }
  .hero-brand {
    width: 100%;
    margin: 0 0 40px -18px;
  }
  .hero-brand-logo {
    width: calc(100% + 20px);
  }
  .brand-light-line {
    bottom: -24px;
  }
  .branded-hero .hero-caption {
    margin-top: 0;
    gap: 16px;
    max-width: 330px;
  }
  .branded-hero .hero-caption p {
    font-size: 22px;
  }
  .branded-hero .hero-caption > span {
    font-size: 12px;
    max-width: 290px;
  }
  .branded-hero .hero-caption .button {
    font-size: 12px;
    padding: 16px 22px;
    gap: 25px;
  }
  .branded-hero .hero-bottom {
    font-size: 11px;
  }
  .branded-hero .hero-bottom > span {
    display: none;
  }
  .rail-heading h2 {
    font-size: 34px;
  }
  .experience-rail {
    padding-top: 30px;
  }
  .people-section {
    padding: 65px 0 30px;
  }
  .people-section .section-top {
    display: flex;
    align-items: flex-end;
    gap: 20px;
  }
  .people-section h2 {
    font-size: 42px;
    letter-spacing: -2px;
  }
  .people-section .section-top > .text-link {
    font-size: 11px;
    max-width: 85px;
    gap: 7px;
  }
  .team-roster .person {
    grid-template-columns: 55px 1fr 20px;
    gap: 15px;
    padding-block: 26px;
  }
  .team-roster .person .avatar {
    width: 55px;
    height: 55px;
    border-radius: var(--radius-avatar);
  }
  .team-roster .person > div {
    display: block;
  }
  .team-roster .person h3 {
    font-size: 22px;
    letter-spacing: -0.7px;
  }
  .team-roster .person .person-handle {
    display: block;
    font-size: 12px;
    margin-top: 6px;
  }
  .team-roster .person p {
    font-size: 11px;
    margin-top: 9px;
    max-width: 210px;
  }
  .team-roster .person > svg {
    width: 18px;
    height: 18px;
  }
  .team-roster .person:hover {
    padding-left: 5px;
  }
  .faq-section {
    gap: 30px;
  }
  .faq-intro {
    position: static;
    padding-bottom: 0;
  }
  .faq-section h2 {
    font-size: 41px;
  }
  .faq-list summary {
    font-size: 14px;
    padding-block: 20px;
  }
  .faq-list details p {
    font-size: 13px;
  }
}
@media (min-width: 761px) and (max-height: 650px) {
  .faq-intro {
    top: 105px;
  }
  .faq-section h2 {
    font-size: 38px;
  }
  .faq-search {
    margin-block: 20px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .hero-brand {
    transform: none !important;
  }
  .hero-brand-logo {
    transform: none !important;
    opacity: 1 !important;
  }
  .story-pin-shell.is-scroll-story > .experience-rail {
    position: static;
  }
  .team-roster .person:hover .avatar {
    transform: none;
  }
}
/* Center the FAQ copy by its measured height, including at text zoom. */
@media (min-width: 761px) {
  .faq-intro {
    top: max(105px, calc((100svh - var(--faq-height, 324px)) / 2));
    padding-bottom: 0;
  }
}
/* The closing invitation is stationary, with a simple centered composition. */
.closing-section {
  text-align: center;
  transform: none !important;
  rotate: none !important;
  opacity: 1 !important;
  isolation: isolate;
}
.closing-section h2 {
  margin-inline: auto;
}
.closing-section p {
  margin-inline: auto;
}
.closing-section .eyebrow {
  justify-content: center;
}
.closing-watermark {
  display: none;
}
.people-section,
.closing-section {
  isolation: isolate;
}
.people-section::before,
.closing-section::before {
  content: "";
  position: absolute;
  pointer-events: none;
  inset: -25%;
  z-index: -1;
  background:
    radial-gradient(ellipse at 24% 45%, var(--tone-76-a7), transparent 48%),
    radial-gradient(ellipse at 80% 65%, var(--tone-84-a5), transparent 45%);
  animation: ambient-tide 16s ease-in-out infinite alternate;
  will-change: transform, opacity;
}
.closing-section::before {
  animation-delay: -8s;
}
.brand-light-line {
  animation: brand-current 6s ease-in-out infinite;
}
@keyframes ambient-tide {
  from {
    transform: translate3d(-4%, -2%, 0);
    opacity: 0.45;
  }
  to {
    transform: translate3d(7%, 5%, 0);
    opacity: 1;
  }
}
@keyframes brand-current {
  0%,
  100% {
    opacity: 0.45;
  }
  50% {
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .people-section::before,
  .closing-section::before,
  .brand-light-line {
    animation: none;
    will-change: auto;
  }
}
`;
