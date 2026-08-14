import { CATALOGUE_IDS, GROUP_LABELS, catalogueItem, type CatalogueGroup } from './catalogue';
import { PROJECTS, SCOPE_LABELS } from './projects';
import { STYLES, STYLE_ORDER } from './styles';

/**
 * The navigation, built from the data rather than written out.
 *
 * Every one of these menus is a list of something the site already holds — the
 * projects, the catalogue's groups, the styles — so listing them by hand would be a
 * second copy to keep in step, and the failure would be silent: a menu that quietly
 * stops mentioning a room. Derived, a new project appears in the menu by existing.
 *
 * The anchors are the other half of the contract. A child pointing at a fragment is
 * only useful if the page carries that id, and the ids on those pages come from the
 * same keys used here.
 */

export interface NavChild {
  label: string;
  href: string;
  /** A few words under the label, so the menu says why one would pick this. */
  note?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children: NavChild[];
}

const CATALOGUE_GROUPS: CatalogueGroup[] = [
  'sleeping',
  'seating',
  'tables',
  'storage',
  'kitchen',
  'bathroom',
  'laundry',
  'floor',
];

/**
 * A heading turned into an id. Shared with the method page, which slugs the same
 * headings to label its sections: one function means the menu cannot point at a
 * fragment the page spells differently.
 */
export const slug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Headings the method page slugs for its own ids, so the two agree by construction. */
const METHOD_SECTIONS: { id: string; label: string; note: string }[] = [
  { id: 'conventions', label: 'The three conventions', note: 'Units, one space, rooms against designs' },
  { id: slug('The project'), label: 'The project', note: 'Envelope, walls, ceiling, deed area' },
  { id: slug('Each room'), label: 'Each room', note: 'Origin, shape, openings' },
  { id: slug('Each design'), label: 'Each design', note: 'Style, floor, furniture, questions' },
  { id: slug('Each door and window'), label: 'Each door and window', note: 'Side, width, sill, swing' },
  {
    id: slug('Each piece of furniture'),
    label: 'Each piece of furniture',
    note: 'Position, rotation, clearance',
  },
  { id: 'checks', label: 'What is checked', note: 'Every finding the audit can report' },
];

const projectChildren = (): NavChild[] =>
  PROJECTS.map(({ project, rooms }) => ({
    label: project.name,
    href: `/projects/${project.id}`,
    note:
      rooms.length === 1
        ? SCOPE_LABELS[project.scope]
        : `${rooms.length} rooms · ${rooms.reduce((sum, room) => sum + room.designs.length, 0)} designs`,
  }));

const catalogueChildren = (): NavChild[] => {
  const items = CATALOGUE_IDS.map((id) => catalogueItem(id));
  return CATALOGUE_GROUPS.map((group) => ({
    group,
    count: items.filter((item) => item.group === group).length,
  }))
    .filter((entry) => entry.count > 0)
    .map((entry) => ({
      label: GROUP_LABELS[entry.group],
      href: `/catalogue#${entry.group}`,
      note: `${entry.count} object${entry.count === 1 ? '' : 's'}`,
    }));
};

const styleChildren = (): NavChild[] => {
  /** Which styles anything is actually drawn in, so the menu can say which are spare. */
  const used = new Set(
    PROJECTS.flatMap(({ rooms }) =>
      rooms.flatMap((room) => room.designs.map((design) => design.style)),
    ),
  );
  return STYLE_ORDER.map((key) => ({
    label: STYLES[key].name,
    href: `/styles#${key}`,
    note: used.has(key) ? 'in use' : 'on the shelf',
  }));
};

const auditChildren = (): NavChild[] =>
  PROJECTS.map(({ project }) => ({
    label: project.name,
    href: `/audit#${project.id}`,
    note: 'findings for this project',
  }));

export const NAV: NavItem[] = [
  {
    label: 'Projects',
    href: '/',
    children: projectChildren(),
  },
  {
    label: 'Catalogue',
    href: '/catalogue',
    children: catalogueChildren(),
  },
  {
    label: 'Styles',
    href: '/styles',
    children: styleChildren(),
  },
  {
    label: 'Audit',
    href: '/audit',
    children: auditChildren(),
  },
  {
    label: 'Method',
    href: '/method',
    children: METHOD_SECTIONS.map((section) => ({
      label: section.label,
      href: `/method#${section.id}`,
      note: section.note,
    })),
  },
];
