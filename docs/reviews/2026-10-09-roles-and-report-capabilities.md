# Role guides and useful report capabilities

Owner request: stop hiding most of the guide, separate personal/bot/admin contexts, and show
more statistics including group details, participant and post rankings, person reports and
anti-bot analysis. Latest main remains `10842bf`; work builds on the previous local reader pass.

## Implementation

Existing routes `tg| max /usage`, `/bot` and `/groups` are the three task homes. Their reader
labels are Personal account, Bots and Administration. Each guide links the three contexts;
bot and admin pages now open with a task and expected outcome. No duplicate portal routes or
changes to reviewed source fingerprints. Full native guides are visible beneath the task layer.

Rankings start with the weekly overview, then seven task sections: group information, authors,
posts, response queues/timings, newcomers/retention, one person and anti-bot checks. Examples
include a group card, author comparison, three post metrics, activity of a person in two chats
and two accounts with different spam signals. All use the same HTML/Markdown data. Numbers
are illustrative, not observations of the owner's accounts. No live account operations.

Exact example commands come from the reviewed contracts and native commands/rankings/people
pages. Telegram has `stats chats official`; its messenger-selected period and access differ from
local reports. Both tools support message/author rankings, daily charts, responses, newcomers,
retention, contact profile/context/check and member audit. Telegram deep checks may send IDs to
public spam lists; MAX does not query those lists. Scores are reasons to inspect, not verdicts
or probabilities; no automatic removals are suggested in these tasks.

Quality now scans the task layer's Markdown commands as well as native source examples. This
closes a presentation-layer validation gap. Native anchors, source links and sidebar icons stay
available. Commands/data behavior remains owned by messenger repositories; the portal owns
reader explanations and examples in `lib/role-guides.ts` and `lib/report-tasks.ts`.

## Validation

Passed: 227 unit tests; six browser cases covering all four guides in each language/tool
combination (24 route checks), plus three navigation/icon checks. These inspect mobile overflow,
WCAG accessibility, visible native commands, old heading links, role navigation, eight report
sections, matching chart totals and HTML/Markdown equivalents. The four-page cases use a
60-second budget for their four accessibility scans. Production export: 548 routes. Localization,
lint, strict command examples and version-prose guard passed. Command coverage: 899 entries,
zero reference gaps and zero invalid examples; 111 known shorthand examples remain a separate
manual-review queue. Manual preview inspection covered bot role navigation and MAX anti-bot
signals; labels now explain signals in ordinary language rather than internal reason codes.
