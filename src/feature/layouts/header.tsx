import { IconGithub } from "@/feature/ui";
import { Link } from "gatsby";

export function Header() {
  return (
    <div>
      <div>
        <Link to="/">김민우 블로그</Link>
      </div>

      <nav>
        <ul>
          <li>
            <Link to="/blog">톺아보기</Link>
          </li>
          <li>
            <a href="https://github.com/Sunset-Kim" target="_blank">
              <img src={IconGithub} alt="김민우의깃허브" />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
