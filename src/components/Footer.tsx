import { Link } from "react-router-dom";
import { links } from "../lib/links.ts";
import Brand from "./Brand.tsx";
import Icon from "./Icon.tsx";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div>
          <Brand />
          <p>A community-run tech forum, since 2023.</p>
        </div>
        <a href={links.forum} className="text-link">
          See you on the forum <Icon name="arrow" />
        </a>
      </div>
      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} JTech Forums LLC.</p>
        <nav aria-label="Footer navigation">
          <Link viewTransition to="/privacy-policy">Privacy</Link>
          <Link viewTransition to="/terms">Terms</Link>
          <Link viewTransition to="/about">About</Link>
          <Link viewTransition to="/contact">Contact</Link>
        </nav>
        <p className="footer-credit">
          <span>Landing page built by</span>{" "}
          <span className="footer-credit-partners">
            <a href={links.samsclub}>@samsclub</a>
            <span className="footer-credit-cross" aria-label="in collaboration with">
              &times;
            </span>
            <a href={links.condvar} target="_blank" rel="noreferrer">
              condvar.com
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}
