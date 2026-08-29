# DUNE Authentication — UI Specification

## 1. Purpose & Scope

**CONFIRMED REQUIREMENT**
The authentication section is the entry point to DUNE, an AI-powered GitHub contribution analysis agent. Before entering the main DUNE chat workspace, a user must either:

1. Sign in to an existing DUNE account, or
2. Sign up and create a new DUNE account.

After successful authentication, the interface transitions into the DUNE Chat Workspace. The authentication experience must feel like part of the same product as the rest of DUNE, not a separate application.

This document defines only the authentication section's UI/UX. It does not define the Chat Workspace, which will be specified separately.

---

## 2. Overall Layout

**CONFIRMED REQUIREMENT**
- The authentication page uses a centered square/near-square authentication card.
- The card is positioned centrally on the screen.
- The card uses a darker gradient/shade of the application's base color.
- The surrounding page uses a much lighter version of the same base color family.

---

## 3. Visual Design

### 3.1 Light Mode
**CONFIRMED REQUIREMENT**
- Page background: white / very light grey.
- Authentication card: a darker gradient/variant of the chosen base color.

### 3.2 Dark Mode
**CONFIRMED REQUIREMENT**
- Page background: black / dark.
- Authentication card: a darker gradient/variant of the chosen base color, while remaining visually distinguishable from the background.

### 3.3 Color System
**CONFIRMED REQUIREMENT**
- The application primarily uses two shades derived from a single base color: a lighter variant and a darker variant.
- No unrelated multi-color palette should be introduced unless explicitly required elsewhere.

**TO BE DECIDED**
- The exact base color.

---

## 4. Initial Authentication Screen

**CONFIRMED REQUIREMENT**
- On arrival, the user sees the centered authentication card with two primary choices: **Sign In** and **Sign Up**.
- One primary UI color variant represents Sign In; the other primary UI color variant represents Sign Up.
- The two options must be visually distinct and immediately understandable.
- The Sign In and Sign Up forms are not combined on the initial screen.

**CONFIRMED REQUIREMENT — Google Login Entry Point**
- A dedicated page/screen for Google login must exist within the authentication flow (e.g., reachable from the initial screen or from Sign In/Sign Up, per final navigation design).

**TO BE DECIDED**
- Where exactly the Google login entry point is placed relative to Sign In/Sign Up.
- The visual treatment, button styling, and copy for the Google login page.
- The functional/OAuth behavior of Google login (explicitly not specified — see Section 13).

---

## 5. Sign-In Screen

**CONFIRMED REQUIREMENT**
- Selecting "Sign In" transitions the card into the Sign-In form.
- Required fields: Email, Password.
- Required interaction: user enters email, enters password, submits the form.

**TO BE DECIDED**
- Exact wording, button styling, validation behavior, password visibility controls, error messages.

---

## 6. Sign-Up Screen

**CONFIRMED REQUIREMENT**
- Selecting "Sign Up" transitions the card into the Sign-Up form.
- Required fields: Email, New Password, Confirm Password, Username.
- The user can enter all required information and submit the registration form.

**TO BE DECIDED**
- Exact validation rules, password requirements, username requirements.

**EXPLICITLY NOT INCLUDED** (see Section 13): email verification, CAPTCHA.

---

## 7. Authentication Navigation

**CONFIRMED REQUIREMENT**
- The interface allows movement between: Initial authentication choice, Sign In, and Sign Up.
- **Transition behavior:** every transition between authentication states (Initial ↔ Sign In, Initial ↔ Sign Up, Sign In ↔ Sign Up, and to/from the Google login page) must be a smooth fade. The outgoing screen fades out at the same time the incoming screen fades in, so the two overlap rather than one abruptly replacing the other.
- No particular animation library or implementation technology is specified — this describes visual behavior only.

**TO BE DECIDED**
- Exact fade duration and easing curve.

---

## 8. Successful Authentication & Transition

**CONFIRMED REQUIREMENT**
- After successful Sign-In or Sign-Up, the authentication page transitions into the DUNE Chat Workspace.
- The authentication screen must not simply disappear abruptly.
- **Transition behavior:** the authentication card must visually appear to close in on itself (contract/collapse inward) as the interface leaves the authentication state, while the Chat Workspace simultaneously appears to open up (expand outward) to take its place. The overall effect should read as one continuous, connected motion rather than two separate, disconnected transitions.
- The destination — the DUNE Chat Workspace — is specified separately in another document and is not duplicated here.

**TO BE DECIDED**
- Exact animation timing, duration, easing, and implementation technique for the close-in/open-up effect.

---

## 9. UI States

**CONFIRMED REQUIREMENT**
At minimum, the following states must be accounted for:

1. Initial authentication selection
2. Sign-In form
3. Sign-Up form
4. Google login page
5. Authentication in progress
6. Successful authentication
7. Authentication failure

**TO BE DECIDED**
- Exact visual treatment of "in progress," "success," and "failure" states (e.g., loaders, messaging, iconography).
- No backend-specific behavior is defined for any state.

---

## 10. Responsive Behavior

**CONFIRMED REQUIREMENT**
- The authentication card remains visually centered.
- The card must remain usable and visually balanced across Desktop, Tablet, and Mobile.

**TO BE DECIDED**
- Exact pixel dimensions/breakpoints.

---

## 11. Accessibility

**CONFIRMED REQUIREMENT**
- Form labels must be present and associated with their inputs.
- Full keyboard navigation must be supported.
- Visible focus states must be present on all interactive elements.
- Text and UI elements must maintain readable contrast.
- Interactive elements must be clearly distinguishable from static content.
- Invalid input must produce appropriate, perceivable feedback.

**TO BE DECIDED**
- No particular frontend framework is prescribed.

---

## 12. Security Considerations

**CONFIRMED REQUIREMENT**
- The UI involves sensitive information such as passwords and must handle its visible states accordingly (e.g., input masking is implied by "Password" fields).

**OUT OF SCOPE**
- How passwords are stored, encrypted, hashed, or authenticated on the backend. These implementation details have not been provided and are not defined in this document.

---

## 13. Out of Scope / Not Yet Defined

**CONFIRMED — explicitly excluded unless specified later:**
- GitHub OAuth
- Apple Sign-In
- Microsoft Sign-In
- Forgot Password
- Email verification
- Two-factor authentication
- CAPTCHA
- Remember Me
- Organization selection
- GitHub repository selection
- Employee selection
- Chat functionality
- Dashboard functionality

**Note on Google login:** A page/screen for Google login is now a confirmed part of the authentication flow's UI structure (Section 4, Section 9). However, its underlying functionality (OAuth provider, scopes, backend handling, account linking) is **not specified** and must not be invented — see Section 4 and Section 14.

---

## 14. Open Decisions / To Be Decided

- Exact base color for the color system.
- Placement and visual design of the Google login page relative to Sign In/Sign Up.
- Functional/OAuth behavior behind the Google login page.
- Sign-In form: wording, button styling, validation behavior, password visibility controls, error messages.
- Sign-Up form: validation rules, password requirements, username requirements.
- Fade transition duration and easing (Section 7).
- Close-in/open-up transition timing, duration, easing, and implementation technique (Section 8).
- Visual treatment of in-progress, success, and failure states.
- Exact responsive breakpoints/pixel dimensions.
- Typography, spacing values, fonts, border radius, shadows, iconography.
