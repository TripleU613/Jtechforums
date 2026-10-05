// Community champions (the monthly leaderboard) and the moderators.
import { css } from "../css.ts";

export default css`
.community-honors {
  position: relative;
  isolation: isolate;
  padding: 110px 0 100px;
  background: var(--tone-4);
  border-block: 1px solid var(--border);
  overflow: hidden;
}
.community-honors::before {
  content: "";
  position: absolute;
  z-index: -1;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 22% 42%, var(--tone-54-a10), transparent 55%),
    repeating-linear-gradient(90deg, transparent 0 119px, var(--tone-84-a2) 119px 120px);
}
.honors-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
  margin-bottom: 54px;
}
.honors-period {
  color: var(--tone-88);
  font-size: 13px;
  margin: 0 0 22px;
  display: flex;
  gap: 10px;
  align-items: center;
}
.honors-period::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--tone-88);
  box-shadow: 0 0 15px var(--tone-82-a44);
}
.honors-heading h2 {
  font-size: clamp(44px, 5.7vw, 82px);
  letter-spacing: -0.065em;
  line-height: 0.98;
  margin: 0;
  font-weight: 600;
}
.honors-heading h2 span {
  color: var(--tone-88);
}
.honors-heading .text-link {
  margin-bottom: 6px;
}
.honors-board {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1.08fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 14px;
}
.honors-place {
  min-width: 0;
  position: relative;
}
.honors-place-1 {
  grid-row: span 2;
}
.honors-member {
  position: relative;
  height: 100%;
  min-height: 224px;
  display: grid;
  grid-template-columns: 82px minmax(0, 1fr);
  align-content: center;
  column-gap: 24px;
  padding: 40px 34px;
  background: var(--tone-16);
  border: 1px solid var(--border);
  text-decoration: none;
  overflow: hidden;
  transition:
    background 0.25s,
    border-color 0.25s;
}
.honors-member:hover {
  background: var(--tone-20);
  border-color: var(--tone-66);
}
.honors-member:focus-visible,
.honors-mod-list a:focus-visible {
  outline: 2px solid var(--tone-88);
  outline-offset: 5px;
}
.honors-rank {
  position: absolute;
  right: 20px;
  top: 8px;
  font-size: 94px;
  font-weight: 600;
  letter-spacing: -0.08em;
  color: var(--tone-78-a7);
  line-height: 1;
  pointer-events: none;
}
.honors-medallion {
  position: relative;
  grid-row: span 2;
  align-self: center;
  display: grid;
  place-items: center;
}
.honors-portrait {
  display: grid;
  place-items: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--tone-28);
  border: 1px solid var(--tone-76-a26);
  color: var(--tone-94);
  font-size: 25px;
  overflow: hidden;
}
.honors-portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.honors-identity {
  position: relative;
  min-width: 0;
}
.honors-place-label {
  font-size: 12px;
  color: var(--tone-80);
}
.honors-identity h3 {
  font-size: clamp(20px, 2vw, 29px);
  line-height: 1.2;
  letter-spacing: -0.035em;
  overflow-wrap: anywhere;
  margin: 9px 0 16px;
  color: var(--tone-100);
}
.honors-score {
  display: flex;
  gap: 8px;
  align-items: baseline;
  color: var(--tone-70);
}
.honors-score strong {
  color: var(--tone-94);
  font-size: 26px;
  font-weight: 500;
  letter-spacing: -0.045em;
  font-variant-numeric: tabular-nums;
}
.honors-score > span {
  font-size: 12px;
}
.honors-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--tone-88);
  grid-column: 2;
  margin-top: 22px;
}
.honors-place-1 .honors-member {
  min-height: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 38px 34px;
  background:
    radial-gradient(ellipse at 50% 30%, var(--tone-32-a50), transparent 70%), var(--tone-16);
  border-top-color: var(--tone-88);
}
.honors-place-1 .honors-rank {
  font-size: 220px;
  top: 16px;
  left: 20px;
  right: auto;
  color: var(--tone-84-a4);
}
.honors-place-1 .honors-medallion {
  width: 210px;
  height: 210px;
  margin-bottom: 12px;
}
.honors-place-1 .honors-portrait {
  width: 112px;
  height: 112px;
  box-shadow:
    0 0 0 9px var(--tone-86-a3),
    0 0 50px var(--tone-82-a8);
}
.honors-laurel {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  color: var(--tone-84);
}
.honors-place-1 .honors-identity h3 {
  font-size: clamp(28px, 3.1vw, 44px);
  margin-bottom: 15px;
}
.honors-place-1 .honors-place-label {
  color: var(--tone-94);
}
.honors-place-1 .honors-score strong {
  font-size: 34px;
}
.honors-place-1 .honors-profile {
  margin-top: 24px;
}
.honors-place-1 .honors-member::after {
  content: "";
  position: absolute;
  pointer-events: none;
  width: 160%;
  height: 70px;
  top: -25%;
  left: -30%;
  background: linear-gradient(transparent, var(--tone-92-a3), transparent);
  transform: rotate(-30deg);
  animation: honors-shimmer 9s ease-in-out infinite;
}
@keyframes honors-shimmer {
  0%,
  30% {
    transform: translate3d(0, -80px, 0) rotate(-30deg);
    opacity: 0;
  }
  45% {
    opacity: 1;
  }
  80%,
  100% {
    transform: translate3d(0, 800px, 0) rotate(-30deg);
    opacity: 0;
  }
}
.honors-moderators {
  margin-top: 64px;
}
.honors-moderators header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 26px;
}
.honors-moderators h3 {
  margin: 0;
  font-size: 30px;
  letter-spacing: -0.045em;
}
.honors-moderators h3 span {
  color: var(--tone-88);
}
.honors-moderators p {
  font-size: 14px;
  color: var(--tone-72);
  margin: 0;
}
.honors-mod-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  border-top: 1px solid var(--border);
}
.honors-mod-list li {
  min-width: 0;
}
.honors-mod-list a {
  display: flex;
  height: 100%;
  position: relative;
  flex-direction: column;
  align-items: flex-start;
  padding: 30px 18px 22px;
  border-bottom: 1px solid var(--border);
  transition: background 0.25s;
}
.honors-mod-list li + li a {
  border-left: 1px solid var(--border);
}
.honors-mod-list a:hover {
  background: var(--tone-88-a3);
}
.honors-mod-list .honors-portrait {
  width: 58px;
  height: 58px;
  margin-bottom: 24px;
  border-radius: var(--radius-avatar);
  font-size: 18px;
}
.honors-mod-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--tone-98);
  overflow-wrap: anywhere;
}
.honors-mod-role {
  margin-top: 6px;
  font-size: 12px;
  color: var(--tone-70);
}
.honors-mod-list svg {
  position: absolute;
  right: 18px;
  top: 32px;
  color: var(--tone-64);
}
.honors-empty {
  min-height: 200px;
  border-block: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  color: var(--tone-80);
}
@media (max-width: 900px) {
  .honors-member {
    padding: 30px 22px;
    grid-template-columns: 58px minmax(0, 1fr);
    gap: 16px;
  }
  .honors-portrait {
    width: 58px;
    height: 58px;
  }
  .honors-mod-list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .honors-mod-list li:nth-child(3n + 1) a {
    border-left: 0;
  }
}
@media (max-width: 600px) {
  .community-honors {
    padding: 70px 0;
  }
  .honors-heading {
    align-items: flex-start;
    flex-direction: column;
    margin-bottom: 32px;
  }
  .honors-board {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
  .honors-place-1 {
    grid-row: auto;
  }
  .honors-place-1 .honors-member {
    min-height: 440px;
  }
  .honors-member {
    min-height: 210px;
  }
  .honors-identity h3 {
    font-size: 24px;
  }
  .honors-moderators {
    margin-top: 46px;
  }
  .honors-moderators header {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }
  .honors-mod-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .honors-mod-list li:nth-child(3n + 1) a {
    border-left: 1px solid var(--border);
  }
  .honors-mod-list li:nth-child(2n + 1) a {
    border-left: 0;
  }
  .honors-mod-list a {
    padding-inline: 12px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .honors-place-1 .honors-member::after {
    animation: none;
    display: none;
  }
  .honors-member,
  .honors-mod-list a {
    transition: none;
  }
}
@media (max-width: 600px) {
  .honors-mod-list {
    grid-template-columns: 1fr;
  }
  .honors-mod-list li a {
    display: grid;
    grid-template-columns: 48px minmax(0, 1fr);
    column-gap: 18px;
    padding: 22px 28px 22px 0;
    border-left: 0 !important;
  }
  .honors-mod-list .honors-portrait {
    width: 48px;
    height: 48px;
    margin: 0;
    grid-row: span 2;
  }
  .honors-mod-name {
    align-self: end;
  }
  .honors-mod-role {
    align-self: start;
  }
  .honors-mod-list svg {
    top: 38px;
    right: 0;
  }
}
`;
