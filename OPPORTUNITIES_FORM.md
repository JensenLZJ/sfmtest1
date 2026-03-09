# Opportunities form – responses not showing up

The opportunities form uses the **same submission system as the request page**: `fetch()` with `FormData` and `mode: 'no-cors'` to POST directly to Google Forms. If users submit but responses don’t appear, check the following.

## 1. Entry IDs must match your live Google Form

The site sends each field to Google using **entry IDs** (e.g. `entry.2005620554`). If you changed the form (added/removed/reordered questions, or created a new form), those IDs change and submissions won’t map correctly.

**How to get the correct entry IDs**

1. Open your Google Form in a browser (the one you use for “Responses”).
2. Right‑click the first question → **Inspect** (or Inspect element).
3. In the HTML, find the `<input>` for that question. Its `name` attribute will look like `entry.1234567890`. That number is the entry ID for that question.
4. Repeat for each question (name, email, class, phone, computer, presenting).

**Alternative:** In the form, use the ⋮ menu → **Get pre-filled link**. Submit once, then copy the URL. It will contain `entry.XXXXX=...` for each question. Use those `entry.XXXXX` values.

**Where to put them**

- **opportunities.html**: Update the `GOOGLE_FORM_CONFIG.entryIds` object with the correct `entry.XXXXX` for each field.

## 2. Form settings

- In Google Forms: **Settings** → ensure the form is **Accepting responses**.
- If you use “Collect email addresses” or “Limit to 1 response”, that can affect behaviour; the entry IDs above must still match.
