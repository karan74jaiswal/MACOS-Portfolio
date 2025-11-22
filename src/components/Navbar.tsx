import type { Navlink, NavIcon } from "#types";
import { navLinks, navIcons } from "#constants";
import DateAndTime from "./DateAndTime";

export default function Navbar() {
  return (
    <nav>
      <div>
        <img src="/images/logo.svg" alt="apple-logo" />
        <p className="font-bold">Kartikey's Portfolio</p>
        <ul>
          {navLinks.map(({ id, name }: Navlink) => (
            <li key={id}>
              <p>{name}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <ul>
          {navIcons.map(({ id, img }: NavIcon) => (
            <li key={id}>
              <img src={img} className="icon-hover" alt={`icon-${id}`} />
            </li>
          ))}
        </ul>
        <DateAndTime />
      </div>
    </nav>
  );
}
