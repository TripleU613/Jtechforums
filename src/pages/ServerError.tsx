import { Link } from "react-router-dom";
import Icon from "../components/Icon.tsx";
import NoticePage from "../components/page/Notice.tsx";
import { links } from "../lib/links.ts";

export default function ServerError() {
  return (
    <NoticePage
      eyebrow="500"
      title="Something went sideways"
      actions={
        <>
          <Link viewTransition className="button" to="/">
            Go home
          </Link>
          <a className="button button-ghost" href={links.siteFeedback}>
            Tell us on the forum <Icon />
          </a>
        </>
      }
    >
      Something broke on our side. Try again in a minute, and if it keeps happening, let us know.
    </NoticePage>
  );
}
