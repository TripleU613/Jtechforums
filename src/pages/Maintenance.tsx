import { Link } from "react-router-dom";
import Icon from "../components/Icon.tsx";
import NoticePage from "../components/page/Notice.tsx";
import { links } from "../lib/links.ts";

export default function Maintenance() {
  return (
    <NoticePage
      eyebrow="MAINTENANCE"
      title="We’re tuning up the site"
      actions={
        <>
          <a className="button" href={links.forum}>
            Go to the forum <Icon />
          </a>
          <Link className="button button-ghost" to="/">
            Back to home
          </Link>
        </>
      }
    >
      This page is being worked on. The forum, guides included, is up as usual.
    </NoticePage>
  );
}
