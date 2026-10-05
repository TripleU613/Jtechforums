import projects from "../../data/projects.ts";
import { FORUM, avatarUrl, links } from "../../lib/links.ts";
import Avatar from "../Avatar.tsx";
import Icon from "../Icon.tsx";

export default function MadeByMembers() {
  return (
    <section className="container projects-section">
      <div className="section-top">
        <div>
          <span className="eyebrow">MADE BY MEMBERS</span>
          <h2>Built here, and shared.</h2>
        </div>
        <a className="text-link" href={links.memberMade}>
          More member-made projects <Icon name="arrow" size={18} />
        </a>
      </div>
      <ul className="project-grid">
        {projects.map((project) => (
          <li key={project.name}>
            <a className="project spotlight" href={`${FORUM}${project.topic}`}>
              <span className="project-kind">{project.kind}</span>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <span className="project-author">
                <Avatar name={project.author} image={avatarUrl(project.avatar, 56)} />
                <span>
                  by <strong>@{project.author}</strong>
                </span>
              </span>
              <Icon name="arrow" size={18} />
            </a>
          </li>
        ))}
      </ul>
      <p className="project-note">
        Each one has its own thread, where its maker answers questions and posts updates. Have
        something to share? <a href={`${FORUM}/new-topic`}>Post it.</a>
      </p>
    </section>
  );
}
