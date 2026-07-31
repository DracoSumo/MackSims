import { enableDemoFixtures } from "@/config/demoFixtures";
import * as fixtures from "./mockFixtures";

/** Sample roster/KPIs — empty in production unless NEXT_PUBLIC_ENABLE_DEMO_FIXTURES=true */
export const coachCoreStats = enableDemoFixtures ? fixtures.coachCoreStats : [];
export const athletes = enableDemoFixtures ? fixtures.athletes : [];
export const channels = enableDemoFixtures ? fixtures.channels : [];
export const playbookItems = enableDemoFixtures ? fixtures.playbookItems : [];
export const workouts = enableDemoFixtures ? fixtures.workouts : [];
export const meals = enableDemoFixtures ? fixtures.meals : [];
export const videoMoments = enableDemoFixtures ? fixtures.videoMoments : [];
export const adminCards = enableDemoFixtures ? fixtures.adminCards : [];
export const mockNudgeTargets = enableDemoFixtures ? fixtures.mockNudgeTargets : [];
export const mockGroups = enableDemoFixtures ? fixtures.mockGroups : [];
export const activityTimeline = enableDemoFixtures ? fixtures.activityTimeline : [];

/** Action entry points are product navigation, not fabricated live metrics. */
export const actionCards = fixtures.actionCards;

export { integrations } from "./mockFixtures";
