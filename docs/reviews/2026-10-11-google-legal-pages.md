# Google verification pages

Base: cli-docs main `8e36002`. Owner requested privacy/terms pages and landing footer links,
using the WireCat brand without a personal legal name. WireCat is described as a personally
maintained open-source project, not a registered company. Contact comes from site.config.json.
This is Google verification preparation, not a claim of legal compliance or guaranteed approval.

| Page | Reader result | Evidence and review |
| --- | --- | --- |
| Privacy, EN/RU/ES | Understand Google access, local copies, AI transfers, revocation and site analytics | Drive google.ts, login.ts, tokens.ts, sync.ts, extraction.ts and docs/configuration.md at main 4d7a1d8; existing PostHog disclosure retained; all translated added prose read |
| Terms, EN/RU/ES | Understand permissions, content ownership, agents, third-party services and software license | Existing CLI permissions and repository licenses; no invented company, address, jurisdiction or payment terms; mandatory legal rights preserved |
| Shared footer | Reach both policies from landing and docs without sign-in or JavaScript | Existing server-rendered SiteFooter; localized same-domain links |

Google requirements: https://support.google.com/cloud/answer/15549049?hl=en and
https://support.google.com/cloud/answer/13464321?hl=en. Limited Use:
https://developers.google.com/terms/api-services-user-data-policy.

The no-JavaScript mobile browser check found existing public header overflow: menu collapse
previously depended on JavaScript. A noscript-only wrapping fallback keeps navigation reachable
on the policy pages without changing the enhanced header.

Existing privacy URL and website analytics sections/anchors remain. The privacy notice now
covers the Drive app, whose Google data is separate from website analytics. Cloud AI extraction
is explicitly disclosed, including provider settings and the restriction on general-purpose
model training. Policy text cannot enforce an external provider's data practices; the app owner
must ensure actual use remains consistent with that commitment.

The user specifically chose brand-only public wording for Google verification. GDPR Article 13
controller identity requirements were explained separately. Do not describe these pages as a
completed jurisdiction-specific legal review.

Run targeted legal-page browser checks in all three languages, mobile, JavaScript disabled;
check links, headings, Google revocation, contact, canonical URLs and overflow. Run the local
smoke suite and repository lint/typechecking. CI owns full export and broader browser coverage.
