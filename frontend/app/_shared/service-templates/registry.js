import FeatureSplitTemplate from './FeatureSplitTemplate'
import StoryTemplate from './StoryTemplate'
import CardGridTemplate from './CardGridTemplate'

// defaultContent doubles as the mock: a new page renders as a finished layout
// straight away, so the three options can be compared before any writing.
export const SERVICE_TEMPLATES = [
  {
    id: 'feature-split',
    label: 'Feature split',
    description: 'Lede and figure side by side, then numbered feature rows.',
    Component: FeatureSplitTemplate,
    defaultContent: {
      eyebrow: 'Backend & APIs',
      heading: 'The service layer your product runs on',
      subheading:
        'We design the data model, build the API, and stay on call for it — the same people, from first call to production.',
      heroImage: null,
      intro:
        'Most backends do not fall over because the code was wrong. They fall over because nobody decided what the data meant, who was allowed to touch it, or what should happen when a third party stops answering. We settle those three things first, in writing, and the code that follows is mostly boring — which is the point.',
      features: [
        {
          title: 'Schema before endpoints',
          body: 'We model what your business actually stores before anyone writes a route. Migrations are reversible, indexed, and reviewed against the queries you will really run.',
        },
        {
          title: 'One way in',
          body: 'Auth, roles and rate limits sit in a single layer instead of being re-implemented per endpoint. Adding a client later does not mean re-auditing every route.',
        },
        {
          title: 'Failure is a feature',
          body: 'Retries, timeouts, idempotency keys and dead-letter queues are built in from the start, so a payment provider having a bad afternoon does not become your outage.',
        },
        {
          title: 'You can see it working',
          body: 'Structured logs, traces and alerts that page a human on the things that matter, wired up before launch rather than after the first incident.',
        },
      ],
      cta: { label: 'Talk through your stack', href: '#contact' },
    },
  },
  {
    id: 'story',
    label: 'Story',
    description: 'Long-form, numbered sections with a sticky rail — reads as a document.',
    Component: StoryTemplate,
    defaultContent: {
      eyebrow: 'How we work',
      heading: 'What actually happens after you say yes',
      subheading: 'Seven weeks, described honestly, including the parts that usually go unmentioned.',
      sections: [
        {
          heading: 'We argue about scope first',
          body: 'The first week is spent cutting. Almost every brief we receive contains two or three features that sound essential and turn out to be the reason the project would have been late. We would rather have that conversation before you have paid for anything than three weeks in.',
          image: null,
        },
        {
          heading: 'You see something running in week two',
          body: 'Not a slide, not a prototype in a design tool — a deployed URL you can open on your phone. It will be ugly and half of it will not work. It exists so the feedback we get is about the real thing rather than about a picture of it.',
          image: null,
        },
        {
          heading: 'The middle is unglamorous',
          body: 'Weeks three to five are data models, edge cases and the specific way your business handles refunds. This is where most of the money goes and where almost nothing looks impressive in a screenshot. We send working software every fortnight anyway.',
          image: null,
        },
        {
          heading: 'Launch is a checklist, not an event',
          body: 'Domains, certificates, monitoring, alerting, backups, rollback plan, and a written handover aimed at an engineer who has never met us. We go live on a Tuesday morning, never a Friday afternoon.',
          image: null,
        },
      ],
      cta: { label: 'Read our full charter', href: '/trust' },
    },
  },
  {
    id: 'card-grid',
    label: 'Card grid',
    description: 'Heading plus a grid of icon cards — good for a list of capabilities.',
    Component: CardGridTemplate,
    defaultContent: {
      eyebrow: 'Mobile',
      heading: 'Apps people keep on the first screen',
      subheading:
        'Native where it matters, cross-platform where it does not, and shipped to both stores by the team that built it.',
      cards: [
        {
          icon: 'icon-[lucide--smartphone]',
          title: 'iOS and Android',
          body: 'One codebase where that is honest, native modules where the platform demands it. No excuses about the other platform being "coming soon".',
        },
        {
          icon: 'icon-[lucide--wifi-off]',
          title: 'Works without signal',
          body: 'Local-first storage and a sync layer that resolves conflicts, so a basement or a train does not lose somebody a morning of work.',
        },
        {
          icon: 'icon-[lucide--bell-ring]',
          title: 'Push that is worth allowing',
          body: 'Segmented, throttled and tied to real events, because the fastest way to get uninstalled is three notifications about nothing.',
        },
        {
          icon: 'icon-[lucide--gauge]',
          title: 'Cold start under two seconds',
          body: 'Budgeted at build time and measured on mid-range Android hardware, not only on the newest phone in the office.',
        },
        {
          icon: 'icon-[lucide--shield-check]',
          title: 'Store review handled',
          body: 'Privacy manifests, data-safety forms, screenshots and the rejection appeals. You get the listing, not the paperwork.',
        },
        {
          icon: 'icon-[lucide--refresh-cw]',
          title: 'Updates without a release',
          body: 'Feature flags and remote config, so turning something off on a Sunday does not mean waiting on an app-store queue.',
        },
      ],
      cta: { label: 'See the mockups', href: '/portfolio' },
    },
  },
]

export function getTemplate(id) {
  return SERVICE_TEMPLATES.find((template) => template.id === id) ?? SERVICE_TEMPLATES[0]
}
