import { Link } from "react-router-dom";
import team from "../../data/team.ts";
import { asset } from "../../lib/asset.ts";
import { forumUser } from "../../lib/links.ts";
import Avatar from "../Avatar.tsx";
import Icon from "../Icon.tsx";

export default function People() {
  return (
    <section className="people-section">
      <div className="container">
        <div className="section-top">
          <div>
            <span className="eyebrow">WHO RUNS IT</span>
            <h2>
              The people{" "}
              <br />
              <span>behind JTech.</span>
            </h2>
          </div>
          <Link to="/about" className="text-link">
            About JTech <Icon />
          </Link>
        </div>
        <div className="people-grid team-roster">
          {team.map((person) => (
            <a className="person" key={person.handle} href={forumUser(person.handle)}>
              <Avatar name={person.name} image={asset(person.portrait)} />
              <div>
                <h3>{person.name}</h3>
                <span className="person-handle">@{person.handle}</span>
                <p>{person.role}</p>
              </div>
              <Icon name="arrow" size={18} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
