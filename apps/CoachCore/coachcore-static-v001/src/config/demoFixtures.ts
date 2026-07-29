/**
 * Demo/sample fixtures stay off for production and external tester builds.
 * Enable only with an explicit non-production flag at build time.
 */
export const enableDemoFixtures =
  process.env.NEXT_PUBLIC_ENABLE_DEMO_FIXTURES === "true";
