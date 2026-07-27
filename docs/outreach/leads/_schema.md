# Lead CSV schema

Required columns (exact headers):

| Column | Description |
|--------|-------------|
| `business_name` | Public business name |
| `vertical` | `venue` \| `photographer` \| `charter` |
| `product` | `CurbCue` \| `ShutterBid` \| `FishCrew` |
| `contact_name` | Person or team if known (else blank) |
| `email` | Public business email |
| `phone` | Optional public phone |
| `city` | City / parish |
| `region` | e.g. Bermuda |
| `website` | Canonical site |
| `source_url` | Page where email was found |
| `verification` | See COMPLIANCE.md |
| `status` | `researched` \| `queued` \| `touched1` \| `touched2` \| `touched3` \| `replied` \| `meeting` \| `do_not_contact` |
| `last_contacted` | ISO date or blank |
| `notes` | Short ops notes only |
