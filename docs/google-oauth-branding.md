# Google app branding

Configure WireCat Drive's public links and verify the domain before submitting its Google OAuth
application. These are owner steps; connecting users do not create a Google Cloud project.

Open [Google Auth platform → Branding](https://console.cloud.google.com/auth/branding) in the
same project that owns the Desktop OAuth client:

| Field | Value |
| --- | --- |
| App name | `WireCat Drive` |
| App homepage | `https://wirecat.dev/en/docs/drive` |
| Privacy policy | `https://wirecat.dev/en/privacy` |
| Terms of service | `https://wirecat.dev/en/terms` |
| Authorized domains | `wirecat.dev` |

Enter only the domain in Authorized domains: no scheme, slash, page path or localhost. The
Desktop client's temporary loopback callback is separate; do not switch to a Web client or add
an invented web callback to solve this field.

Use a monitored support address. To select hello@wirecat.dev in Google's support-email dropdown,
it must be an eligible Google-account address or a Google Group managed by your signed-in
account. Do not assume typing an arbitrary email will make it selectable. Developer contact
addresses are for Google's notices and must also be monitored.

Verify `wirecat.dev` in [Google Search Console](https://search.google.com/search-console) using
a Google account that is an owner or editor of the Cloud project. Add a Domain property for
`wirecat.dev`, copy Google's DNS TXT verification value, add that TXT record at your DNS provider,
then press Verify after DNS propagates. Keep the verification record. Google does not need
`google.com`, `googleapis.com`, `github.com` or `npmjs.com` in your app's Authorized domains.

Before submitting, open the homepage and both policy links in a signed-out browser. Check the
same privacy link is in the homepage footer, the app name matches, and the policy describes the
actual requested permissions and optional AI transfers. Google-data Limited Use commitments must
match actual provider settings. Branding verification and restricted-scope verification are
separate processes; these pages do not waive data-access review.

See Google's [branding field instructions](https://support.google.com/cloud/answer/15549049?hl=en),
[verification requirements](https://support.google.com/cloud/answer/13464321?hl=en) and
[domain ownership verification instructions](https://support.google.com/webmasters/answer/9008080).
