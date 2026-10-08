# Desert of Desolation 1.5.1-alpha.41

Maintenance release for the approved response and saved-state repair patch.

- Enforces the 2,000,000-byte response limit while streaming, including multibyte UTF-8 and declared lengths.
- Cancels oversized, timed-out, rejected non-JSON and late-response bodies. Unsupported nonstreaming responses fail closed.
- Rejects same-revision changes to displayed location, equipment, spell resources and party records; key order alone is not a state change.
- Rejects duplicate and empty party IDs and preserves uncertain-action duplicate guards.
- Adds 18 response/state regression cases over alpha.40. Fresh ten-run results are in ALPHA41_TEN_RUN_QA.json.

No real campaign actions, media bytes/IDs, saved sound mix, default prompts, hosting or audience are changed. The native Site has not been republished. No production authentication, transaction, resolver, browser or physical-device evidence is inferred from these source tests.
