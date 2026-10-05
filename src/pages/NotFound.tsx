import { Link } from "react-router-dom";
import Icon from "../components/Icon.tsx";
import NoticePage from "../components/page/Notice.tsx";
import Snake from "../components/Snake.tsx";
import { links } from "../lib/links.ts";

export default function NotFound() {
  return (
    <>
      <NoticePage
        eyebrow="404"
        title="Couldn’t find that page"
        actions={
          <>
            <Link viewTransition className="button" to="/">
              Home
            </Link>
            <a className="button button-ghost" href={links.forum}>
              Go to the forum <Icon />
            </a>
          </>
        }
      >
        It may have moved or been renamed. The forum itself is at jtechforums.org.
      </NoticePage>
      <section className="snake-section">
        <p className="eyebrow">WHILE YOU'RE HERE</p>
        <Snake />
      </section>
    </>
  );
}
