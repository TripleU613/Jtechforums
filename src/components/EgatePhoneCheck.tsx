import { useState } from "react";
import { links } from "../lib/links.ts";
import { useForumSearch } from "../lib/search.ts";
import Icon from "./Icon.tsx";

const EGATE_CATEGORY = "category:75";

/** "Will it work on my phone?": the eGate category's threads that mention a model. */
export default function EgatePhoneCheck() {
  const [model, setModel] = useState("");
  const search = useForumSearch(model, 600, EGATE_CATEGORY);
  const typed = model.trim().length >= 3;
  return (
    <div className="egate-check">
      <label className="egate-check-input">
        <Icon name="phone" size={18} />
        <input
          value={model}
          onChange={(event) => setModel(event.target.value)}
          placeholder="Your phone, e.g. Qin F21 Pro"
          aria-label="Your phone model"
          autoComplete="off"
        />
        {search.status === "searching" && <span className="palette-spinner" aria-label="Searching" />}
      </label>
      {typed && (
        <div className="egate-check-results" aria-live="polite">
          {search.hits.length > 0 ? (
            <>
              <p>eGate threads that mention it:</p>
              <ul>
                {search.hits.slice(0, 4).map((hit) => (
                  <li key={hit.id}>
                    <a href={hit.href}>
                      {hit.title} <Icon name="arrow" size={14} />
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : search.status === "done" ? (
            <p>
              Nothing about that phone in the eGate category yet.{" "}
              <a href={links.egateCategory}>Ask there</a> before you buy.
            </p>
          ) : search.status === "error" ? (
            <p>
              Couldn't search just now. <a href={links.egateCategory}>Browse the eGate category</a>.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
