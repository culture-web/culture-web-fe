# React + Vite

## Local development

Use KathakalAI's shared development Supabase `rzokzctxdqagnmhqhrqd`;
production is separate: `cxtsnupbfqqosvzhwqyw`.
Obtain dev configuration, copy `.env.example` to `.env` without overwriting
existing settings, then run `npm ci` and `npm run dev`.
Configure/start the sibling backend for the same project and run its
`npm run check:dev`. Never put privileged keys in frontend configuration.
[The backend setup guide](../culture-web-be/docs/development-environment.md)
covers application signup and KB roles; organization access alone is insufficient.
Restart after env changes and sign out/back in after project or role changes.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
