import { CATALOGUE_IDS, GROUP_LABELS, catalogueItem, type CatalogueGroup } from './catalogue';
import { PROJECTS, SCOPE_LABELS } from './projects';
import { STYLES, STYLE_ORDER } from './styles';
import { say, strings, type Locale } from '~/i18n';

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
const METHOD_SECTIONS: { id: string; label: Record<Locale, string>; note: Record<Locale, string> }[] = [
  {
    id: 'conventions',
    label: { en: 'The three conventions', zh: '三個約定' },
    note: { en: 'Units, one space, rooms against designs', zh: '單位、共用座標、房間與設計之分' },
  },
  {
    id: slug('The project'),
    label: { en: 'The project', zh: '專案' },
    note: { en: 'Envelope, walls, ceiling, deed area', zh: '外圍、牆、天花、權狀面積' },
  },
  {
    id: slug('Each room'),
    label: { en: 'Each room', zh: '每個房間' },
    note: { en: 'Origin, shape, openings', zh: '原點、形狀、開口' },
  },
  {
    id: slug('Each design'),
    label: { en: 'Each design', zh: '每個設計' },
    note: { en: 'Style, floor, furniture, questions', zh: '色調、地板、家具、待確認' },
  },
  {
    id: slug('Each door and window'),
    label: { en: 'Each door and window', zh: '每扇門窗' },
    note: { en: 'Side, width, sill, swing', zh: '哪面牆、寬度、窗台、開向' },
  },
  {
    id: slug('Each piece of furniture'),
    label: { en: 'Each piece of furniture', zh: '每件家具' },
    note: { en: 'Position, rotation, clearance', zh: '位置、旋轉、淨空' },
  },
  {
    id: 'checks',
    label: { en: 'What is checked', zh: '檢查哪些事' },
    note: { en: 'Every finding the audit can report', zh: '檢查頁會報出的所有項目' },
  },
];

const NOTES = {
  rooms: { en: 'rooms', zh: '個空間' },
  designs: { en: 'designs', zh: '個設計' },
  objects: { en: 'objects', zh: '件物件' },
  inUse: { en: 'in use', zh: '使用中' },
  spare: { en: 'on the shelf', zh: '未使用' },
  audit: { en: 'findings for this project', zh: '此專案的檢查結果' },
} as const;

/**
 * The names below come out of the dataset and are still English in both locales. The
 * interface is translated; the content is a separate pass, and calling say() on fields
 * that are not Localised yet would only hide which is which.
 */
export function nav(locale: Locale): NavItem[] {
  const s = strings(locale);
  const note = (key: keyof typeof NOTES) => NOTES[key][locale];

  const projectChildren: NavChild[] = PROJECTS.map(({ project, rooms }) => ({
    label: say(project.name, locale),
    href: `/projects/${project.id}`,
    note:
      rooms.length === 1
        ? say(SCOPE_LABELS[project.scope], locale)
        : `${rooms.length} ${note('rooms')} · ${rooms.reduce(
            (sum, room) => sum + room.designs.length,
            0,
          )} ${note('designs')}`,
  }));

  const items = CATALOGUE_IDS.map((id) => catalogueItem(id));
  const catalogueChildren: NavChild[] = CATALOGUE_GROUPS.map((group) => ({
    group,
    count: items.filter((item) => item.group === group).length,
  }))
    .filter((entry) => entry.count > 0)
    .map((entry) => ({
      label: say(GROUP_LABELS[entry.group], locale),
      href: `/catalogue#${entry.group}`,
      note: `${entry.count} ${note('objects')}`,
    }));

  /** Which styles anything is actually drawn in, so the menu can say which are spare. */
  const used = new Set(
    PROJECTS.flatMap(({ rooms }) =>
      rooms.flatMap((room) => room.designs.map((design) => design.style)),
    ),
  );
  const styleChildren: NavChild[] = STYLE_ORDER.map((key) => ({
    label: say(STYLES[key].name, locale),
    href: `/styles#${key}`,
    note: used.has(key) ? note('inUse') : note('spare'),
  }));

  const auditChildren: NavChild[] = PROJECTS.map(({ project }) => ({
    label: say(project.name, locale),
    href: `/audit#${project.id}`,
    note: note('audit'),
  }));

  return [
    { label: s.nav.projects, href: '/', children: projectChildren },
    { label: s.nav.catalogue, href: '/catalogue', children: catalogueChildren },
    { label: s.nav.styles, href: '/styles', children: styleChildren },
    { label: s.nav.audit, href: '/audit', children: auditChildren },
    {
      label: s.nav.method,
      href: '/method',
      children: METHOD_SECTIONS.map((section) => ({
        label: section.label[locale],
        href: `/method#${section.id}`,
        note: section.note[locale],
      })),
    },
    { label: s.nav.planner, href: '/planner', children: [] },
  ];
}

/** The method page reads these to label and slug its own sections. */
export const methodSections = (locale: Locale) =>
  METHOD_SECTIONS.map((section) => ({
    id: section.id,
    label: section.label[locale],
    note: section.note[locale],
  }));
